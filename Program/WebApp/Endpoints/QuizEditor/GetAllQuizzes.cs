using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using WebApp.Data;

namespace WebApp.Endpoints.QuizEditor;

[Route("/api")]
public class GetAllQuizzes
    : EndpointBaseSync
    .WithoutRequest
    .WithResult<Data.DTOs.Quiz[]>
{
    private readonly ApplicationDbContext _db;

    public GetAllQuizzes(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpPost("GetAllQuizzes")]
    public override Data.DTOs.Quiz[] Handle()
    {
        return _db.Quizzes.Select(quiz => new Data.DTOs.Quiz
        {
            Id = quiz.Id,
            Title = quiz.Title
        })
        .ToArray();
    }
}
