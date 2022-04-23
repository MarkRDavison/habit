using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using zeno_habit_api.Util;
using zeno_habit_api_data.Models;
using zeno_habit_api_framework.Instrumentation;
using zeno_habit_api_service.Services.Interfaces;

namespace zeno_entity_api.Controllers
{
    public class BaseController<T> : Controller where T : class, IEntity, new()
    {
        protected readonly ILogger logger;
        protected readonly IServiceScopeFactory serviceScopeFactory;
        public BaseController(
            ILogger logger,
            IServiceScopeFactory serviceScopeFactory)
        {
            this.logger = logger;
            this.serviceScopeFactory = serviceScopeFactory;
        }

        [HttpGet]
        public async Task<IActionResult> Get(CancellationToken cancellationToken)
        {
            using (logger.ProfileOperation(context: $"GET api/{typeof(T).Name.ToLowerInvariant()}"))
            {
                using (var scope = serviceScopeFactory.CreateScope())
                {
                    var entityService = scope.ServiceProvider.GetRequiredService<IEntityService<T>>();
                    return Ok(await entityService.GetEntitiesAsync(cancellationToken));
                }
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            using (logger.ProfileOperation(context: $"GET api/{typeof(T).Name.ToLowerInvariant()}/{id}"))
            {
                using (var scope = serviceScopeFactory.CreateScope())
                {
                    var entityService = scope.ServiceProvider.GetRequiredService<IEntityService<T>>();
                    var entity = await entityService.GetEntityAsync(id, cancellationToken);
                    if (entity == null)
                    {
                        return new BadRequestResult();
                    }
                    return Ok(entity);
                }
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] T entity, CancellationToken cancellationToken)
        {
            using (logger.ProfileOperation(context: $"POST api/{typeof(T).Name.ToLowerInvariant()}"))
            {
                using (var scope = serviceScopeFactory.CreateScope())
                {
                    var entityService = scope.ServiceProvider.GetRequiredService<IEntityService<T>>();
                    var entityDefaulter = scope.ServiceProvider.GetRequiredService<IEntityDefaulter<T>>();

                    await entityDefaulter.DefaultAsync(entity, UserUtils.Create(User));

                    try
                    {
                        var savedEntity = await entityService.SaveEntityAsync(entity, cancellationToken);
                        if (savedEntity == null)
                        {
                            return new BadRequestResult();
                        }
                        return Ok(savedEntity);
                    }
                    catch (AggregateException e)
                    {
                        return new BadRequestObjectResult(new
                        {
                            Error = e.Message,
                            Validations = e.InnerExceptions.Select(e => e.Message).ToList()
                        });
                    }

                }
            }
        }

        protected virtual void PatchUpdate(T persisted, T patched)
        {
            throw new NotImplementedException();
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> Patch(Guid id, [FromBody] T patch, CancellationToken cancellationToken)
        {
            using (logger.ProfileOperation(context: $"PATCH api/{typeof(T).Name.ToLowerInvariant()}/{id}"))
            {
                using (var scope = serviceScopeFactory.CreateScope())
                {
                    var entityService = scope.ServiceProvider.GetRequiredService<IEntityService<T>>();
                    var entityDefaulter = scope.ServiceProvider.GetRequiredService<IEntityDefaulter<T>>();

                    var entity = await entityService.GetEntityAsync(id, cancellationToken);

                    PatchUpdate(entity, patch);

                    await entityDefaulter.DefaultAsync(entity, UserUtils.Create(User));

                    try
                    {
                        var savedEntity = await entityService.SaveEntityAsync(entity, cancellationToken);
                        if (savedEntity == null)
                        {
                            return new BadRequestResult();
                        }
                        return Ok(savedEntity);
                    }
                    catch (AggregateException e)
                    {
                        return new BadRequestObjectResult(new
                        {
                            Error = e.Message,
                            Validations = e.InnerExceptions.Select(e => e.Message).ToList()
                        });
                    }

                }
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            using (logger.ProfileOperation(context: $"DELETE api/{typeof(T).Name.ToLowerInvariant()}/{id}"))
            {
                {
                    using (var scope = serviceScopeFactory.CreateScope())
                    {
                        var entityService = scope.ServiceProvider.GetRequiredService<IEntityService<T>>();
                        var entity = await entityService.GetEntityAsync(id, cancellationToken);
                        if (entity == null)
                        {
                            return new NotFoundResult();
                        }

                        if (await entityService.DeleteEntityAsync(entity, cancellationToken))
                        {
                            return Ok(entity);
                        }
                        else
                        {
                            return new BadRequestResult();
                        }
                    }
                }
            }
        }
    }
}
