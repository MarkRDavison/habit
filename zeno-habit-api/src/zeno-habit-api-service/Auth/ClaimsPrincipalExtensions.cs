using System.Security.Claims;

namespace zeno_habit_api_service.Auth
{
    public static class ClaimsPrincipalExtensions
    {
        public static string SubjectId(this ClaimsPrincipal user)
        {
            return user.Claims
                .FirstOrDefault(c =>
                    c.Type.Equals(ClaimTypes.NameIdentifier, StringComparison.OrdinalIgnoreCase) ||
                    c.Type.Equals(AuthConstants.Token.Sub, StringComparison.OrdinalIgnoreCase))?.Value ?? string.Empty;
        }
        public static string ProxiedUserSubjectId(this ClaimsPrincipal user)
        {
            return user.Claims?
                .FirstOrDefault(c =>
                    c.Type.Equals(AuthConstants.Token.ProxiedUserId, StringComparison.OrdinalIgnoreCase))?.Value
                ?? user.SubjectId();
        }
    }
}
