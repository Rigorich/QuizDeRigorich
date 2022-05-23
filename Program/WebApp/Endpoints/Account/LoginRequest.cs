namespace WebApp.Endpoints.Account;

public class LoginRequest
{
    public string Nickname { get; set; } = default!;
    public string Password { get; set; } = default!;
}
