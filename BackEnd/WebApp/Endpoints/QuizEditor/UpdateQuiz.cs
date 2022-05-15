using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WebApp.Data;

namespace WebApp.Endpoints.QuizEditor;

[Route("/api")]
public class UpdateQuiz
    : EndpointBaseSync
    .WithRequest<Data.DTOs.Quiz>
    .WithActionResult
{
    private readonly ApplicationDbContext _db;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UpdateQuiz(ApplicationDbContext db, IHttpContextAccessor httpContextAccessor)
    {
        _db = db;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpPost("UpdateQuiz")]
    public override ActionResult Handle([FromBody] Data.DTOs.Quiz quizDTO)
    {
        var tokenString = _httpContextAccessor.HttpContext?.Request.Headers["token"].SingleOrDefault();
        if (!Guid.TryParse(tokenString, out var token) || !_db.Users.Any(u => u.Token == token))
            throw new HttpRequestException("Unauthorized", null, HttpStatusCode.Unauthorized);

        var quizOwnerId = _db.Quizzes.SingleOrDefault(q => q.Id == quizDTO.Id)?.UserId;
        if (quizOwnerId is null)
            throw new HttpRequestException("Unknown quiz id", null, HttpStatusCode.BadRequest);
        if (quizOwnerId != _db.Users.Single(u => u.Token == token).Id)
            throw new HttpRequestException("You must be owner of quiz", null, HttpStatusCode.Forbidden);

        var quiz = new Data.Models.Quiz
        {
            Id = quizDTO.Id,
            Title = quizDTO.Title,
            UserId = quizOwnerId.Value,
            Questions = quizDTO.Questions.Select((question, index) => new Data.Models.Question
            {
                Id = question.Id,
                Type = question.Type,
                Priority = index + 1,
                TimeLimitInSeconds = question.TimeLimitInSeconds,
                Text = question.Text,
                Image = question.Image,
                Answers = question.Answers.Select((answer, index) => new Data.Models.Answer
                {
                    Id = answer.Id,
                    Priority = index + 1,
                    Text = answer.Text,
                    Image = answer.Image,
                    IsRight = answer.IsRight,
                })
                .ToList(),
            })
            .ToList(),
        };

        _db.Quizzes.Update(quiz);
        _db.SaveChanges();

        return Ok();
    }
}
