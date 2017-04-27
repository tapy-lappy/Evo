using Configuration.TravelConfig;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using TravelOrganizer.Api.Config;

namespace TravelOrganizer.Api.Http
{
    public class TravelHttpClient
    {
        private readonly AppSettings appSettings;

        public TravelHttpClient(AppSettings appSettings)
        {
            this.appSettings = appSettings;
        }

        private string CreateTravelServiceUrl(string serviceName)
        {
            return string.Format(appSettings.SkyScannerTravelApiServiceUrl, serviceName, appSettings.SkyScannerTravelApiKey);
        }

        public async Task<T> GetAsync<T>(string serviceName) where T : new()
        {
            var url = CreateTravelServiceUrl(serviceName);
            HttpResponseMessage response;
            using (var httpClient = new HttpClient())
                response = /*await*/ httpClient.GetAsync(url).Result;       //using Result instead of await
            if (response.StatusCode != HttpStatusCode.OK)
                throw new Exception(string.Format(Errors.HttpRequestFailed, response.RequestMessage.RequestUri.AbsoluteUri, response.StatusCode, response.ReasonPhrase));
            try
            {
                var content = await response.Content.ReadAsStringAsync();
                return await Task.Factory.StartNew<T>(() => JsonConvert.DeserializeObject<T>(content));
                //List<MediaTypeFormatter> mediaFormatterList = new List<MediaTypeFormatter> { //GlobalConfiguration.Configuration.Formatters.XmlFormatter,
                //    GlobalConfiguration.Configuration.Formatters.JsonFormatter };
                //return await response.Content.ReadAsAsync<T>(mediaFormatterList);
            }
            catch (Exception ex)
            {
                //return new T();
                return await Task.FromException<T>(ex);
            }
        }
    }
}