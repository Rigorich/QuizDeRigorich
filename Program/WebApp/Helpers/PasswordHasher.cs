using System.Security.Cryptography;
using System.Text;

namespace WebApp.Helpers;

public static class PasswordHasher
{
    public static string ComputeHash(string nickname, string password)
    {
        var input = $" {nickname} {password} ";
        using var hasher = SHA256.Create();
        var inputBytes = Encoding.UTF8.GetBytes(input);
        var hashBytes = hasher.ComputeHash(inputBytes);
        var hash = BitConverter.ToString(hashBytes).Replace("-", string.Empty);
        return hash;
    }
}
