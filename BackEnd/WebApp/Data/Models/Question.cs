namespace WebApp.Data.Models;

public class Question
{
    public int Id { get; set; }
    public int QuizId { get; set; }
    public QuestionType Type { get; set; }
    public int Priority { get; set; }
    public int TimeLimitInSeconds { get; set; }
    public string? Text { get; set; }
    public string? Image { get; set; }

    public Quiz Quiz { get; set; } = default!;
    public List<Answer> Answers { get; set; } = default!;
}
