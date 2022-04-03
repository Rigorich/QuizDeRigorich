using WebApp.Data.Models;

namespace WebApp.Hubs
{
    public class QuizInfo
    {
        public int QuizId { get; set; }
        public string Code { get; set; } = default!;
        public string HostNickname { get; set; } = default!;
        public IEnumerator<Question> NextQuestion { get; set; } = default!;

        public List<PlayerInfo> Players { get; set; } = new();
    }
}
