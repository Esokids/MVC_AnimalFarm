using AnimalFarm.Core.Models;
using AnimalFarm.MvcWebApp.Models;
using AnimalFarm.Services;
using AnimalFarm.Shared;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using System;
using System.Linq;
using System.Web.Mvc;
using Vereyon.Web;

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
        public ActionResult ReadProduct([DataSourceRequest]DataSourceRequest request, ProductSearchCriteria criteria)
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
            if (!ModelState.IsValid)
            {
                FlashMessage.Danger("Invalid product data.");
                return View(model);
            }
            try
            {
                //ProductViewModel => Product
                //var entity = new Product()
                //{
                //    ProductCode = model.ProductCode,
                //    ProductName = model.ProductName,
                //    CategoryID = model.CategoryID,
                //    CreateDateTime = DateTime.Now,
                //    UpdateDateTime = DateTime.Now
                //};
                var entity = AutoMapper.Mapper.Map<Product>(model);
                entity.CreateDateTime = DateTime.Now;
                entity.UpdateDateTime = DateTime.Now;
                var result = _service.CreateProduct(entity);
                if (result.IsSucceed)
                {
                    FlashMessage.Confirmation("Create product successfully.");
                    return RedirectToAction("Register");
                    //return View(new ProductViewModel());
                }
                FlashMessage.Danger("Create product error. Error:" + result.GetErrorMessage());
                return View(model);
            }
            catch (Exception ex)
            {
                FlashMessage.Danger("Create product error" + ex);
                return View(model);
            }
        }

        public ActionResult Detail(string id)
        {
            try
            {
                var entity = _service.GetProduct(id);
                if (entity == null)
                {
                    FlashMessage.Warning($"Product Code {id} data not found.");
                    return View(new ProductViewModel());
                }

                // Found product from data storage
                // Product ==> ProductViewModel
                // ProduuctViewModel.CategoryNamee <====> Product.ProductCategory.CategoryName
                var model = AutoMapper.Mapper.Map<ProductViewModel>(entity);
                return View(model);
            }
            catch (Exception ex)
            {
                FlashMessage.Danger(ExceptionUtility.GetLastExceptionMessage(ex));
                return View(new ProductViewModel());
            }

        }

        public ActionResult Edit(string id)
        {
            var entity = _service.GetProduct(id);
            if (entity == null)
            {
                FlashMessage.Warning($"Product Code {id} data not found.");
                return View(new ProductViewModel());
            }

            // Found product from data storage
            // Product ==> ProductViewModel
            // ProduuctViewModel.CategoryNamee <====> Product.ProductCategory.CategoryName
            var model = AutoMapper.Mapper.Map<ProductViewModel>(entity);
            return View(model);
        }

        [HttpPost]
        public ActionResult Edit(ProductViewModel model)
        {
            if (!ModelState.IsValid)
            {
                FlashMessage.Danger("Invalid product data.");
                return View(model);
            }

            var entiry = AutoMapper.Mapper.Map<Product>(model);
            entiry.UpdateDateTime = DateTime.Now;
            var result = _service.EditProduct(entiry);
            if (result.IsSucceed)
            {
                FlashMessage.Confirmation("Edit prroduct is successfully.");
                return RedirectToAction("Detail", new { id = model.ProductCode });
            }
            FlashMessage.Danger("Edit product fail Error: " + result.GetErrorMessage());
            return View(model);
        }
    }
}