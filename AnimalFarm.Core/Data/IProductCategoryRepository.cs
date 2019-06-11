using AnimalFarm.Core.Models;
using AnimalFarm.Shared.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimalFarm.Core.Data
{
    public interface IProductCategoryRepository : IRepository<ProductCategory, int>
    {

    }
}
