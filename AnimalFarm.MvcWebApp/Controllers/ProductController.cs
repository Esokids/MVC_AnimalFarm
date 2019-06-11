using AnimalFarm.Core.Models;
using AnimalFarm.MvcWebApp.Models;
using AnimalFarm.Services;
using Kendo.Mvc.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Vereyon.Web;
using Kendo.Mvc.Extensions;

namespace AnimalFarm.MvcWebApp.Controllers
{
    public class ProductController : AppControllerBase
    {
        private readonly IAnimalFarmService _service;
        public ProductController(IAnimalFarmService service)
        {
            _service = service;
        }

        // GET: Product
        public ActionResult Inquiry()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ReadProduct([DataSourceRequest]DataSourceRequest request,ProductSearchCriteria criteria)
        {
            try
            {
                var values = _service.GetProductsBySearchCriteria(criteria);
                var models = values.Select(t => t.ToViewModel());
                return JsonNet(models.ToDataSourceResult(request));
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }         
        }

        public ActionResult Register()
        {
            return View(new ProductViewModel());
        }

        [HttpPost]
        public ActionResult Register(ProductViewModel model)
        {
            throw new NotImplementedException();
        }

        public ActionResult Edit(string id)
        {
            return View();
        }

        [HttpPost]
        public ActionResult Edit(ProductViewModel model)
        {
            return View();
        }
    }
}