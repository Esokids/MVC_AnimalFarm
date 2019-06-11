using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AnimalFarm.Core.Data;
using AnimalFarm.Core.Data.EntityFramework;
using AnimalFarm.Core.Models;
using AnimalFarm.Shared.Models;

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
            throw new NotImplementedException();
        }

        public DataObjectResult EditProduct(Product product)
        {
            throw new NotImplementedException();
        }

        public IList<ProductCategory> GetAllProductCategories()
        {
            throw new NotImplementedException();
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
