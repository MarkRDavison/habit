using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using zeno_habit_api.Core;
using zeno_habit_api.Util;
using zeno_habit_api_core.Defaulters;
using zeno_habit_api_core.Validators;
using zeno_habit_api_data.Models;
using zeno_habit_api_data.Services;
using zeno_habit_api_data.Services.Interfaces;
using zeno_habit_api_framework.Configuration;
using zeno_habit_api_service.Services;
using zeno_habit_api_service.Services.Interfaces;

namespace zeno_habit_api {
    public class Startup {
        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        public AppSettings AppSettings { get; set; }

        public static void RegisterEntityServices(IServiceCollection services)
        {
            services.AddTransient<IEntityService<Habit>, EntityService<Habit>>();
            services.AddTransient<IEntityValidator<Habit>, HabitValidator>();
            services.AddTransient<IEntityDefaulter<Habit>, HabitDefaulter>();

            services.AddTransient<IEntityService<Occurence>, EntityService<Occurence>>();
            services.AddTransient<IEntityValidator<Occurence>, OccurenceValidator>();
            services.AddTransient<IEntityDefaulter<Occurence>, OccurenceDefaulter>();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            AppSettings = services.ConfigureSettingsServices(Configuration);
            if (AppSettings == null) { throw new InvalidOperationException(); }

            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders =
                    ForwardedHeaders.XForwardedFor |
                    ForwardedHeaders.XForwardedHost |
                    ForwardedHeaders.XForwardedProto;
            });
            services
                .AddControllers();
            services
                .ConfigureHealthCheckServices();

            services
                .AddOptions<HostOptions>()
                .Configure(opt => opt.ShutdownTimeout = TimeSpan.FromSeconds(5));

            services.AddSingleton<IApplicationState, ApplicationState>();
            services.AddTransient<IRepository, Repository>();

            RegisterEntityServices(services);

            services.ConfigureAuthServices(AppSettings);

            services.ConfigureDatabaseServices();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (AppSettings == null) { throw new InvalidOperationException(); }
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
            }

            app.UseForwardedHeaders();
            app.UseCors(options => {
                options.AllowCredentials();
                options.AllowAnyMethod();
                options.AllowAnyHeader();
                options.SetIsOriginAllowed(o => true);
            });

            app.UseMiddleware<AllowCredentialsMiddleware>();

            app.UseRouting();
            app.UseAuthentication();
            app.UseMiddleware<RequestResponseLoggingMiddleware>();
            app.UseMiddleware<ExtractSubHeaderMiddleware>();
            app.UseAuthorization();

            app.UseEndpoints(endpoints => {
                endpoints
                    .MapHealthChecks();

                var controllerMapping = 
                    endpoints
                        .MapControllers();

                if (AppSettings.REQUIRE_AUTH)
                {
                    controllerMapping
                    .RequireAuthorization();
                }
            });
        }
    }
}
