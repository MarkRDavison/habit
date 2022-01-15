using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;
using zeno_habit_api_data.Services.Interfaces;
using zeno_habit_api_framework.Instrumentation;

namespace zeno_habit_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HabitController : Controller
    {
        private readonly ILogger logger;
        private readonly IServiceScopeFactory serviceScopeFactory;
        public HabitController(
            ILogger<HabitController> logger,
            IServiceScopeFactory serviceScopeFactory)
        {
            this.logger = logger;
            this.serviceScopeFactory = serviceScopeFactory;
        }

        [HttpGet]
        public async Task<IActionResult> Get(CancellationToken cancellationToken)
        {
            using (logger.ProfileOperation(context: "Get api/habit"))
            {
                using (var scope = serviceScopeFactory.CreateScope())
                {
                    var repo = scope.ServiceProvider.GetRequiredService<IRepository>();
                    await Task.CompletedTask;
                    return Ok("OK");
                }
            }
        }
    }
}
