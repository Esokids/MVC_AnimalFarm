using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimalFarm.Shared.Models
{
    public static class DataObjectResultsExtensions
    {
        /// <summary>
        /// Convert ObjectResults to Result with property IsSucceed and Results as List of Result
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="results"></param>
        /// <returns></returns>
        public static object ToResult<T>(this DataObjectResults<T> results)
        {
            return new
            {
                IsSucceed = results.IsSucceed,
                Results = results.Results.Select(t => new { Data = t.Data, Error = t.Error == null ? null : ExceptionUtility.GetLastExceptionMessage(t.Error) }).ToArray()
            };
        }

        /// <summary>
        /// Return list of results
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="results"></param>
        /// <returns></returns>
        public static object ToListResult<T>(this DataObjectResults<T> results)
        {
            return results.Results.Select(t => new { Data = t.Data, Error = t.Error == null ? null : ExceptionUtility.GetLastExceptionMessage(t.Error) }).ToArray();
        }

        /// <summary>
        /// Convert ObjectResults to View Result with property IsSucceed ,Data and Errors
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="results"></param>
        /// <returns></returns>
        public static object ToViewResult<T>(this DataObjectResults<T> results)
        {
            /*
             * { 
             *  IsSucceed: true/false, 
             *  Data: [
             *      { 
             *          Property1: Value1,
             *          Property2: Value2,
             *      }
             *  ], 
             *  Errors: [
             *  { 
             *      Data: {
             *          Property1: Value1 
             *          Property2: Value2
             *      }, 
             *      Error: {error-message} 
             *  }] 
             * }
             */
            return new
            {
                IsSucceed = results.IsSucceed,
                Errors = results.Results.Where(t => t.Error != null).Select(t => new { Data = t.Data, Error = t.Error == null ? null : ExceptionUtility.GetLastExceptionMessage(t.Error) }).ToArray(),
                Data = results.Results.Where(t => t.Error == null).Select(t => t.Data).ToArray()
            };
        }
    }
}
