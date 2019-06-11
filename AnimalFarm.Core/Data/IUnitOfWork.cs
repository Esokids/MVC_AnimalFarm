using AnimalFarm.Shared.Data.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimalFarm.Core.Data
{
    public interface IUnitOfWork : IUnitOfWorkBase
    {
        IProductRepository Products { get; set; }
        IProductCategoryRepository ProductCategories { get; set; }
    }
}
