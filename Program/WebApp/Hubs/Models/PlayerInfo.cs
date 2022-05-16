namespace WebApp.Hubs.Models;

public class PlayerInfo
{
    public int Id { get; set; }
    public string Nickname { get; set; } = default!;
    public List<PlayerAnswerInfo> Answers { get; set; } = new();
}
