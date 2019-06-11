using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimalFarm.Shared.Models
{
    public interface IObjectResult
    {
        Exception Error { get; }
    }
}
