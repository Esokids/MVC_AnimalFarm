using AnimalFarm.Core.Models;
using AnimalFarm.Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimalFarm.Services
{
    public interface IAnimalFarmService
    {
        IList<ProductCategory> GetAllProductCategories();

        Product GetProduct(string productCode);
        IList<ProductView> GetProductsBySearchCriteria(ProductSearchCriteria criteria);
        DataObjectResult CreateProduct(Product product);
        DataObjectResult EditProduct(Product product);
        DataObjectResult RemoveProduct(Product product);
    }
}
