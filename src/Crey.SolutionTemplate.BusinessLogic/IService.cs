namespace Crey.SolutionTemplate.BusinessLogic
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IService<TEntity>
        where TEntity : class
    {
        Task<IEnumerable<TEntity>> QueryAsync(Func<IQueryable<TEntity>, IQueryable<TEntity>> query);
    }
}
