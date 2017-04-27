using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Configuration.TravelConfig
{
    public class Errors
    {
        public const string ImpossibleToConvertStringToEnum = "Impossible to convert string {0} to enum {1}";
        public const string HttpRequestFailed = "HTTP Request: {0} failed with code: {1}. Error message: {2}";
        public const string AbsentServiceForKey = "Any service doesn't registered for key: {0}";
    }
}
