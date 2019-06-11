using AnimalFarm.Core.Data;
using AnimalFarm.Core.Data.EntityFramework;
using AnimalFarm.Core.Models;
using AnimalFarm.Shared.Models;
using System;
using System.Collections.Generic;

namespace AnimalFarm.Services
{
    public class AnimalFarmService : IAnimalFarmService
    {
        private IUnitOfWork CreateUnitOfWork()
        {
            var context = new AnimalFarmDbContext();
            context.Configuration.ProxyCreationEnabled = false;
            context.Database.CommandTimeout = 30;
            return new UnitOfWork(context);
        }

        public DataObjectResult CreateProduct(Product product)
        {
            try
            {
                using (var u = CreateUnitOfWork())
                {
                    if (ValidateData(product))
                    {
                        u.Products.Add(product);
                        u.SaveChanges();
                        return DataObjectResult.Succeed();
                    }
                    return DataObjectResult.Fail(new Exception("Invalid data from business logic."));

                }
            }
            catch (Exception ex)
            {
                return DataObjectResult.Fail(ex);
            }

        }

        private bool ValidateData(Product entity)
        {
            return true;
        }

        public DataObjectResult EditProduct(Product product)
        {
            throw new NotImplementedException();
        }

        public IList<ProductCategory> GetAllProductCategories()
        {
            using (var u = CreateUnitOfWork())
            {
                return u.ProductCategories.GetAll();
            }
        }

        public Product GetProduct(string productCode)
        {
            throw new NotImplementedException();
        }

        public IList<ProductView> GetProductsBySearchCriteria(ProductSearchCriteria criteria)
        {
            throw new NotImplementedException();
        }

        public DataObjectResult RemoveProduct(Product product)
        {
            throw new NotImplementedException();
        }




    }
}
