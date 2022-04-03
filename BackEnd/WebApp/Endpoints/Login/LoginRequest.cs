namespace WebApp.Endpoints.Login;

public class LoginRequest
{
    public string Nickname { get; set; } = default!;
    public string Password { get; set; } = default!;
}
