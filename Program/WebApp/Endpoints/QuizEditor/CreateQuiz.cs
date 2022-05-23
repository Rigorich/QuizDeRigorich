using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp.Data;

namespace WebApp.Endpoints.QuizEditor;

[Route("/api")]
public class CreateQuiz
    : EndpointBaseSync
    .WithoutRequest
    .WithActionResult<int>
{
    private readonly IDbContextFactory<ApplicationDbContext> _dbContextFactory;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateQuiz(IDbContextFactory<ApplicationDbContext> dbContextFactory, IHttpContextAccessor httpContextAccessor)
    {
        _dbContextFactory = dbContextFactory;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpPost("CreateQuiz")]
    public override ActionResult<int> Handle()
    {
        using var db = _dbContextFactory.CreateDbContext();

        var tokenString = _httpContextAccessor.HttpContext?.Request.Headers["token"].SingleOrDefault();
        if (!Guid.TryParse(tokenString, out var token) || !db.Users.Any(u => u.Token == token))
            return Unauthorized("Unauthorized");

        var quiz = new Data.Models.Quiz
        {
            Title = "New quiz",
            UserId = db.Users.Single(u => u.Token == token).Id,
            Questions = new(),
        };

        db.Quizzes.Add(quiz);
        db.SaveChanges();

        return quiz.Id;
    }
}
