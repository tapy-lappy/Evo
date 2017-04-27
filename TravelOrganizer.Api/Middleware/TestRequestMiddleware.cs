using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using TravelOrganizer.Api.Middleware.Abstract;

namespace TravelOrganizer.Api.Middleware
{
    public class TestRequestMiddleware : BaseMiddleware
    {
        public TestRequestMiddleware(RequestDelegate next) : base(next) { }

        public override async Task Invoke(HttpContext context)
        {
            //await context.Response.WriteAsync("TEST\n");
            await base.Invoke(context); //await next.Invoke(context);
        }
    }
}
