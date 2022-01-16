using System;
using System.Threading.Tasks;
using zeno_habit_api_data.Models;
using zeno_habit_api_service.Services.Interfaces;

namespace zeno_habit_api_core.Defaulters
{
    public class OccurenceDefaulter : IEntityDefaulter<Occurence>
    {
        public async Task DefaultAsync(Occurence entity, User user)
        {
            await Task.CompletedTask;

            if (string.IsNullOrEmpty(entity.CreatedByUserId) || entity.CreatedByUserId == Guid.Empty.ToString())
            {
                entity.CreatedByUserId = user.Sub;
            }

            if (entity.CreatedDate == DateTime.MinValue)
            {
                entity.CreatedDate = DateTime.UtcNow.Date;
            }
        }
    }
}
