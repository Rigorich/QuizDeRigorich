using WebApp.Data.Models;

namespace WebApp.Hubs.Models;

public class QuizInfo
{
    public int QuizId { get; set; }
    public string Code { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string HostNickname { get; set; } = default!;
    public bool Finished { get; set; } = false;
    public List<Question> Questions { get; set; } = default!;

    public Question? CurrentQuestion { get; set; }

    public List<PlayerInfo> Players { get; set; } = new();
}
