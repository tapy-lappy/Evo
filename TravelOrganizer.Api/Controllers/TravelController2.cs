//using Configuration.Enums;
//using Configuration.TravelConfig;
//using Configuration.Helpers;
//using Newtonsoft.Json;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Linq.Expressions;
//using System.Net;
//using System.Net.Http;
//using System.Threading.Tasks;
//using TravelOrganizer.Api.Dto;
//using TravelOrganizer.Api.Http;
//using TravelOrganizer.Api.Managers;

//namespace TravelOrganizer.Api.Controllers
//{
//    [RoutePrefix("api/travel")]
//    public class TravelController : ApiController
//    {

//        //DONE: alternative way to wait till HTTP request will finished in angular 2 - http://metanit.com/web/angular2/5.3.php - it's for validation, not for HTTP requests
//        //DONE: collection for newtonsoft - http://stackoverflow.com/a/37926696
//        //DONE: removing await - it means execution flow will not wait method marked as await and will continue executing further if we remove await -> Warning CS4014  Because this call is not awaited, execution of the current method continues before the call is completed.Consider applying the 'await' operator to the result of the call.
//        //DONE: using async pipe for calls from Angular 2 - it doesn't proceed error messages, so I returned to subscribe()

//        //TODO: WebAPI - catch error from asynchronous task and errors in code
//        //TODO: CORS
//        //TODO: string.format for TypeScript
//        //TODO: ASP.NET Core moving Web project and using it's DI
//        //TODO: DI for WebAPI
//        //TODO: HttpClient vs WebClient using

//        //TODO: URLs for Angular API - some Angular configuration component which would call Web API once during creation - ngOnInit to fill it's url-string dictionary - no, not dictionary - let it be json() object of type any. Or it must be some config component with hardcoded values on Angular side
//        //TODO: switch/case from GetService() needs to transform to Expression<Func<T>> rules where T: BaseDto
//        //TODO: using Bootstrap to create page design
//        //TODO: return cream to Lina

//        //[HttpPost]
//        ////[AcceptVerbs("GET", "POST")]
//        ////[Route("getservice")]
//        //public async Task<IHttpActionResult> GetService([FromBody]string serviceName)   //need [FromBody] because the param has simple string type and can not be binided to some specifyc type
//        //{
//        //    var service = SkyScannerServicesConfig.Services.First(x => x.Value.Equals(serviceName, StringComparison.OrdinalIgnoreCase)).Key;
//        //    switch (service)
//        //    {
//        //        case TravelServiceEnum.Currencies:
//        //            var result = await new TravelManager().GetCurrenciesAsync<CurrenciesDto>(serviceName);        //what if remove await? Should we call method with suffix Async if we use async/await inside that method?
//        //            return Json(result);
//        //        default:
//        //            return NotFound();
//        //    }
//        //}




//        //public class ServiceRules
//        //{
//        //    private Dictionary<TravelServiceEnum, Expression<Func<BaseDto>>> rules = new Dictionary<TravelServiceEnum, Func<Task<BaseDto>>> {
//        //        { TravelServiceEnum.Currencies, () => await new TravelManager().GetCurrenciesAsync<CurrenciesDto>},
//        //    };
//        //    public Expression<Func<BaseDto>> GetRuleByEnumKeyAsync(TravelServiceEnum key)
//        //    {
//        //        if (!rules.ContainsKey(key)) throw new Exception(string.Format(ErrorsConfig.AbsentServiceForKey, key.FromEnum()));
//        //        return rules[key];
//        //    }
//        //}

//        [HttpGet]
//        [Route("getservice/{servicename:alpha}")]
//        public async Task<IHttpActionResult> GetService(string serviceName)
//        {
//            var service = SkyScannerServices.Services.First(x => x.Value.Equals(serviceName, StringComparison.OrdinalIgnoreCase)).Key;
//            switch (service)
//            {
//                case TravelServiceEnum.Currencies:
//                    var result = await new TravelManager().GetCurrenciesAsync<CurrenciesDto>(serviceName);        //what if remove await? Should we call method with suffix Async if we use async/await inside that method?
//                    return Json(result.Currencies);
//                default:
//                    return NotFound();
//            }
//        }
//    }
//}
