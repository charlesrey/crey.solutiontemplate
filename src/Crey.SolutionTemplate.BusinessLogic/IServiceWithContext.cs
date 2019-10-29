namespace Crey.SolutionTemplate.BusinessLogic
{
    using System.Threading.Tasks;

    public interface IServiceWithContext<TEntity, TContext> : IService<TEntity>
        where TEntity : class
    {
        Task<TEntity> SaveAsync(TEntity entity, TContext context);

        Task DeleteAsync(TEntity entity, TContext context);
    }
}
