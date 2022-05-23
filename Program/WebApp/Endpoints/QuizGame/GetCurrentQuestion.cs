using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using WebApp.Hubs;
using WebApp.Hubs.Models;

namespace WebApp.Endpoints.QuizGame;

[Route("/quiz")]
public class GetCurrentQuestion
    : EndpointBaseSync
    .WithRequest<string>
    .WithActionResult<QuestionInfo?>
{
    [HttpPost("GetCurrentQuestion/{quizCode}")]
    public override ActionResult<QuestionInfo?> Handle([FromRoute] string quizCode)
    {
        var question = QuizHub.Quizzes[quizCode].CurrentQuestion;

        if (question is null)
            return null;

        var info = new QuestionInfo
        {
            Id = question.Id,
            Priority = QuizHub.Quizzes[quizCode].Questions.IndexOf(question) + 1,
            Type = question.Type,
            TimeLimitInSeconds = question.TimeLimitInSeconds,
            Text = question.Text,
            Image = question.Image,
            Answers = question.Answers.Select((answer, index) => new AnswerInfo
            {
                Id = answer.Id,
                Priority = index + 1,
                Text = answer.Text,
                Image = answer.Image,
            })
            .ToList(),
        };

        return info;
    }
}
