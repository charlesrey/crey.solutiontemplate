namespace Crey.SolutionTemplate.BusinessLogic
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Crey.SolutionTemplate.DataAccess.Repositories;
    using Crey.SolutionTemplate.Model;

    public class Service<TEntity> : IService<TEntity>
        where TEntity : class, IEntityWithId
    {
        protected readonly IRepository<TEntity> MainRepository;

        public Service(IRepository<TEntity> mainRepository)
        {
            if (mainRepository == null)
            {
                throw new ArgumentNullException(nameof(mainRepository));
            }
            else
            {
                this.MainRepository = mainRepository;
            }
        }

        public virtual async Task<IEnumerable<TEntity>> QueryAsync(Func<IQueryable<TEntity>, IQueryable<TEntity>> query)
        {
            return await this.MainRepository.QueryAsync(query);
        }

        protected virtual async Task<TEntity> SaveAsync(TEntity entity)
        {
            if (entity.Id == null)
            {
                return await this.MainRepository.InsertAsync(entity);
            }
            else
            {
                return await this.MainRepository.UpdateAsync(entity);
            }
        }

        protected virtual async Task DeleteAsync(TEntity entity)
        {
            await this.MainRepository.DeleteAsync(entity);
        }
    }
}
