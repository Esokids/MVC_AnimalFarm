using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimalFarm.Shared.Models
{
    /// <summary>
    /// 
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class DataObjectResults<T>
    {
        public bool IsSucceed
        {
            get
            {
                return this.Results.Where(t => t.Error != null).ToList().Count == 0;
            }
        }

        public IList<DataObjectResultData<T>> Results { get; private set; } = new List<DataObjectResultData<T>>();

        public void AddResult(T data)
        {
            this.Results.Add(new DataObjectResultData<T>(data));
        }

        public void AddResult(T data, Exception error)
        {
            this.Results.Add(new DataObjectResultData<T>(data, error));
        }

        public Exception GetFirstError()
        {
            return this.Results.Where(t => t.Error != null).Select(t => t.Error).FirstOrDefault();
        }

        public Exception[] GetErrors()
        {
            return this.Results.Where(t => t.Error != null).Select(t => t.Error).ToArray();
        }

        public IList<T> GetErrorDataList()
        {
            return this.Results.Where(t => t.Error != null).Select(t => t.Data).ToList();
        }

        public IList<T> GetSuccessDataList()
        {
            return this.Results.Where(t => t.Error == null).Select(t => t.Data).ToList();
        }
    }

    public class DataObjectResultData<T> : DataObjectResultData
    {
        public DataObjectResultData(T data)
        {
            this.Data = data;
        }

        public DataObjectResultData(T data, Exception ex) : base(ex)
        {
            this.Data = data;
        }

        public T Data { get; set; }
    }

    /// <summary>
    /// 
    /// </summary>
    public class DataObjectResultData
    {
        public DataObjectResultData()
        {

        }

        public DataObjectResultData(Exception ex)
        {
            this.Error = ex;
        }

        public Exception Error { get; set; }
    }

    

}
