﻿using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WebApp.Data;
using WebApp.Data.Models;
using WebApp.Hubs;

namespace WebApp.Endpoints.QuizGame;

[Route("/quiz")]
public class SendAnswer
    : EndpointBaseSync
    .WithRequest<SendAnswerRequest>
    .WithActionResult
{
    private readonly ApplicationDbContext _db;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public SendAnswer(ApplicationDbContext db, IHttpContextAccessor httpContextAccessor)
    {
        _db = db;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpPost("SendAnswer/{quizCode}")]
    public override ActionResult Handle([FromRoute] SendAnswerRequest request)
    {
        var tokenString = _httpContextAccessor.HttpContext?.Request.Headers["token"].SingleOrDefault();
        if (!Guid.TryParse(tokenString, out var token) || !_db.Users.Any(u => u.Token == token))
            throw new HttpRequestException("Unauthorized", null, HttpStatusCode.Unauthorized);

        var answer = request.Answer;
        var quiz = QuizHub.Quizzes[request.QuizCode];
        var question = quiz.Questions.Single(q => q.Id == answer.QuestionId);

        var rightAnswersIds = question.Answers.Where(a => a.IsRight).Select(a => a.Id);

        answer.IsRight = question.Type switch
        {
            QuestionType.Open => question.Answers.Single().Text?.Trim()?.ToLower() == answer.AnswerText.Trim().ToLower(),
            QuestionType.Single => (!rightAnswersIds.Any() && !answer.SelectedIds.Any()) || answer.SelectedIds.All(a => rightAnswersIds.Contains(a)),
            QuestionType.Multiple => question.Answers.Where(a => a.IsRight).Select(a => a.Id).ToHashSet().SetEquals(answer.SelectedIds),
            _ => throw new ArgumentOutOfRangeException(),
        };

        quiz.Players.Single(p => p.Nickname == _db.Users.Single(u => u.Token == token).Nickname).Answers.Add(answer);

        return Ok();
    }
}
