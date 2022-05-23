namespace WebApp.Hubs;

public interface IQuizPlayer
{
    Task ReceiveStartQuiz();
    Task AskForQuestion();
    Task SendAnswer();
    Task ReceiveFinishQuiz();
    Task AskForPlayersInfo();
}
