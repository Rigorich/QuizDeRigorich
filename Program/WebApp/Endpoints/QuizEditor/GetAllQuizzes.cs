using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using WebApp.Data;

namespace WebApp.Endpoints.QuizEditor;

[Route("/api")]
public class GetAllQuizzes
    : EndpointBaseSync
    .WithoutRequest
    .WithActionResult<Data.DTOs.Quiz[]>
{
    private readonly IDbContextFactory<ApplicationDbContext> _dbContextFactory;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetAllQuizzes(IDbContextFactory<ApplicationDbContext> dbContextFactory, IHttpContextAccessor httpContextAccessor)
    {
        _dbContextFactory = dbContextFactory;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpPost("GetAllQuizzes")]
    public override ActionResult<Data.DTOs.Quiz[]> Handle()
    {
        using var db = _dbContextFactory.CreateDbContext();

        var tokenString = _httpContextAccessor.HttpContext?.Request.Headers["token"].SingleOrDefault();
        if (!Guid.TryParse(tokenString, out var token) || !db.Users.Any(u => u.Token == token))
            return Unauthorized("Unauthorized");

        var userId = db.Users.Single(u => u.Token == token).Id;

        return db.Quizzes
            .Where(quiz => quiz.UserId == userId)
            .Select(quiz => new Data.DTOs.Quiz
            {
                Id = quiz.Id,
                Title = quiz.Title
            })
            .ToArray();
    }
}
