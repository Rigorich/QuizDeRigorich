using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Net;
using WebApp.Data;
using WebApp.Data.Models;
using WebApp.Hubs.Models;

namespace WebApp.Hubs;

public class QuizHub : Hub<IQuizPlayer>
{
    public static readonly Dictionary<string, QuizInfo> Quizzes = new();

    private readonly User? _user;

    private readonly IDbContextFactory<ApplicationDbContext> _dbContextFactory;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public QuizHub(IDbContextFactory<ApplicationDbContext> dbContextFactory, IHttpContextAccessor httpContextAccessor)
    {
        _dbContextFactory = dbContextFactory;
        _httpContextAccessor = httpContextAccessor;

        var tokenString = _httpContextAccessor.HttpContext?.Request.Query["access_token"].SingleOrDefault();
        if (Guid.TryParse(tokenString, out var token))
        {
            using var db = _dbContextFactory.CreateDbContext();
            _user = db.Users.SingleOrDefault(u => u.Token == token);
        }
    }

    #region Host

    public async Task StartQuiz(string quizCode)
    {
        if (_user is null) throw new HttpRequestException("Unauthorized", null, HttpStatusCode.Unauthorized);
        if (_user.Nickname != Quizzes[quizCode].HostNickname) throw new HttpRequestException("Only host can do this", null, HttpStatusCode.Forbidden);

        if (Quizzes[quizCode].CurrentQuestion is not null) throw new HttpRequestException("Quiz already began", null, HttpStatusCode.BadRequest);
        if (Quizzes[quizCode].Finished) throw new HttpRequestException("Quiz already finished", null, HttpStatusCode.BadRequest);

        await Clients.Group(quizCode).AskForPlayersInfo();
        await Clients.Group(quizCode).ReceiveStartQuiz();

        await PlayQuiz(quizCode);
    }

    #endregion

    #region Player

    public async Task<QuizPublicInfo> JoinQuiz(string quizCode)
    {
        if (_user is null) throw new HttpRequestException("Unauthorized", null, HttpStatusCode.Unauthorized);
        if (!Quizzes.ContainsKey(quizCode)) throw new HttpRequestException("Unknown quiz code", null, HttpStatusCode.BadRequest);

        if (Quizzes[quizCode].Players.All(p => p.Id != _user.Id))
        {
            Quizzes[quizCode].Players.Add(new()
            {
                Id = _user.Id,
                Nickname = _user.Nickname,
            });
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, quizCode);
        await Clients.Group(quizCode).AskForPlayersInfo();

        var info = new QuizPublicInfo
        {
            QuizId = Quizzes[quizCode].QuizId,
            Code = quizCode,
            Title = Quizzes[quizCode].Title,
            HostNickname = Quizzes[quizCode].HostNickname,
            QuestionsCount = Quizzes[quizCode].Questions.Count,
            Finished = Quizzes[quizCode].Finished,
        };

        return info;
    }

    public async Task QuitQuiz(string quizCode)
    {
        if (_user is null) throw new HttpRequestException("Unauthorized", null, HttpStatusCode.Unauthorized);

        Quizzes[quizCode].Players.Remove(Quizzes[quizCode].Players.Single(p => p.Nickname == _user.Nickname));

        await Clients.OthersInGroup(quizCode).AskForPlayersInfo();
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, quizCode);
    }

    public void SendAnswer(string quizCode, PlayerAnswerInfo answer)
    {
    }


    #endregion

    #region Helpers

    private async Task PlayQuiz(string quizCode)
    {
        await Task.Delay(TimeSpan.FromSeconds(3));

        foreach (var question in Quizzes[quizCode].Questions)
        {
            Quizzes[quizCode].CurrentQuestion = question;

            await Clients.Group(quizCode).AskForQuestion();

            await Task.Delay(TimeSpan.FromSeconds(Quizzes[quizCode].CurrentQuestion!.TimeLimitInSeconds));

            await Clients.Group(quizCode).SendAnswer();

            await Task.Delay(TimeSpan.FromSeconds(1));
        }

        await FinishQuiz(quizCode);
    }

    private async Task FinishQuiz(string quizCode)
    {
        Quizzes[quizCode].CurrentQuestion = null;
        Quizzes[quizCode].Finished = true;

        await Clients.Group(quizCode).ReceiveFinishQuiz();
    }

    #endregion
}
