using System.Linq.Expressions;
using zeno_habit_api_data.Models;
using zeno_habit_api_service.Services.Interfaces;

namespace zeno_habit_api_service.Services
{
    public abstract class EntityValidator<T> : IEntityValidator<T> where T : class, IEntity
    {

        public abstract Task<IList<EntityValidation>> Validate(T entity);
        private static string GetMemberName(Expression expression)
        {
            switch (expression.NodeType)
            {
                case ExpressionType.MemberAccess:
                    return ((MemberExpression)expression).Member.Name;
                case ExpressionType.Convert:
                    return GetMemberName(((UnaryExpression)expression).Operand);
                default:
                    throw new NotSupportedException(expression.NodeType.ToString());
            }
        }

        protected bool ValidateRequiredProperty<TProp>(T entity, Expression<Func<T, TProp>> accessor, List<EntityValidation> errors)
        {
            var func = accessor.Compile();
            var property = func(entity);
            if (property != null)
            {
                return true;
            }

            var propertyName = GetMemberName(accessor.Body);

            errors.Add(new EntityValidation
            {
                Message = $"{propertyName} is required on {typeof(T).Name}",
                Code = EntityValidations.MissingRequired
            });
            return false;
        }

        protected bool ValidateNonDefaultProperty(T entity, Expression<Func<T, Guid>> accessor, List<EntityValidation> errors)
        {
            var func = accessor.Compile();
            var propertyName = GetMemberName(accessor.Body);
            var property = func(entity);
            if (property == default(Guid))
            {
                errors.Add(new EntityValidation
                {
                    Message = $"{propertyName} on {typeof(T).Name} is a default {nameof(Guid)}",
                    Code = EntityValidations.MissingRequired
                });
                return false;
            }

            return true;
        }

        protected bool ValidateNonDefaultProperty(T entity, Expression<Func<T, DateTime>> accessor, List<EntityValidation> errors)
        {
            var func = accessor.Compile();
            var propertyName = GetMemberName(accessor.Body);
            var property = func(entity);
            if (property == default(DateTime))
            {
                errors.Add(new EntityValidation
                {
                    Message = $"{propertyName} on {typeof(T).Name} is a default {nameof(DateTime)}",
                    Code = EntityValidations.MissingRequired
                });
                return false;
            }

            return true;
        }

        protected bool ValidateNonDefaultProperty<TProp>(T entity, Expression<Func<T, TProp>> accessor, List<EntityValidation> errors)
        {
            throw new NotImplementedException();
        }

        protected bool ValidateLength(T entity, Expression<Func<T, string>> accessor, List<EntityValidation> errors, int max, int min = 0)
        {
            var func = accessor.Compile();
            var propertyName = GetMemberName(accessor.Body);
            var property = func(entity) ?? throw new InvalidOperationException($"{propertyName} on {typeof(T).Name} is null while attempting to validate length");

            var length = property.Length;

            if (length < min)
            {
                errors.Add(new EntityValidation
                {
                    Message = $"{propertyName} on {typeof(T).Name} is too short. Is {length}, minimum is {min}",
                    Code = EntityValidations.InvalidLength
                });
                return false;
            }
            else if (length > max)
            {
                errors.Add(new EntityValidation
                {
                    Message = $"{propertyName} on {typeof(T).Name} is too long. Is {length}, maximum is {max}",
                    Code = EntityValidations.InvalidLength
                });
                return false;
            }

            return true;
        }

        protected bool IsNew(T entity)
        {
            return entity.Id == Guid.Empty;
        }
    }
}
