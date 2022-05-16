namespace WebApp.Data.DTOs;

public class Quiz
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public List<Question> Questions { get; set; } = default!;
}
