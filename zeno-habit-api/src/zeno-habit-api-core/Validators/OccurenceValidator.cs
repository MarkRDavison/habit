using System.Collections.Generic;
using System.Threading.Tasks;
using zeno_habit_api_data.Models;
using zeno_habit_api_service.Services.Interfaces;

namespace zeno_habit_api_core.Validators
{
    public class OccurenceValidator : IEntityValidator<Occurence>
    {
        public Task<IEnumerable<string>> Validate(Occurence entity)
        {
            List<string> errors = new List<string>();

            return Task.FromResult<IEnumerable<string>>(errors);
        }
    }
}
