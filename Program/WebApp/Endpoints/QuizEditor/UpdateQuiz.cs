using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using WebApp.Data;

namespace WebApp.Endpoints.QuizEditor;

[Route("/api")]
public class UpdateQuiz
    : EndpointBaseSync
    .WithRequest<Data.DTOs.Quiz>
    .WithActionResult
{
    private readonly IDbContextFactory<ApplicationDbContext> _dbContextFactory;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UpdateQuiz(IDbContextFactory<ApplicationDbContext> dbContextFactory, IHttpContextAccessor httpContextAccessor)
    {
        _dbContextFactory = dbContextFactory;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpPost("UpdateQuiz")]
    public override ActionResult Handle([FromBody] Data.DTOs.Quiz quizDTO)
    {
        using var db = _dbContextFactory.CreateDbContext();

        var tokenString = _httpContextAccessor.HttpContext?.Request.Headers["token"].SingleOrDefault();
        if (!Guid.TryParse(tokenString, out var token) || !db.Users.Any(u => u.Token == token))
            return Unauthorized("Unauthorized");

        var quiz = db.Quizzes
            .Include(q => q.Questions).ThenInclude(q => q.Answers)
            .SingleOrDefault(q => q.Id == quizDTO.Id);
        if (quiz is null)
            return BadRequest("Unknown quiz id");

        if (quiz.UserId != db.Users.Single(u => u.Token == token).Id)
            return Unauthorized("You must be owner of quiz");

        quiz.Title = quizDTO.Title;
        quiz.Questions = quizDTO.Questions
            .Select((question, index) => new Data.Models.Question
            {
                Id = question.Id,
                Type = question.Type,
                Priority = index + 1,
                TimeLimitInSeconds = question.TimeLimitInSeconds,
                Text = question.Text,
                Image = string.IsNullOrWhiteSpace(question.Image) ? null : question.Image,
                Answers = question.Answers
                    .Where(answer => !string.IsNullOrWhiteSpace(answer.Text)) // oh boy what a crutch!
                    .Select((answer, index) => new Data.Models.Answer
                    {
                        Id = answer.Id,
                        Priority = index + 1,
                        Text = answer.Text,
                        Image = answer.Image,
                        IsRight = answer.IsRight,
                    })
                    .ToList(),
            })
            .ToList();

        db.SaveChanges();

        return Ok();
    }
}
