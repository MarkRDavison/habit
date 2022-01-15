using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using zeno_habit_api_data.Core;
using zeno_habit_api_data.Models;

namespace zeno_habit_api_data.Services.Interfaces
{

    public interface IRepository
    {

        Task<bool> SaveAsync<T>(T entity, CancellationToken cancellationToken) where T : class, IEntity;
        Task<bool> DeleteAsync<T>(T entity, CancellationToken cancellationToken) where T : class, IEntity;
        Task<T> GetAsync<T>(Guid id, CancellationToken cancellationToken) where T : class, IEntity;
        Task<T> GetAsync<T>(string id, CancellationToken cancellationToken) where T : class, IEntity;
        Task SaveChangesAsync(CancellationToken cancellationToken);
        ITransaction BeginTransaction();

        IQueryable<T> Set<T>() where T : class, IEntity;
    }
}
