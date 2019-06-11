using AnimalFarm.Core.Models;
using AnimalFarm.Shared.Data.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimalFarm.Core.Data.EntityFramework
{
    public class ProductRepository : EntityRepository<AnimalFarmDbContext, Product, string>, IProductRepository
    {
        public ProductRepository(AnimalFarmDbContext context) : base(context)
        {

        }

        public IList<ProductView> GetBySearchCriteria(ProductSearchCriteria criteria)
        {
            return Context.GetProductViewsBySearchCriteria(criteria.ProductCode, criteria.ProductName, criteria.CategoryID).ToList();
        }
    }
}
