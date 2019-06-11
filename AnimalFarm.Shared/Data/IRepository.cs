using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace AnimalFarm.Shared.Data
{
    public interface IRepository<TEntity>
        where TEntity : class
    {
        IList<TEntity> GetAll();
        IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate);
        TEntity SingleOrDefault(Expression<Func<TEntity, bool>> predicate);

        void Add(TEntity entity);
        void Remove(TEntity entity);
        void Edit(TEntity entity);
    }

    public interface IRepository<TEntity, TKey> : IRepository<TEntity>
        where TEntity : class
    {
        TEntity Get(TKey key);
    }

    public interface IRepository<TEntity, TKey, TSearchCriteria> : IRepository<TEntity, TKey>
        where TEntity : class
    {
        IList<TEntity> GetBySearchCriteria(TSearchCriteria criteria);
    }
}
