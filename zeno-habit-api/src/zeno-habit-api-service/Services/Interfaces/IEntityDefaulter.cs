using zeno_habit_api_data.Models;

namespace zeno_habit_api_service.Services.Interfaces
{
    public interface IEntityDefaulter<T> where T : class, IEntity
    {
        Task DefaultAsync(T entity, User user);

    }
}
