using Microsoft.Extensions.Options;
using TravelOrganizer.Api.Config.Section;

namespace TravelOrganizer.Api.Config
{
    public class AppSettings 
    {
        private readonly SkyScanner skyScanner;

        //http://stackoverflow.com/a/39491831
        public AppSettings(IOptions<SkyScanner> skyScanner)
        {
            this.skyScanner = skyScanner.Value;
        }

        public string SkyScannerTravelApiServiceUrl { get { return skyScanner.SkyScannerTravelApiServiceUrl; } }
        public string SkyScannerTravelApiKey { get { return skyScanner.SkyScannerTravelApiKey; } }
    }
}
