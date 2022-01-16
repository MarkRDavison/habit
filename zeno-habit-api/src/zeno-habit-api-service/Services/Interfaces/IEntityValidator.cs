using zeno_habit_api_data.Models;

namespace zeno_habit_api_service.Services.Interfaces
{
    public interface IEntityValidator<T> where T : class, IEntity
    {
        Task<IEnumerable<string>> Validate(T entity);
    }
}
