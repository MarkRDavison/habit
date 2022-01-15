using System;

namespace zeno_habit_api_data.Models
{
    public class Habit : IEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
