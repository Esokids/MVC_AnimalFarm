using AnimalFarm.Core.Models;
using AnimalFarm.Shared.Data.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimalFarm.Core.Data.EntityFramework
{
    public class ProductCategoryRepository : EntityRepository<AnimalFarmDbContext, ProductCategory, int>, IProductCategoryRepository
    {
        public ProductCategoryRepository(AnimalFarmDbContext context) : base(context)
        {

        }

    }
}
