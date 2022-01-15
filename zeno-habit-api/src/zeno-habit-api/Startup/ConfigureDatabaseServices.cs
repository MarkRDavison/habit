using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Npgsql;
using zeno_habit_api_data.Services;
using zeno_habit_api_framework.Configuration;

namespace zeno_habit_api
{
    public static class ConfigureDatabase
    {
        public static void ConfigureDatabaseServices(
               this IServiceCollection services
           )
        {

            services.AddTransient(p =>
            {
                var appSettings = p.GetRequiredService<IOptions<AppSettings>>();
                var o = new DbContextOptionsBuilder<HabitDbContext>();
                switch (appSettings.Value.DATABASE_TYPE)
                {
                    case HabitDbContext.SQLITE:
                        ConfigureSqlite(o, appSettings.Value);
                        break;
                    case HabitDbContext.POSTGRES:
                        ConfigurePostgres(o, appSettings.Value);
                        break;
                    default:
                        throw new InvalidOperationException("Invalid database type");
                }
                return new HabitDbContext(o.Options);
            });
        }

        internal static void ConfigureSqlite(
            DbContextOptionsBuilder o,
            AppSettings appSettings
        )
        {
            o.UseSqlite(appSettings.CONNECTION_STRING);
        }

        internal static void ConfigurePostgres(
            DbContextOptionsBuilder o,
            AppSettings appSettings
        )
        {
            var b = new NpgsqlConnectionStringBuilder
            {
                Host = appSettings.DATABASE_HOST,
                Port = int.Parse(appSettings.DATABASE_PORT),
                Username = appSettings.DATABASE_USER,
                Password = appSettings.DATABASE_PASSWORD,
                Database = appSettings.DATABASE_NAME
            };

            o.UseNpgsql(b.ToString());
        }
    }
}
