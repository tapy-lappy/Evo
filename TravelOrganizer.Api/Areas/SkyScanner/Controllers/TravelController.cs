using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Configuration.TravelConfig;
using Configuration.Enums;
using TravelOrganizer.Api.Manager;
using TravelOrganizer.Api.Dto;
using TravelOrganizer.Api.Config;
using Microsoft.Extensions.Options;
using TravelOrganizer.Api.Config.Section;
using Microsoft.Extensions.DependencyInjection;
using TravelOrganizer.Api.Controllers;
using TravelOrganizer.Api.Filters;

namespace TravelOrganizer.Api.Areas.SkyScanner.Controllers
{
    [FormatFilter]                                                                              //{format?} - A filter that will use the {format} value in the route data or query string
    [Area("SkyScanner")]
    //[Route("api/[area]/[controller]/[action]")]
    public class TravelController : BaseController
    {
        private readonly TravelManager travelManager;
        public TravelController(TravelManager travelManager, AppSettings appSettings) : base(appSettings)
        {
            //var skyScannerSettings = skyScannerConfig.Value;                                    //need to add param IOptions<SkyScanner> skyScannerConfig to params list
            ////var appSettings1 = HttpContext.RequestServices.GetService<AppSettings>();         //possible use only in actions, not in constructor
            this.travelManager = travelManager;
        }

        //https://metanit.com/sharp/aspnet5/23.6.php
        //[HttpGet]
        //[Route("{servicename:alpha}.{format?}")]
        //[Produces("application/xml")]  //[Produces("application/json")]               //explicitly set up the format for data which we return to client(we may also order final data format from client side by set up HTTP header - Accept: application/xml)
        public async Task<IActionResult> GetService(string serviceName, string format)  //may not use "format" - it's just to show that we also transmit current serialization format to controller action
        /*
           http://localhost:56120/api/skyscanner/travel/getservice/currencies.xml              //XML - {servicename:alpha}.{format?} - it's a trick with route which allows use this URL to set up XML serializer(and also getting "format" param in this action) - see Startup.cs
           http://localhost:56120/api/skyscanner/travel/getservice/currencies?format=xml       //XML
           http://localhost:56120/api/skyscanner/travel/getservice/currencies				   //JSON
        */
        {
            var service = SkyScannerServices.Services.First(x => x.Value.Equals(serviceName, StringComparison.OrdinalIgnoreCase)).Key;
            switch (service)
            {
                case TravelServiceEnum.Currencies:
                    var result = await travelManager.GetCurrenciesAsync<CurrenciesDto>(serviceName);        //what if remove await? Should we call method with suffix Async if we use async/await inside that method?
                    //return Json(result.Currencies);                   //remove direct transformation to Json
                    return new ObjectResult(result.Currencies);         //and let the WebApi to choose what formatter it should use by using content negotiations(use ObjectResult for that purpose)
                default:
                    return NotFound();
            }
        }

        //[Route("{id?}")]
        public IEnumerable<string> A(int id, string format)
        /*
            http://localhost:56120/api/skyscanner/travel/A?id=2&format=xml          //XML
            http://localhost:56120/api/skyscanner/travel/A?id=2	                    //JSON
        */
        {
#pragma warning disable CS0162 // Unreachable code detected
            return new List<string>{ "a", "b" };
#pragma warning restore CS0162 // Unreachable code detected
        }
    }
}
