using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using TravelOrganizer.Api.Middleware.Abstract;
using Microsoft.Extensions.Logging;

namespace TravelOrganizer.Api.Middleware
{
    public class ErrorRequestHandlingMiddleware : BaseMiddleware
    {
        public ErrorRequestHandlingMiddleware(RequestDelegate next, ILoggerFactory loggerFactory) : base(next, loggerFactory) { }

        public override async Task Invoke(HttpContext context)
        {
            var logger = loggerFactory.CreateLogger("ERROR REQUEST HADLING MIDDLEWARE");
            logger.LogInformation("Processing request {0}", context.Request.Path);

            await base.Invoke(context);
            var statusCode = context.Response.StatusCode;
            if (statusCode == 404) await WriteToResponse(context, "404 Not Found");
            else if (statusCode == 500) await WriteToResponse(context, "500 Server Error");
            else if (statusCode == 403) await WriteToResponse(context, "403 Access Denied");
        }
    }
}
