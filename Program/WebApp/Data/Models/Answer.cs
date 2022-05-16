namespace WebApp.Data.Models;

public class Answer
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public int Priority { get; set; }
    public string? Text { get; set; }
    public string? Image { get; set; }
    public bool IsRight { get; set; }

    public Question Question { get; set; } = default!;
}
