using AnimalFarm.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AnimalFarm.MvcWebApp.Controllers
{
    public class ProductCategoryController : AppControllerBase
    {
        private readonly IAnimalFarmService _service;
        public ProductCategoryController(IAnimalFarmService service)
        {
            _service = service;
        }

        [Route("~/api/productcategories/list")]
        public ActionResult ListCategory()
        {
            var values = _service.GetAllProductCategories();
            return JsonNet(values);
        }
    }
}