using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AnimalFarm.MvcWebApp.Controllers
{
    public class HomeController : AppControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}