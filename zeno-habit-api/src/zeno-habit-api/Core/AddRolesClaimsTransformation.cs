using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using zeno_habit_api_service.Auth;

namespace zeno_habit_api.Core
{
    public class AddRolesClaimsTransformation : IClaimsTransformation
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        public AddRolesClaimsTransformation(IHttpContextAccessor httpContextAccessor)
        {
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
        {
            if (httpContextAccessor.HttpContext != null)
            {
                var clone = principal.Clone();
                var newIdentity = (ClaimsIdentity)clone.Identity;
                if (httpContextAccessor.HttpContext.Items.TryGetValue(AuthConstants.Token.ProxiedUserId, out var v))
                {
                    var claim = new Claim(AuthConstants.Token.ProxiedUserId, v as string);
                    newIdentity.AddClaim(claim);
                }

                return await Task.FromResult(clone);
            }

            return principal;
        }
    }
}
