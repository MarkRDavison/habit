using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using System.Threading.Tasks;

namespace zeno_habit_api.Core
{
    public class AllowCredentialsMiddleware
    {
        private readonly RequestDelegate _next;

        public AllowCredentialsMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            context.Response.Headers.Add(HeaderNames.AccessControlAllowCredentials, "true");
            await _next.Invoke(context);
        }
    }
}
