using System;

namespace zeno_habit_api_data.Models
{
    public class Occurence : IEntity
    {
        public Guid Id { get; set; }
        public Guid HabitId { get; set; }
        public string CreatedByUserId { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
