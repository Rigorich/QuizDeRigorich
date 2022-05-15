using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using WebApp.Data;

namespace WebApp.Endpoints.QuizEditor;

[Route("/api")]
public class GetQuiz
    : EndpointBaseSync
    .WithRequest<int>
    .WithResult<Data.DTOs.Quiz>
{
    private readonly ApplicationDbContext _db;

    public GetQuiz(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpPost("GetQuiz/{id}")]
    public override Data.DTOs.Quiz Handle([FromRoute] int id)
    {
        var quiz = _db.Quizzes
            .Where(q => q.Id == id)
            .Select(quiz => new Data.DTOs.Quiz
            {
                Id = quiz.Id,
                Title = quiz.Title,
                Questions = quiz.Questions
                    .OrderBy(question => question.Priority)
                    .Select(question => new Data.DTOs.Question
                    {
                        Id = question.Id,
                        Type = question.Type,
                        TimeLimitInSeconds = question.TimeLimitInSeconds,
                        Text = question.Text,
                        Image = question.Image,
                        Answers = question.Answers
                            .OrderBy(answer => answer.Priority)
                            .Select(answer => new Data.DTOs.Answer
                            {
                                Id = answer.Id,
                                Text = answer.Text,
                                Image = answer.Image,
                                IsRight = answer.IsRight,
                            })
                            .ToList(),
                    })
                    .ToList(),
            })
            .SingleOrDefault();

        return quiz!;
    }
}
