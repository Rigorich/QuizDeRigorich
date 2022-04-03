using Microsoft.AspNetCore.Identity;

namespace WebApp.Data.Models;

public class User
{
    public int Id { get; set; }
    public string Nickname { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
    public Guid? Token { get; set; }
    public DateTime? TokenExpiration { get; set; }
}
