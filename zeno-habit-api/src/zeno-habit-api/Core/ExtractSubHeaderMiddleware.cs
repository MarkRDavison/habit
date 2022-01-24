using Microsoft.AspNetCore.Http;
using System.Net;
using System.Threading.Tasks;
using zeno_habit_api_service.Auth;

namespace zeno_habit_api.Core
{
    public class ExtractSubHeaderMiddleware
    {

        private readonly RequestDelegate _next;

        public ExtractSubHeaderMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if (context.User.Identity?.IsAuthenticated ?? false)
            {
                bool valid = false;
                if (context.Request.Headers.TryGetValue(AuthConstants.Token.Sub, out var v))
                {
                    if (v.Count == 1)
                    {
                        context.Items.Add(AuthConstants.Token.ProxiedUserId, v[0]);
                        valid = true;
                    }
                }

                if (!valid)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    context.Response.Headers.Add("WWW-Authenticate", "Invalid Sub Header");
                    return;
                }
            }

            await _next.Invoke(context);
        }

    }
}
