using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using zeno_habit_api.Util;
using zeno_habit_api_framework.Configuration;
using zeno_habit_api_service.Auth;

namespace zeno_habit_api
{
    public static class ConfigureAuth
    {

        public static void ConfigureAuthServices(
            this IServiceCollection services,
            AppSettings appSettings
        )
        {
            services
                .AddAuthorization(o => {
                    o.DefaultPolicy = new AuthorizationPolicyBuilder()
                        .RequireSubClaim(AuthConstants.Token.Scope, AuthConstants.API.Scope)
                        .Build();
                })
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(o => {
                    o.SaveToken = true;
                    o.Authority = appSettings.AUTHORITY;
                    o.TokenValidationParameters = new TokenValidationParameters
                    {
                        ClockSkew = new TimeSpan(0, 0, 30),
                        ValidateAudience = false,
                    };
                });
        }
    }
}
