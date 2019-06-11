using AnimalFarm.Core.Models;
using AnimalFarm.MvcWebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AnimalFarm.MvcWebApp
{
    public static class ModelExtensions
    {
        public static ProductViewModel ToViewModel(this ProductView entity)
        {
            return AutoMapper.Mapper.Map<ProductViewModel>(entity);
        }

        public static ProductViewModel ToViewModel(this Product entity)
        {
            return AutoMapper.Mapper.Map<ProductViewModel>(entity);
        }

        public static Product ToEntity(this ProductViewModel model)
        {
            return AutoMapper.Mapper.Map<Product>(model);
        }
    }
}