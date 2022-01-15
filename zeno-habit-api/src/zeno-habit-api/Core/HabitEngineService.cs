using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;
using zeno_habit_api.Util;

namespace zeno_habit_api.Core
{

    public interface IHabitEngineService : IHostedService
    {

    }

    public class HabitEngineService : IHabitEngineService
    {

        private readonly ILogger logger;
        private readonly IHostApplicationLifetime hostApplicationLifetime;
        private readonly IApplicationState applicationState;
        private readonly IServiceScopeFactory serviceScopeFactory;

        public HabitEngineService(
            ILogger<HabitEngineService> logger,
            IHostApplicationLifetime hostApplicationLifetime,
            IApplicationState applicationState,
            IServiceScopeFactory serviceScopeFactory
        )
        {
            this.logger = logger;
            this.hostApplicationLifetime = hostApplicationLifetime;
            this.applicationState = applicationState;
            this.serviceScopeFactory = serviceScopeFactory;
        }

        /// <inheritdoc/>
        public async Task StartAsync(CancellationToken cancellationToken)
        {
            await Task.CompletedTask;
            hostApplicationLifetime.ApplicationStarted.Register(async () => {
                applicationState.Started = true;
                await Task.CompletedTask;
                using (var scope = serviceScopeFactory.CreateScope())
                {
                }
            });

            hostApplicationLifetime.ApplicationStopping.Register(() => {
                applicationState.Ready = false;
            });

            hostApplicationLifetime.ApplicationStopped.Register(() => {
                applicationState.Ready = false;
            });

            applicationState.Ready = true;
        }

        /// <inheritdoc/>
        public async Task StopAsync(CancellationToken cancellationToken)
        {
            await Task.CompletedTask;
            if (cancellationToken.IsCancellationRequested)
            {
                logger.LogWarning("ApplicationStopped Ungracefully");
            }
            else
            {
                logger.LogInformation("ApplicationStopped Gracefully");
            }
        }

    }
}
