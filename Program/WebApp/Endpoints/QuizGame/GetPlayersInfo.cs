using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using WebApp.Hubs;
using WebApp.Hubs.Models;

namespace WebApp.Endpoints.QuizGame;

[Route("/quiz")]
public class GetPlayersInfo
    : EndpointBaseSync
    .WithRequest<string>
    .WithResult<List<PlayerInfo>>
{
    [HttpPost("GetPlayersInfo/{quizCode}")]
    public override List<PlayerInfo> Handle([FromRoute] string quizCode)
    {
        return QuizHub.Quizzes[quizCode].Players;
    }
}
