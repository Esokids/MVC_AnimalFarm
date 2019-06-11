using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimalFarm.Shared.Data.EntityFramework
{
    /// <summary>
    /// 
    /// </summary>
    public interface IUnitOfWorkBase : IDisposable
    {
        DbContextTransaction CreateTransaction();
        int SaveChanges();
        void RejectChanges();
    }


    /// <summary>
    /// 
    /// </summary>
    /// <typeparam name="TContext"></typeparam>
    public abstract class UnitOfWorkBase<TContext> : IUnitOfWorkBase
        where TContext : DbContext
    {
        protected TContext Context { get; private set; }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        public UnitOfWorkBase(TContext context)
        {
            this.Context = context;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public DbContextTransaction CreateTransaction()
        {
            return this.Context.Database.BeginTransaction();
        }

        private bool disposed = false;
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposed && disposing)
            {
                if (Context != null) { Context.Dispose(); }
                disposed = true;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public int SaveChanges()
        {
            return Context.SaveChanges();
        }

        /// <summary>
        /// 
        /// </summary>
        public void RejectChanges()
        {
            foreach (var entry in this.Context.ChangeTracker.Entries())
            {
                switch (entry.State)
                {
                    case EntityState.Modified:
                        entry.State = EntityState.Unchanged;
                        break;
                    case EntityState.Added:
                        entry.State = EntityState.Detached;
                        break;
                    case EntityState.Deleted:
                        entry.Reload();
                        break;
                    default: break;
                }
            }
        }
    }

}
