using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;

namespace WebApp.Endpoints;

[Route("/api")]
public class Test
    : EndpointBaseSync
    .WithoutRequest
    .WithResult<string>
{
    [HttpGet("Test")]
    public override string Handle()
        => "Wunderbar!";
}
