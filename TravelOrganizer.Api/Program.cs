using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Builder;

namespace TravelOrganizer.Api
{
    public class Program
    {
        //class DynamicTest { public int Value { get; set; } }                      //DynamicObject & ExpandoObject 

        public static void Main(string[] args)
        {
            //dynamic d = new dynamic();      //the type 'dynamic' has no constructors defined

            //dynamic d = new DynamicTest();
            //d.Value = 5;
            //d.Value = "string";      //Exception at runtime

            var host = new WebHostBuilder()
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>()
                .Build();

            host.Run();
        }
    }
}
