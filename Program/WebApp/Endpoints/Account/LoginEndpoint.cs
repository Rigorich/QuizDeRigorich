using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using WebApp.Data;
using WebApp.Data.Models;
using WebApp.Helpers;

namespace WebApp.Endpoints.Account;

[Route("/api")]
public class LoginEndpoint
    : EndpointBaseSync
    .WithRequest<LoginRequest>
    .WithActionResult<User>
{
    private readonly ApplicationDbContext _db;

    public LoginEndpoint(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpPost("Login")]
    public override ActionResult<User> Handle([FromBody] LoginRequest request)
    {
        var user = _db.Set<User>()
            .SingleOrDefault(u => u.Nickname == request.Nickname);

        if (user is null)
            return BadRequest($"Wrong nickname");

        if (user.PasswordHash != PasswordHasher.ComputeHash(request.Nickname, request.Password))
            return BadRequest($"Wrong password");

        user.Token = Guid.NewGuid();
        user.TokenExpiration = DateTime.UtcNow.AddYears(42);

        _db.SaveChanges();

        return user;
    }
}
