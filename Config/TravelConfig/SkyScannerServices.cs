using Configuration.Enums;
using Configuration.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Configuration.TravelConfig
{
    public class SkyScannerServices
    {
        public static Dictionary<TravelServiceEnum, string> Services { get; }
        static SkyScannerServices()
        {
            Services = new Dictionary<TravelServiceEnum, string> {
                { TravelServiceEnum.Currencies, TravelServiceEnum.Currencies.FromEnum(true) },
                { TravelServiceEnum.Locales, TravelServiceEnum.Locales.FromEnum(true) },
            };
        }

        public static string GetService(TravelServiceEnum key)
        {
            if (!Services.ContainsKey(key))
                throw new Exception(string.Format(Errors.AbsentServiceForKey, key.FromEnum()));
            return Services[key];
        }
    }
}
