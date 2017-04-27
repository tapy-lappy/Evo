using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace TravelOrganizer.Api.Middleware.Abstract
{
    public abstract class BaseMiddleware
    {
        protected readonly RequestDelegate next;
        protected readonly ILoggerFactory loggerFactory;

        protected BaseMiddleware(RequestDelegate next) { this.next = next; }
        protected BaseMiddleware(RequestDelegate next, ILoggerFactory loggerFactory) { this.next = next; this.loggerFactory = loggerFactory; }
        //public string GetTime() => System.DateTime.Now.ToString("hh:mm:ss");

        protected virtual async Task WriteToResponse(HttpContext context, string message) {
            await context.Response.WriteAsync(message);
        }

        public virtual async Task Invoke(HttpContext context)
        {
            await next.Invoke(context);
        }
    }
}
