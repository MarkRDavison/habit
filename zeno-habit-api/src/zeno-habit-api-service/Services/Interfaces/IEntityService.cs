using zeno_habit_api_data.Models;

namespace zeno_habit_api_service.Services.Interfaces
{
    public interface IEntityService<T> where T : class, IEntity
    {

        Task<IEnumerable<T>> GetEntitiesAsync(CancellationToken cancellationToken);
        Task<T> GetEntityAsync(string id, CancellationToken cancellationToken);
        Task<T> GetEntityAsync(Guid id, CancellationToken cancellationToken);
        Task<T> SaveEntityAsync(T entity, CancellationToken cancellationToken);
        Task<bool> DeleteEntityAsync(T entity, CancellationToken cancellationToken);
        Task DeleteAllEntitiesAsync(CancellationToken cancellationToken);
        IQueryable<T> Entities { get; }

    }
}
