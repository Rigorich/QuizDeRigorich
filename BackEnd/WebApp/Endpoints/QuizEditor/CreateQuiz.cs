using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WebApp.Data;

namespace WebApp.Endpoints.QuizEditor;

[Route("/api")]
public class CreateQuiz
    : EndpointBaseSync
    .WithRequest<Data.DTOs.Quiz>
    .WithActionResult
{
    private readonly ApplicationDbContext _db;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateQuiz(ApplicationDbContext db, IHttpContextAccessor httpContextAccessor)
    {
        _db = db;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpPost("CreateQuiz")]
    public override ActionResult Handle([FromBody] Data.DTOs.Quiz quizDTO)
    {
        var tokenString = _httpContextAccessor.HttpContext?.Request.Headers["token"].SingleOrDefault();
        if (!Guid.TryParse(tokenString, out var token) || !_db.Users.Any(u => u.Token == token))
            throw new HttpRequestException("Unauthorized", null, HttpStatusCode.Unauthorized);

        var quiz = new Data.Models.Quiz
        {
            Title = quizDTO.Title,
            UserId = _db.Users.Single(u => u.Token == token).Id,
            Questions = quizDTO.Questions.Select((question, index) => new Data.Models.Question
            {
                Type = question.Type,
                Priority = index + 1,
                TimeLimitInSeconds = question.TimeLimitInSeconds,
                Text = question.Text,
                Image = question.Image,
                Answers = question.Answers.Select((answer, index) => new Data.Models.Answer
                {
                    Priority = index + 1,
                    Text = answer.Text,
                    Image = answer.Image,
                    IsRight = answer.IsRight,
                })
                .ToList(),
            })
            .ToList(),
        };

        _db.Quizzes.Add(quiz);
        _db.SaveChanges();

        return Ok();
    }
}
