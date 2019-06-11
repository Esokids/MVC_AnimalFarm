using AnimalFarm.Core.Models;
using AnimalFarm.Shared.Data.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimalFarm.Core.Data.EntityFramework
{
    public class UnitOfWork : UnitOfWorkBase<AnimalFarmDbContext>, IUnitOfWork
    {
        public UnitOfWork(AnimalFarmDbContext context) : base(context)
        {
            Products = new ProductRepository(context);
            ProductCategories = new ProductCategoryRepository(context);
        }

        public IProductRepository Products { get; set; }
        public IProductCategoryRepository ProductCategories { get; set; }
    }
}
