namespace Crey.SolutionTemplate.BusinessLogic
{
    using System.Threading.Tasks;
    using Crey.SolutionTemplate.DataAccess.Repositories;
    using Crey.SolutionTemplate.Model;

    public class ServiceWithContext<TEntity, TContext>
        : Service<TEntity>, IServiceWithContext<TEntity, TContext>
        where TEntity : class, IEntityWithId
    {

        public ServiceWithContext(IRepository<TEntity> mainRepository)
            : base(mainRepository)
        {
        }

        public virtual async Task<TEntity> SaveAsync(TEntity entity, TContext context)
        {
            return await base.SaveAsync(entity);
        }

        public virtual async Task DeleteAsync(TEntity entity, TContext context)
        {
            await base.DeleteAsync(entity);
        }
    }
}
