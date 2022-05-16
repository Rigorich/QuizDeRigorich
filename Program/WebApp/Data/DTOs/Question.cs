namespace WebApp.Data.DTOs;

public class Question
{
    public int Id { get; set; }
    public Models.QuestionType Type { get; set; }
    public int TimeLimitInSeconds { get; set; }
    public string? Text { get; set; }
    public string? Image { get; set; }
    public List<Answer> Answers { get; set; } = default!;
}
