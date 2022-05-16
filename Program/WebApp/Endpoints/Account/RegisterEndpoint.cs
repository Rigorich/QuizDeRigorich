using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using WebApp.Data;
using WebApp.Data.Models;
using WebApp.Helpers;

namespace WebApp.Endpoints.Account;

[Route("/api")]
public class RegisterEndpoint
    : EndpointBaseSync
    .WithRequest<LoginRequest>
    .WithActionResult
{
    private readonly ApplicationDbContext _db;

    public RegisterEndpoint(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpPost("Register")]
    public override ActionResult Handle([FromBody] LoginRequest request)
    {
        var notUniqueNickname = _db.Set<User>()
            .Any(u => u.Nickname == request.Nickname);

        if (notUniqueNickname)
            return BadRequest($"Nickname already exists");

        _db.Set<User>().Add(new()
        {
            Nickname = request.Nickname,
            PasswordHash = PasswordHasher.ComputeHash(request.Nickname, request.Password),
        });

        _db.SaveChanges();

        return Ok();
    }
}
