using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using zeno_entity_api.Controllers;
using zeno_habit_api_data.Models;

namespace zeno_habit_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HabitController : BaseController<Habit>
    {
        public HabitController(
            ILogger<HabitController> logger,
            IServiceScopeFactory serviceScopeFactory) :
        base(
            logger,
            serviceScopeFactory
        )
        {
        }

        protected override void PatchUpdate(Habit persisted, Habit patched)
        {
            if (patched.Archived != persisted.Archived)
            {
                persisted.Archived = patched.Archived;
            }

            if (!string.IsNullOrEmpty(patched.Name) &&
                patched.Name != persisted.Name)
            {
                persisted.Name = patched.Name;
            }

            if (!string.IsNullOrEmpty(patched.Question) &&
                patched.Question != persisted.Question)
            {
                persisted.Question = patched.Question;
            }
        }

    }
}
