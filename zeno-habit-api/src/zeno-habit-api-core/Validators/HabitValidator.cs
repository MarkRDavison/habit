using System.Collections.Generic;
using System.Threading.Tasks;
using zeno_habit_api_data.Models;
using zeno_habit_api_service.Services.Interfaces;

namespace zeno_habit_api_core.Validators
{
    public class HabitValidator : IEntityValidator<Habit>
    {
        public Task<IEnumerable<string>> Validate(Habit entity)
        {
            List<string> errors = new List<string>();

            if (string.IsNullOrEmpty(entity.Name))
            {
                errors.Add("Habit.Name is a required field");
            }
            else if (entity.Name.Length > 20)
            {
                errors.Add("Habit.Name must be less than 20 characters");
            }

            return Task.FromResult<IEnumerable<string>>(errors);
        }
    }
}
