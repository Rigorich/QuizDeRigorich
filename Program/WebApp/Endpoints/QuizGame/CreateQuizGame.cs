using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using WebApp.Data;
using WebApp.Hubs;
using WebApp.Hubs.Models;

namespace WebApp.Endpoints.QuizGame;

[Route("/quiz")]
public class CreateQuizGame
    : EndpointBaseSync
    .WithRequest<int>
    .WithActionResult<string>
{
    private readonly IDbContextFactory<ApplicationDbContext> _dbContextFactory;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateQuizGame(IDbContextFactory<ApplicationDbContext> dbContextFactory, IHttpContextAccessor httpContextAccessor)
    {
        _dbContextFactory = dbContextFactory;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpPost("CreateQuizGame/{quizId}")]
    public override ActionResult<string> Handle([FromRoute] int quizId)
    {
        using var db = _dbContextFactory.CreateDbContext();

        var tokenString = _httpContextAccessor.HttpContext?.Request.Headers["token"].SingleOrDefault();
        if (!Guid.TryParse(tokenString, out var token) || !db.Users.Any(u => u.Token == token))
            return Unauthorized("Unauthorized");

        var quiz = db.Quizzes
            .Include(e => e.Questions).ThenInclude(e => e.Answers)
            .SingleOrDefault(e => e.Id == quizId);

        if (quiz is null)
            return BadRequest("Quiz does not exist");

        string code;
        do
        {
            code = Random.Shared.Next(100_000, 1_000_000).ToString();
        }
        while (QuizHub.Quizzes.ContainsKey(code));

        var info = new QuizInfo
        {
            QuizId = quizId,
            Code = code,
            Title = quiz.Title,
            HostNickname = db.Users.Single(u => u.Token == token).Nickname,
            Questions = quiz.Questions.OrderBy(q => q.Priority).ToList(),
        };

        QuizHub.Quizzes.Add(code, info);

        _ = Task.Run(async () =>
        {
            await Task.Delay(TimeSpan.FromHours(1));
            QuizHub.Quizzes.Remove(code);
        });

        return code;
    }
}
