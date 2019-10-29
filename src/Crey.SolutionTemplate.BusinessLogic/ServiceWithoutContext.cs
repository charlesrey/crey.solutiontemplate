namespace Crey.SolutionTemplate.BusinessLogic
{
    using System.Threading.Tasks;
    using Crey.SolutionTemplate.DataAccess.Repositories;
    using Crey.SolutionTemplate.Model;

    public class ServiceWithoutContext<TEntity> : Service<TEntity>, IServiceWithoutContext<TEntity>
        where TEntity : class, IEntityWithId
    {
        public ServiceWithoutContext(IRepository<TEntity> mainRepository)
            : base(mainRepository)
        {
        }

        public virtual new async Task<TEntity> SaveAsync(TEntity entity)
        {
            return await base.SaveAsync(entity);
        }

        public virtual new async Task DeleteAsync(TEntity entity)
        {
            await base.DeleteAsync(entity);
        }
    }
}
