using System;

namespace zeno_habit_api_data.Models
{
    public class Habit : IEntity
    {
        public Guid Id { get; set; }
        public string CreatedByUserId { get; set; }
        public string Name { get; set; }
        public string Question { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
