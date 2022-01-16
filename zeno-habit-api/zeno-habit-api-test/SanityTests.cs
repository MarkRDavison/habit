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
            var habit = await PostAsAsyncWithSuccessfulResponse("/api/habit", new Habit
            {
                Name = "Habit 1"
            });

            Assert.AreNotEqual(Guid.Empty, habit.Id);
            Assert.AreEqual(Sub.ToString(), habit.CreatedByUserId);
            Assert.AreEqual(DateTime.UtcNow.Date, habit.CreatedDate);
        }

        [TestMethod]
        public async Task GetHabitWorks()
        {
            var habit = await PostAsAsyncWithSuccessfulResponse("/api/habit", new Habit
            {
                Name = "Habit 1"
            });
            var habitFetched = await GetAsync<Habit>($"/api/habit/{habit.Id}");

            Assert.IsNotNull(habitFetched);
        }

        [TestMethod]
        public async Task GetHabitsWorks()
        {
            await PostAsAsyncWithSuccessfulResponse("/api/habit", new Habit { Name = "Habit 1" });
            await PostAsAsyncWithSuccessfulResponse("/api/habit", new Habit { Name = "Habit 2" });
            await PostAsAsyncWithSuccessfulResponse("/api/habit", new Habit { Name = "Habit 3" });
            await PostAsAsyncWithSuccessfulResponse("/api/habit", new Habit { Name = "Habit 4" });

            var habits = await GetMultipleAsync<Habit>("/api/habit");

            Assert.AreEqual(4, habits.Count());
        }

        [TestMethod]
        public async Task CreateOccurenceWorks()
        {
            var habit = await PostAsAsyncWithSuccessfulResponse("/api/habit", new Habit
            {
                Name = "Habit 1"
            });
            var occurence = await PostAsAsyncWithSuccessfulResponse("/api/occurence", new Occurence {
                HabitId = habit.Id
            });

            Assert.AreNotEqual(Guid.Empty, occurence.Id);
            Assert.AreEqual(Sub.ToString(), occurence.CreatedByUserId);
            Assert.AreEqual(DateTime.UtcNow.Date, occurence.CreatedDate);
        }

        [TestMethod]
        public async Task GetOccurenceWorks()
        {
            var habit = await PostAsAsyncWithSuccessfulResponse("/api/habit", new Habit
            {
                Name = "Habit 1"
            });
            var occurence = await PostAsAsyncWithSuccessfulResponse("/api/occurence", new Occurence
            {
                HabitId = habit.Id
            });

            var occurenceFetched = await GetAsync<Occurence>($"/api/occurence/{occurence.Id}");

            Assert.IsNotNull(occurenceFetched);
        }

        [TestMethod]
        public async Task GetOccurencesWorks()
        {
            var habit = await PostAsAsyncWithSuccessfulResponse("/api/habit", new Habit{ Name = "Habit 1" });
            await PostAsAsyncWithSuccessfulResponse("/api/occurence", new Occurence { HabitId = habit.Id });
            await PostAsAsyncWithSuccessfulResponse("/api/occurence", new Occurence { HabitId = habit.Id });
            await PostAsAsyncWithSuccessfulResponse("/api/occurence", new Occurence { HabitId = habit.Id });
            await PostAsAsyncWithSuccessfulResponse("/api/occurence", new Occurence { HabitId = habit.Id });

            var occurences = await GetMultipleAsync<Habit>("/api/occurence");

            Assert.AreEqual(4, occurences.Count());
        }
    }
}
