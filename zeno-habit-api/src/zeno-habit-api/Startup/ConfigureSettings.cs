using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using zeno_habit_api_framework.Configuration;

namespace zeno_habit_api
{
    public static class ConfigureSettings
    {

        public static AppSettings ConfigureSettingsServices(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            var configured = configuration.GetSection(AppSettings.ZENO_HABIT);

            services.Configure<AppSettings>(configured);
            var appSettings = new AppSettings();
            configured.Bind(appSettings);

            return appSettings;
        }

    }
}
