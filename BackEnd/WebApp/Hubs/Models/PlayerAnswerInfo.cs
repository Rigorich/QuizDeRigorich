namespace WebApp.Hubs.Models;

public class PlayerAnswerInfo
{
    public int QuestionId { get; set; }
    public List<int> SelectedIds { get; set; } = default!;
    public string AnswerText { get; set; }

    public bool? IsRight { get; set; }
}
