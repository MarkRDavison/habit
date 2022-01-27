using System.Collections.Generic;
using System.Threading.Tasks;
using zeno_habit_api_data.Models;
using zeno_habit_api_service.Services;
using zeno_habit_api_service.Services.Interfaces;

namespace zeno_habit_api_core.Validators
{
    public class HabitValidator : EntityValidator<Habit>
    {
        public HabitValidator(IEntityService<Habit> entityService) : base(entityService) { }

        public override async Task<IList<EntityValidation>> Validate(Habit entity)
        {
            var errors = new List<EntityValidation>();

            if (!IsNew(entity))
            {
                ValidateRequiredProperty(entity, _ => _.CreatedByUserId, errors);
                ValidateRequiredProperty(entity, _ => _.CreatedDate, errors);
            }

            if (ValidateRequiredProperty(entity, _ => _.Name, errors))
            {
                ValidateLength(entity, _ => _.Name, errors, 20, 4);
            }
            if (ValidateRequiredProperty(entity, _ => _.Question, errors))
            {
                ValidateLength(entity, _ => _.Question, errors, 40, 4);
            }

            await Task.CompletedTask;
            return errors;
        }
    }
}
