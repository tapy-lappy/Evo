using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;
using System.Collections;

namespace TravelOrganizer.Api.Dto
{
    //[JsonObject("Currencies")]
    //[JsonArray("Currencies")]
    public class CurrencyDto : BaseDto
    {
        public string Code { get; set; }
        public string Symbol { get; set; }
        public string ThousandsSeparator { get; set; }
        public string DecimalSeparator { get; set; }
        public string SymbolOnLeft { get; set; }
        public string SpaceBetweenAmountAndSymbol { get; set; }
        public string RoundingCoefficient { get; set; }
        public string DecimalDigits { get; set; }
    }

    //[JsonArray("Currencies")]
    //public class CurrenciesDto<T> : Collection<T> where T : CurrencyDto { }

    public class CurrenciesDto : BaseDto
    {
        [JsonProperty("Currencies")]
        public IEnumerable<CurrencyDto> Currencies { get; set; }
    }
}