using WebApp.Data.Models;

namespace WebApp.Hubs;

public interface IQuizPlayer
{
    Task ReceivePlayersList(List<string> players);

    Task ReceiveStartQuiz();

    Task NextQuestion(Question question);
    Task ReceiveResults(List<PlayerInfo> results);
}
