using AnimalFarm.Core.Models;
using AnimalFarm.MvcWebApp.Models;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AnimalFarm.MvcWebApp
{
    public class AutoMapperConfig
    {
        public static void Register()
        {
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<ProductView, ProductViewModel>();
                cfg.CreateMap<Product, ProductViewModel>()
                    .ForMember(t => t.CategoryName, 
                    s => s.MapFrom(t => t.ProductCategory.CategoryName));
                
                cfg.CreateMap<ProductViewModel, Product>();
            });
        }
    }

}