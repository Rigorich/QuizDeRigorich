using WebApp.Hubs.Models;

namespace WebApp.Endpoints.QuizGame;

public class SendAnswerRequest
{
    public string QuizCode { get; set; } = default!;
    public PlayerAnswerInfo Answer { get; set; } = default!;
}
