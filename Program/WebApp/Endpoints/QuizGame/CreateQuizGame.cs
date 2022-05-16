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
    .WithResult<string>
{
    private readonly ApplicationDbContext _db;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateQuizGame(ApplicationDbContext db, IHttpContextAccessor httpContextAccessor)
    {
        _db = db;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpPost("CreateQuizGame/{quizId}")]
    public override string Handle([FromRoute] int quizId)
    {
        var tokenString = _httpContextAccessor.HttpContext?.Request.Headers["token"].SingleOrDefault();
        if (!Guid.TryParse(tokenString, out var token) || !_db.Users.Any(u => u.Token == token))
            throw new HttpRequestException("Unauthorized", null, HttpStatusCode.Unauthorized);

        var quiz = _db.Quizzes
            .Include(e => e.Questions).ThenInclude(e => e.Answers)
            .SingleOrDefault(e => e.Id == quizId);

        if (quiz is null)
            throw new HttpRequestException("Quiz does not exist", null, HttpStatusCode.BadRequest);

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
            HostNickname = _db.Users.Single(u => u.Token == token).Nickname,
            Questions = quiz.Questions,
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
