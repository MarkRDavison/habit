using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;
using System.Threading.Tasks;
using zeno_habit_api_data.Models;
using zeno_habit_api_test.Framework;

namespace zeno_habit_api_test
{
    [TestClass]
    public class SanityTests : IntegrationTestBase
    {
        private static Random random = new Random();

        internal Habit GenerateValidHabit()
        {
            return new Habit
            {
                Name = RandomString(10),
                Question = $"{RandomString(15)}?"
            };
        }
        internal Occurence GenerateValidOccurence(Habit habit, DateTime date)
        {
            return new Occurence
            {
                HabitId = habit.Id,
                OccurenceDate = date
            };
        }

        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        [TestMethod]
        public async Task StartupHealthCheckIsReadyImmediately()
        {
            var response = await Client
                .GetAsync("/health/startup");
            response
                .EnsureSuccessStatusCode();
        }

        [TestMethod]
        public async Task ReadinessHealthCheckWorks()
        {
            var response = await Client
                .GetAsync("/health/readiness");
            response
                .EnsureSuccessStatusCode();
        }

        [TestMethod]
        public async Task LivenessHealthCheckWorks()
        {
            var response = await Client
                .GetAsync("/health/liveness");
            response
                .EnsureSuccessStatusCode();
        }

        [TestMethod]
        public async Task CreateHabitWorks()
        {
            var habit = await PostAsAsyncWithSuccessfulResponse("/api/habit", GenerateValidHabit());

            Assert.AreNotEqual(Guid.Empty, habit.Id);
            Assert.AreEqual(Sub.ToString(), habit.CreatedByUserId);
            Assert.AreEqual(DateTime.UtcNow.Date, habit.CreatedDate);
        }

        [TestMethod]
        public async Task GetHabitWorks()
        {
            var habit = await PostAsAsyncWithSuccessfulResponse("/api/habit", GenerateValidHabit());
            var habitFetched = await GetAsync<Habit>($"/api/habit/{habit.Id}");

            Assert.IsNotNull(habitFetched);
        }

        [TestMethod]
        public async Task GetHabitsWorks()
        {
            await PostAsAsyncWithSuccessfulResponse("/api/habit", GenerateValidHabit());
            await PostAsAsyncWithSuccessfulResponse("/api/habit", GenerateValidHabit());
            await PostAsAsyncWithSuccessfulResponse("/api/habit", GenerateValidHabit());
            await PostAsAsyncWithSuccessfulResponse("/api/habit", GenerateValidHabit());

            var habits = await GetMultipleAsync<Habit>("/api/habit");

            Assert.AreEqual(4, habits.Count());
        }

        [TestMethod]
        public async Task CreateOccurenceWorks()
        {
            var habit = await PostAsAsyncWithSuccessfulResponse("/api/habit", GenerateValidHabit());
            var occurence = await PostAsAsyncWithSuccessfulResponse("/api/occurence", GenerateValidOccurence(habit, DateTime.Today));

            Assert.AreNotEqual(Guid.Empty, occurence.Id);
            Assert.AreEqual(Sub.ToString(), occurence.CreatedByUserId);
            Assert.AreEqual(DateTime.UtcNow.Date, occurence.CreatedDate);
        }

        [TestMethod]
        public async Task CreateDuplicateOccurenceWorks()
        {
            var habit = await PostAsAsyncWithSuccessfulResponse("/api/habit", GenerateValidHabit());
            await PostAsAsyncWithSuccessfulResponse("/api/occurence", GenerateValidOccurence(habit, DateTime.Today));
            var response = await PostAsync("/api/occurence", GenerateValidOccurence(habit, DateTime.Today));

            Assert.IsFalse(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public async Task GetOccurenceWorks()
        {
            var habit = await PostAsAsyncWithSuccessfulResponse("/api/habit", GenerateValidHabit());
            var occurence = await PostAsAsyncWithSuccessfulResponse("/api/occurence", GenerateValidOccurence(habit, DateTime.Today));

            var occurenceFetched = await GetAsync<Occurence>($"/api/occurence/{occurence.Id}");

            Assert.IsNotNull(occurenceFetched);
        }

        [TestMethod]
        public async Task GetOccurencesWorks()
        {
            var habit = await PostAsAsyncWithSuccessfulResponse("/api/habit", GenerateValidHabit());
            await PostAsAsyncWithSuccessfulResponse("/api/occurence", GenerateValidOccurence(habit, DateTime.Today.AddDays(-1)));
            await PostAsAsyncWithSuccessfulResponse("/api/occurence", GenerateValidOccurence(habit, DateTime.Today.AddDays(-2)));
            await PostAsAsyncWithSuccessfulResponse("/api/occurence", GenerateValidOccurence(habit, DateTime.Today.AddDays(-3)));
            await PostAsAsyncWithSuccessfulResponse("/api/occurence", GenerateValidOccurence(habit, DateTime.Today.AddDays(-4)));

            var occurences = await GetMultipleAsync<Occurence>("/api/occurence");

            Assert.AreEqual(4, occurences.Count());
        }
    }
}
