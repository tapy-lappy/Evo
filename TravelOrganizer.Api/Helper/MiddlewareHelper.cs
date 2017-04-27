using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TravelOrganizer.Api.Middleware;

namespace TravelOrganizer.Api.Helper
{
    public static class MiddlewareHelper
    {
        #region Test functionality
        public static IApplicationBuilder UseTestRequest(this IApplicationBuilder app)
        {
            return app.UseMiddleware<TestRequestMiddleware>();
        }

        public static IApplicationBuilder MapHomeRequest(this IApplicationBuilder app)
        {
            return app.Map("/home", applicationBuilder =>
            {
                applicationBuilder.Run(async context =>
                {
                    await context.Response.WriteAsync("Home request");
                });
            });
            //app.MapWhen()
        }

        public static void RunOthersRequests(this IApplicationBuilder app)
        {
            app.Run(async (context) =>
            {
                //await context.Response.WriteAsync("Other requests");        //uncomment to generate exception bellow
                context.Response.StatusCode = 403;                          //uncomment and how to catch exception from here outside - unprocessed exception will be generated here
            });
        }
        #endregion
    }
}
