using WebApp.Data.Models;

namespace WebApp.Hubs.Models;

public class QuestionInfo
{
    public int Id { get; set; }
    public int Priority { get; set; }
    public QuestionType Type { get; set; }
    public int TimeLimitInSeconds { get; set; }
    public string? Text { get; set; }
    public string? Image { get; set; }
    public List<AnswerInfo> Answers { get; set; } = default!;
}
