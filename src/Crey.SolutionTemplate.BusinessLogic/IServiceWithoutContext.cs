namespace Crey.SolutionTemplate.BusinessLogic
{
    using System.Threading.Tasks;

    public interface IServiceWithoutContext<TEntity> : IService<TEntity>
        where TEntity : class
    {
        Task<TEntity> SaveAsync(TEntity entity);

        Task DeleteAsync(TEntity entity);
    }
}
