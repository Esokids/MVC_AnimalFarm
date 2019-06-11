using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace AnimalFarm.Shared.Data.EntityFramework
{
    /// <summary>
    /// 
    /// </summary>
    /// <typeparam name="TContext"></typeparam>
    /// <typeparam name="TEntity"></typeparam>
    public abstract class EntityRepository<TContext, TEntity> : IRepository<TEntity>
        where TContext : DbContext
        where TEntity : class
    {
        protected readonly TContext Context;

        public EntityRepository(TContext context)
        {
            this.Context = context;
        }

        public EntityRepository(DbContext context)
        {

        }     

        public virtual IList<TEntity> GetAll()
        {
            return Context.Set<TEntity>().ToList();
        }

        public virtual IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate)
        {
            return Context.Set<TEntity>().Where(predicate);
        }

        public virtual TEntity SingleOrDefault(Expression<Func<TEntity, bool>> predicate)
        {
            return Context.Set<TEntity>().SingleOrDefault(predicate);
        }

        public virtual void Add(TEntity entity)
        {
            Context.Set<TEntity>().Add(entity);
        }

        public virtual void AddRange(IEnumerable<TEntity> entities)
        {
            Context.Set<TEntity>().AddRange(entities);
        }

        public virtual void Remove(TEntity entity)
        {
            if (Context.Entry<TEntity>(entity).State == EntityState.Detached)
            {
                Context.Set<TEntity>().Attach(entity);
            }
            Context.Entry<TEntity>(entity).State = EntityState.Deleted;
        }

        public virtual void Edit(TEntity entity)
        {
            Context.Set<TEntity>().AddOrUpdate(entity);
        }
    }

    public abstract class EntityRepository<TContext, TEntity, TKey> : EntityRepository<TContext, TEntity>
        where TContext : DbContext
        where TEntity : class
    {
        public EntityRepository(TContext context) : base(context)
        {

        }

        public virtual TEntity Get(TKey id)
        {
            return Context.Set<TEntity>().Find(id);
        }
    }


}
