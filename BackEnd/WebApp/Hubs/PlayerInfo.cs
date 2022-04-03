namespace WebApp.Hubs
{
    public class PlayerInfo
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public int RightAnswers { get; set; }
    }
}
