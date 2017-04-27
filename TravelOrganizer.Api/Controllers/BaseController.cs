using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TravelOrganizer.Api.Config;

namespace TravelOrganizer.Api.Controllers
{
    public class BaseController : Controller
    {
        protected AppSettings AppSettings { get; private set; }

        public BaseController(AppSettings appSettings)
        {
            AppSettings = appSettings;
        }
    }
}
