namespace Crey.SolutionTemplate.DataAccess.RavenDb.Repositories
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using System;
    using Crey.SolutionTemplate.DataAccess.Repositories;
    using Crey.SolutionTemplate.Model;
    using Raven.Client.Documents.Session;
    using Raven.Client.Documents;

    /// <summary>
    /// Repository for RavenDb.
    /// </summary>
    /// <typeparam name="T">Domain model type.</typeparam>
    public class Repository<T> : IRepository<T>
        where T : class, IEntityWithId
    {
        /// <summary>
        /// Docmument store (Injected).
        /// </summary>
        protected readonly IAsyncDocumentSession Session;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="session">Db access (Injected).</param>
        public Repository(IDocumentStore store)
        {
            this.Session = store.OpenAsyncSession();
        }

        /// <summary>
        /// <see cref="IRepository{T}.DeleteAllAsync(IEnumerable{T})"/>.
        /// </summary>
        public async Task DeleteAllAsync(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                this.Session.Delete(entity);
            }
            await this.Session.SaveChangesAsync();
        }

        /// <summary>
        /// <see cref="IRepository{T}.DeleteAsync(T)"/>.
        /// </summary>
        public async Task DeleteAsync(T entity)
        {
            this.Session.Delete(entity);
            await this.Session.SaveChangesAsync();
        }

        /// <summary>
        /// <see cref="IRepository{T}.FindAsync(T)"/>.
        /// </summary>
        public async Task<T> FindAsync(T entity)
        {
            return await this.Session.LoadAsync<T>(entity.Id);
        }

        /// <summary>
        /// <see cref="IRepository{T}.InsertAllAsync(IEnumerable{T})"/>.
        /// </summary>
        public async Task<IEnumerable<T>> InsertAllAsync(IEnumerable<T> entities)
        {

            foreach (var entity in entities)
            {
                await this.Session.StoreAsync(entity);
            }
            await this.Session.SaveChangesAsync();
            return entities;
        }

        /// <summary>
        /// <see cref="IRepository{T}.InsertAsync(T)"/>.
        /// </summary>
        public async Task<T> InsertAsync(T entity)
        {
            await this.Session.StoreAsync(entity);
            await this.Session.SaveChangesAsync();
            return entity;
        }

        /// <summary>
        /// <see cref="IRepository{T}.Query"/>.
        /// </summary>
        public async Task<IEnumerable<T>> QueryAsync(Func<IQueryable<T>, IQueryable<T>> query)
        {
            return await query(this.Session.Query<T>()).ToListAsync();
        }

        /// <summary>
        /// <see cref="IRepository{T}.UpdateAllAsync(IEnumerable{T})"/>.
        /// </summary>
        public async Task<IEnumerable<T>> UpdateAllAsync(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                await this.Session.StoreAsync(entity);
            }
            await this.Session.SaveChangesAsync();
            return entities;
        }

        /// <summary>
        /// <see cref="IRepository{T}.UpdateAsync(T)"/>.
        /// </summary>
        public async Task<T> UpdateAsync(T entity)
        {
            await this.Session.StoreAsync(entity);
            await this.Session.SaveChangesAsync();
            return entity;
        }

        #region IDisposable Support
        private bool disposedValue = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposedValue)
            {
                if (disposing)
                {
                    // Dispose managed state (managed objects).
                    this.Session.Dispose();
                }


                this.disposedValue = true;
            }
        }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            this.Dispose(true);
        }
        #endregion
    }
}
