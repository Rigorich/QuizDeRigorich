using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WebApp.Data;

namespace WebApp.Endpoints.QuizEditor;

[Route("/api")]
public class GetAllQuizzes
    : EndpointBaseSync
    .WithoutRequest
    .WithResult<Data.DTOs.Quiz[]>
{
    private readonly ApplicationDbContext _db;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetAllQuizzes(ApplicationDbContext db, IHttpContextAccessor httpContextAccessor)
    {
        _db = db;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpPost("GetAllQuizzes")]
    public override Data.DTOs.Quiz[] Handle()
    {
        var tokenString = _httpContextAccessor.HttpContext?.Request.Headers["token"].SingleOrDefault();
        if (!Guid.TryParse(tokenString, out var token) || !_db.Users.Any(u => u.Token == token))
            throw new HttpRequestException("Unauthorized", null, HttpStatusCode.Unauthorized);

        var userId = _db.Users.Single(u => u.Token == token).Id;

        return _db.Quizzes
            .Where(quiz => quiz.UserId == userId)
            .Select(quiz => new Data.DTOs.Quiz
            {
                Id = quiz.Id,
                Title = quiz.Title
            })
            .ToArray();
    }
}
