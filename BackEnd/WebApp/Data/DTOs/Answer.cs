namespace WebApp.Data.DTOs;

public class Answer
{
    public int Id { get; set; }
    public string? Text { get; set; }
    public string? Image { get; set; }
    public bool IsRight { get; set; }
}
