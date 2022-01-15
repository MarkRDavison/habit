using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

namespace zeno_habit_api.Core
{
    public class RequestResponseLoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestResponseLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.Request.Path.ToString().Contains("health"))
            {
                if (!(context.Request.Method == "GET" && context.Request.Path == "/api/download") &&
                    !(context.Request.Method == "GET" && context.Request.Path == "/api/download/all/state"))
                {
                    Console.WriteLine("========== REQ START ==========");
                    Console.WriteLine("REQUEST: {0} {1}", context.Request.Method, context.Request.Path);
                }
                await _next.Invoke(context);
                if (!(context.Request.Method == "GET" && context.Request.Path == "/api/download") &&
                    !(context.Request.Method == "GET" && context.Request.Path == "/api/download/all/state"))
                {
                    Console.WriteLine("RESPONSE: {0}", context.Response.StatusCode);
                    Console.WriteLine("========== REQ END ==========");
                }
            }
        }

    }
}
