using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using zeno_habit_api_data.Models;
using zeno_habit_api_service.Services;
using zeno_habit_api_service.Services.Interfaces;

namespace zeno_habit_api_core.Validators
{
    public class OccurenceValidator : EntityValidator<Occurence>
    {
        public OccurenceValidator(IEntityService<Occurence> entityService) : base(entityService) { }

        public override async Task<IList<EntityValidation>> Validate(Occurence entity)
        {
            var errors = new List<EntityValidation>();

            if (!IsNew(entity))
            {
                ValidateRequiredProperty(entity, _ => _.CreatedByUserId, errors);
                ValidateRequiredProperty(entity, _ => _.CreatedDate, errors);
            }

            ValidateNonDefaultProperty(entity, _ => _.HabitId, errors);
            ValidateNonDefaultProperty(entity, _ => _.OccurenceDate, errors);

            if (!ValidateEntityDoesNotExist(DuplicateOccurenceDatePredicate(entity)))
            {
                errors.Add(new EntityValidation
                {
                    Message = $"{nameof(Occurence.OccurenceDate)} is duplicated",
                    Code = EntityValidations.Duplicated
                });
            }

            await Task.CompletedTask;

            return errors;
        }

        public static Func<Occurence, bool> DuplicateOccurenceDatePredicate(Occurence entity)
        {
            return _ => _.HabitId == entity.HabitId && _.OccurenceDate == entity.OccurenceDate;
        }
    }
}
