namespace Crey.SolutionTemplate.DataAccess.Repositories
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using System;
    using Crey.SolutionTemplate.Model;

    public interface IRepository<T> : IDisposable
        where T : class, IEntityWithId
    {
        Task<T> InsertAsync(T entity);

        Task<IEnumerable<T>> InsertAllAsync(IEnumerable<T> entities);

        Task<T> UpdateAsync(T entity);

        Task<IEnumerable<T>> UpdateAllAsync(IEnumerable<T> entities);

        Task DeleteAsync(T entity);

        Task DeleteAllAsync(IEnumerable<T> entities);

        Task<T> FindAsync(T entity);

        Task<IEnumerable<T>> QueryAsync(Func<IQueryable<T>, IQueryable<T>> query);
    }
}
