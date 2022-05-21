using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using WebApp.Data;

namespace WebApp.Endpoints.QuizEditor;

[Route("/api")]
public class DeleteQuiz
    : EndpointBaseSync
    .WithRequest<int>
    .WithActionResult
{
    private readonly IDbContextFactory<ApplicationDbContext> _dbContextFactory;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DeleteQuiz(IDbContextFactory<ApplicationDbContext> dbContextFactory, IHttpContextAccessor httpContextAccessor)
    {
        _dbContextFactory = dbContextFactory;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpPost("DeleteQuiz/{id}")]
    public override ActionResult Handle([FromRoute] int id)
    {
        using var db = _dbContextFactory.CreateDbContext();

        var tokenString = _httpContextAccessor.HttpContext?.Request.Headers["token"].SingleOrDefault();
        if (!Guid.TryParse(tokenString, out var token) || !db.Users.Any(u => u.Token == token))
            return Unauthorized("Unauthorized");

        var quizOwnerId = db.Quizzes.SingleOrDefault(q => q.Id == id)?.UserId;
        if (quizOwnerId is null)
            return BadRequest("Unknown quiz id");
        if (quizOwnerId != db.Users.Single(u => u.Token == token).Id)
            return Unauthorized("You must be owner of quiz");

        db.Quizzes.Remove(db.Quizzes.Single(q => q.Id == id));
        db.SaveChanges();

        return Ok();
    }
}
