using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WebApp.Data;

namespace WebApp.Endpoints.QuizEditor;

[Route("/api")]
public class DeleteQuiz
    : EndpointBaseSync
    .WithRequest<int>
    .WithActionResult
{
    private readonly ApplicationDbContext _db;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DeleteQuiz(ApplicationDbContext db, IHttpContextAccessor httpContextAccessor)
    {
        _db = db;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpPost("DeleteQuiz/{id}")]
    public override ActionResult Handle([FromRoute] int id)
    {
        var tokenString = _httpContextAccessor.HttpContext?.Request.Headers["token"].SingleOrDefault();
        if (!Guid.TryParse(tokenString, out var token) || !_db.Users.Any(u => u.Token == token))
            throw new HttpRequestException("Unauthorized", null, HttpStatusCode.Unauthorized);

        var quizOwnerId = _db.Quizzes.SingleOrDefault(q => q.Id == id)?.UserId;
        if (quizOwnerId is null)
            throw new HttpRequestException("Unknown quiz id", null, HttpStatusCode.BadRequest);
        if (quizOwnerId != _db.Users.Single(u => u.Token == token).Id)
            throw new HttpRequestException("You must be owner of quiz", null, HttpStatusCode.Forbidden);

        _db.Quizzes.Remove(_db.Quizzes.Single(q => q.Id == id));
        _db.SaveChanges();

        return Ok();
    }
}
