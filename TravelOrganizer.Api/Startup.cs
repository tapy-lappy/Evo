using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using TravelOrganizer.Api.Helper;
using TravelOrganizer.Api.Middleware;
using Microsoft.AspNetCore.Routing;
using TravelOrganizer.Api.Config.Section;
using Newtonsoft.Json.Serialization;
using TravelOrganizer.Api.Config;
using TravelOrganizer.Api.Http;
using Microsoft.AspNetCore.Mvc.Formatters;
using TravelOrganizer.Api.Manager;
using TravelOrganizer.Api.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Cors.Internal;
using Microsoft.Net.Http.Headers;

namespace TravelOrganizer.Api
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            if (env.IsEnvironment("Development"))       //project -> Properties -> Debug and see Environment variables: ASPNETCORE_ENVIRONMENT = Development
            {
                // This will push telemetry data through Application Insights pipeline faster, allowing you to view results immediately.
                builder.AddApplicationInsightsSettings(developerMode: true);
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<SkyScanner>(Configuration.GetSection("SkyScanner"));     //section "SkyScanner" from appsettings.json
            services.AddSingleton<AppSettings>();
            services.AddTransient<TravelHttpClient>();
            services.AddTransient<TravelManager>();

            // Add framework services.
            services.AddApplicationInsightsTelemetry(Configuration);

            services.AddCors(corsOptions => 
                corsOptions.AddPolicy("AllowTravelWebOrigin",
                corsPolicyBuilder => corsPolicyBuilder.WithOrigins(
                    "http://localhost:56188",
                    "http://localhost:52107", //XMLHttpRequest cannot load http://localhost:56120/api/skyscanner/Travel/GetService/currencies. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:9001' is therefore not allowed access.
                    "http://localhost:9001")  //need to define all hosts to allow this API to add 'Access-Control-Allow-Origin' header to the response. This header permits client browser to accept responses from API
                    .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")));
            //Session
            //services.AddDistributedMemoryCache();
            //services.AddSession();
            services.AddRouting();

            services.AddMvc(options =>
            {
                options.Filters.Add(new ExceptionFilter());
                options.Filters.Add(typeof(LastVisitFilter));
                //options.InputFormatters.Add(new XmlSerializerInputFormatter());
                //options.OutputFormatters.Add(new XmlSerializerOutputFormatter());
                //options.InputFormatters.Add(new XmlDataContractSerializerInputFormatter());
                //options.OutputFormatters.Add(new XmlDataContractSerializerOutputFormatter());
            })
            //.AddXmlSerializerFormatters()
            .AddXmlDataContractSerializerFormatters()
            .AddJsonOptions(options =>
            {
                options.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;        //mo make JSON be formatted (not like just one big text)
                //options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();   //using JSON camel case
                options.SerializerSettings.ContractResolver = new DefaultContractResolver();                    //not using JSON camel case
            })
            .AddMvcOptions(mvcOptions => {
                //With this we allow to order XML format type through query string. This enable us: 
                //1) ignore HTTP header Accept: application/json(even if it exist) and give query string format marker more priority
                //2) allow to get format type of resulted data by query string
                mvcOptions.FormatterMappings.SetMediaTypeMappingForFormat("xml", new MediaTypeHeaderValue("application/xml"));  
            });
            services.Configure<MvcOptions>(mvcOptions => mvcOptions.Filters.Add(new CorsAuthorizationFilterFactory("AllowTravelWebOrigin")));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));      //section "Logging" from appsettings.json
            loggerFactory.AddDebug();

            // подключаем файлы по умолчанию
            app.UseDefaultFiles();
            // подключаем статические файлы
            app.UseStaticFiles();
            //// добавляем поддержку каталога node_modules - app.UseFileServer() позволит сопоставлять все запросы с "/node_modules" с каталогом "node_modules"         https://metanit.com/sharp/aspnet5/13.5.php
            //app.UseFileServer(new FileServerOptions()
            //{
            //    FileProvider = new PhysicalFileProvider(
            //        Path.Combine(env.ContentRootPath, "node_modules")
            //    ),
            //    RequestPath = "/node_modules",
            //    EnableDirectoryBrowsing = false
            //});


            //app.UseSession();
            //try
            //{
            //    app.Run(async context =>
            //    {
            //        try
            //        {
            //            if (context.Session.Keys.Contains("abc"))
            //                await context.Response.WriteAsync("abc in session");
            //            else
            //            {
            //                context.Session.SetString("abc", "dfsfdfs");
            //                await context.Response.WriteAsync("abc is not in session");
            //            }
            //        }
            //        catch (Exception ex)
            //        {
            //            //here we catch excepion
            //        }
            //    });
            //}
            //catch (Exception ex)
            //{
            //    //here we don't catch exception
            //}

            //var routeBuilder = new RouteBuilder(app);
            //routeBuilder.MapRoute("default", "api/{controller=Travel}/{action=Index}");
            //app.UseRouter(routeBuilder.Build());

            ////app.UseCors()   //like a middleware
            //app.UseMiddleware<ErrorRequestHandlingMiddleware>();
            //app.UseTestRequest();
            //app.MapHomeRequest();
            //app.RunOthersRequests();
            app.UseMvc(
                routes =>
                {
                    routes.MapRoute(
                        name: "area-service",
                        template: "api/{area:exists}/{controller}/{action}/{servicename:alpha}.{format?}");
                    routes.MapRoute(
                        name: "area-default",
                        template: "api/{area:exists}/{controller}/{action}/{id?}");

                    //using without Areas
                    routes.MapRoute(
                        name: "default",
                        template: "api/{controller}/{action}/{id?}");
                }
            );
        }
    }
}
