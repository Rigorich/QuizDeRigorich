using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.Data.Models;

namespace WebApp.Hubs;

public class QuizHub : Hub<IQuizPlayer>
{
    private static readonly Dictionary<string, QuizInfo> Quizzes = new();

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

    public async Task<string> CreateQuiz(int quizId)
    {
        if (_user is null) throw new ArgumentNullException("Not authorized");

        await using var db = await _dbContextFactory.CreateDbContextAsync();

        var quiz = await db.Quizzes
            .Include(e => e.Questions).ThenInclude(e => e.Answers)
            .SingleOrDefaultAsync(e => e.Id == quizId);

        if (quiz is null)
            throw new ArgumentException("Quiz does not exist");

        var code = Guid.NewGuid().ToString();

        var info = new QuizInfo
        {
            QuizId = quizId,
            Code = code,
            HostNickname = _user!.Nickname,
            NextQuestion = quiz.Questions.GetEnumerator(),
        };

        Quizzes.Add(code, info);

        return code;
    }

    public async Task JoinQuiz(string quizCode)
    {
        if (_user is null) throw new ArgumentNullException("Not authorized");

        await Groups.AddToGroupAsync(Context.ConnectionId, quizCode);
        await Clients.Group(quizCode).ReceivePlayersList(Quizzes[quizCode].Players.Select(p => p.Name).ToList());
    }

    public Task QuitQuiz(string quizCode)
    {
        if (_user is null) throw new ArgumentNullException("Not authorized");

        Clients.OthersInGroup(quizCode).ReceivePlayersList(Quizzes[quizCode].Players.Select(p => p.Name).ToList());
        return Groups.RemoveFromGroupAsync(Context.ConnectionId, quizCode);
    }

    public Task StartQuiz(string quizCode, string[] players)
    {
        if (_user is null) throw new ArgumentNullException("Not authorized");

        return Clients.Group(quizCode).ReceiveStartQuiz();
    }

    public Task NextQuestion(string quizCode)
    {
        if (_user is null) throw new ArgumentNullException("Not authorized");

        var question = Quizzes[quizCode].NextQuestion.Current;

        if (question is null)
            return FinishQuiz(quizCode);

        return Clients.Group(quizCode).NextQuestion(question);
    }

    public async Task FinishQuiz(string quizCode)
    {
        if (_user is null) throw new ArgumentNullException("Not authorized");

        await Clients.Group(quizCode).ReceiveResults(Quizzes[quizCode].Players);
        Quizzes.Remove(quizCode);
    }
}
