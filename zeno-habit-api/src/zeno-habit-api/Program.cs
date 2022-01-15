using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System;
using System.Diagnostics;

namespace zeno_habit_api {
    public class Program {
        public static void Main(string[] args) {
            Debugger.Launch();
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => {
                    webBuilder.UseStartup<Startup>();
                    webBuilder.UseUrls(urls: Environment.GetEnvironmentVariable("ZENO_HABIT_URL") ?? "http://0.0.0.0:50000");
                })
                .ConfigureAppConfiguration((hostingContext, configurationBuilder) => {
                    configurationBuilder.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
                    configurationBuilder.AddEnvironmentVariables();
                });
    }
}
