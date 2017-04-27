using Configuration.TravelConfig;
using System;

namespace Configuration.Helpers
{
    public static class EnumParseHelper
    {
        public static TEnum ToEnum<TEnum>(this string value) where TEnum : struct
        {
            TEnum result;
            if (Enum.TryParse(value, true, out result)) return result;
            throw new Exception(string.Format(Errors.ImpossibleToConvertStringToEnum, value, typeof(TEnum)));
        }

        public static string FromEnum<TEnum>(this TEnum value, bool ignoreUpperCase = false) where TEnum : struct
        {
            string result = Enum.GetName(typeof(TEnum), value);
            return ignoreUpperCase ? result.ToLower() : result;
        }
    }
}
