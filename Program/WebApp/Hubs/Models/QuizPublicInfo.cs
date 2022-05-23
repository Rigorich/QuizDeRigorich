namespace WebApp.Hubs.Models;

public class QuizPublicInfo
{
    public int QuizId { get; set; }
    public string Code { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string HostNickname { get; set; } = default!;
    public int QuestionsCount { get; set; }
    public bool Finished { get; set; }
}
