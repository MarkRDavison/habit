using zeno_habit_api_data.Models;

namespace zeno_habit_api_service.Services.Interfaces
{
    public static class EntityValidations
    {
        public const string MissingRequired = "MISSING_REQ";
        public const string InvalidLength = "INVALID_LENGTH";
    }
    public struct EntityValidation
    {
        public string Message { get; set; }
        public string Code { get; set; }
    }

    public interface IEntityValidator<T> where T : class, IEntity
    {
        Task<IList<EntityValidation>> Validate(T entity);
    }
}
