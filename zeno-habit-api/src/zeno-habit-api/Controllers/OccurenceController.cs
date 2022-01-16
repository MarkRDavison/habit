using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using zeno_entity_api.Controllers;
using zeno_habit_api_data.Models;

namespace zeno_habit_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OccurenceController : BaseController<Occurence>
    {
        public OccurenceController(
            ILogger<OccurenceController> logger,
            IServiceScopeFactory serviceScopeFactory) :
        base(
            logger,
            serviceScopeFactory
        )
        {
        }

    }
}
