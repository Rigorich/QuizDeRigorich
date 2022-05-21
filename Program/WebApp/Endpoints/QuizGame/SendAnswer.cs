using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using WebApp.Data;
using WebApp.Data.Models;
using WebApp.Hubs;

namespace WebApp.Endpoints.QuizGame;

[Route("/quiz")]
public class SendAnswer
    : EndpointBaseSync
    .WithRequest<SendAnswerRequest>
    .WithActionResult
{
    private readonly IDbContextFactory<ApplicationDbContext> _dbContextFactory;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public SendAnswer(IDbContextFactory<ApplicationDbContext> dbContextFactory, IHttpContextAccessor httpContextAccessor)
    {
        _dbContextFactory = dbContextFactory;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpPost("SendAnswer")]
    public override ActionResult Handle(SendAnswerRequest request)
    {
        using var db = _dbContextFactory.CreateDbContext();

        var tokenString = _httpContextAccessor.HttpContext?.Request.Headers["token"].SingleOrDefault();
        if (!Guid.TryParse(tokenString, out var token) || !db.Users.Any(u => u.Token == token))
            return Unauthorized("Unauthorized");

        var answer = request.Answer;
        var quiz = QuizHub.Quizzes[request.QuizCode];
        var question = quiz.Questions.Single(q => q.Id == answer.QuestionId);

        var rightAnswersIds = question.Answers.Where(a => a.IsRight).Select(a => a.Id);

        answer.IsRight = question.Type switch
        {
            QuestionType.Open => question.Answers.Single().Text?.Trim()?.ToLower() == answer.AnswerText.Trim().ToLower(),
            QuestionType.Single => (!rightAnswersIds.Any() && !answer.SelectedIds.Any()) || answer.SelectedIds.All(a => rightAnswersIds.Contains(a)),
            QuestionType.Multiple => question.Answers.Where(a => a.IsRight).Select(a => a.Id).ToHashSet().SetEquals(answer.SelectedIds),
            _ => throw new ArgumentOutOfRangeException(),
        };

        var answers = quiz.Players.Single(p => p.Nickname == db.Users.Single(u => u.Token == token).Nickname).Answers;

        if (answers.Any(a => a.QuestionId == answer.QuestionId))
            answers.Remove(answers.Single(a => a.QuestionId == answer.QuestionId));

        answers.Add(answer);

        return Ok();
    }
}
