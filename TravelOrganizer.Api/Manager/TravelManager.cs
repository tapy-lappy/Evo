using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TravelOrganizer.Api.Http;
using Configuration.TravelConfig;
using TravelOrganizer.Api.Config;

namespace TravelOrganizer.Api.Manager
{
    public class TravelManager
    {
        private readonly TravelHttpClient travelClient;
        public TravelManager(TravelHttpClient travelClient)
        {
            this.travelClient = travelClient;
        }

        public async Task<T> GetCurrenciesAsync<T>(string serviceName) where T : new()
        {
            return await travelClient.GetAsync<T>(serviceName);
            //return await Task.Run<T>(() => new T());
        }
    }
}