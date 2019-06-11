using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimalFarm.Shared.Models
{
    public class DataObjectResult : DataObjectResult<object>, IObjectResult
    {
        public DataObjectResult() { }
        public DataObjectResult(object data) : base(data)
        {

        }

        public DataObjectResult(Exception error) : base(null, error)
        {

        }

        public DataObjectResult(object data, Exception error) : base(data, error)
        {

        }

        public static DataObjectResult Succeed()
        {
            return new DataObjectResult(null);
        }

        public static DataObjectResult Succeed(object data)
        {
            return new DataObjectResult(data);
        }

        public static DataObjectResult Fail(Exception error)
        {
            return new DataObjectResult(null, error);
        }

        public static DataObjectResult Fail(string errorMessage)
        {
            return new DataObjectResult(null, new Exception(errorMessage));
        }

        public static DataObjectResult Fail(object data, Exception error)
        {
            return new DataObjectResult(data, error);
        }
    }

    public class DataObjectResult<T> where T : class
    {
        public DataObjectResult()
        {

        }

        public DataObjectResult(T data)
        {
            this.DataState = data;
        }

        public DataObjectResult(T data, Exception error)
        {
            this.DataState = data;
            this.Error = error;
        }

        public string Message { get; set; }
        public T DataState { get; private set; }
        public Exception Error { get; private set; }
        public bool IsSucceed { get { return this.Error == null; } }

        public static DataObjectResult<TData> Succeed<TData>(TData data)
            where TData : class
        {
            return new DataObjectResult<TData>(data);
        }

        public static DataObjectResult<TData> Fail<TData>(TData data, string errorMessage)
            where TData : class
        {
            return new DataObjectResult<TData>(data, new Exception(errorMessage));
        }

        public static DataObjectResult<TData> Fail<TData>(TData data, Exception error)
            where TData : class
        {
            return new DataObjectResult<TData>(data, error);
        }

        public string GetErrorMessage()
        {
            if (this.Error == null) return null;
            return ExceptionUtility.GetLastExceptionMessage(this.Error);
        }
    }

}
