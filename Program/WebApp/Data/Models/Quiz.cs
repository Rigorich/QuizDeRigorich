namespace WebApp.Data.Models;

public class Quiz
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public int UserId { get; set; }

    public User User { get; set; } = default!;
    public List<Question> Questions { get; set; } = default!;
}
