using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;

namespace zeno_habit_api.Util
{
    public static class AuthorizationPolicyBuilderExtensions
    {
        public static AuthorizationPolicyBuilder RequireSubClaim(this AuthorizationPolicyBuilder builder, string type, params string[] scopes)
        {
            return builder.RequireAssertion(context =>
                context.User
                    .Claims
                    .Where(c => c.Type.Equals(type, StringComparison.OrdinalIgnoreCase))
                    .SelectMany(c => c.Value.Split(' '))
                    .Any(s => scopes.Contains(s, StringComparer.OrdinalIgnoreCase))
            );
        }
    }
}
