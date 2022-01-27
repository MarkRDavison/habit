using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Linq;
using System.Threading.Tasks;
using zeno_habit_api_core.Validators;
using zeno_habit_api_data.Models;
using zeno_habit_api_service.Services.Interfaces;

namespace zeno_habit_api_test.Core.Validators
{
    [TestClass]
    public class HabitValidatorTests
    {
        private readonly Mock<IEntityService<Habit>> entityServiceMock = new(MockBehavior.Strict);
        private readonly HabitValidator validator;

        public HabitValidatorTests()
        {
            validator = new HabitValidator(entityServiceMock.Object);
        }
        internal Habit GenerateValidHabit()
        {
            return new Habit {
                Id = Guid.NewGuid(),
                Name = "Habit Name",
                Question = "Have you?",
                CreatedByUserId = Guid.NewGuid().ToString(),
                CreatedDate = DateTime.Today.AddDays(-1)
            };
        }

        [TestMethod]
        public async Task ValidateMissingRequiredNameWorks()
        {
            var habit = GenerateValidHabit();
            habit.Name = null;

            var errors = await validator.Validate(habit);

            Assert.AreEqual(1, errors.Count);
            Assert.AreEqual(EntityValidations.MissingRequired, errors.First().Code);
            Assert.IsTrue(errors.First().Message.Contains(nameof(Habit.Name)));
        }

        [TestMethod]
        public async Task ValidatePresentRequiredNameWorks()
        {
            var habit = GenerateValidHabit();
            habit.Name = "Name";

            var errors = await validator.Validate(habit);

            Assert.AreEqual(0, errors.Count);
        }

        [TestMethod]
        public async Task ValidateMissingRequiredQuestionWorks()
        {
            var habit = GenerateValidHabit();
            habit.Question = null;

            var errors = await validator.Validate(habit);

            Assert.AreEqual(1, errors.Count);
            Assert.AreEqual(EntityValidations.MissingRequired, errors.First().Code);
            Assert.IsTrue(errors.First().Message.Contains(nameof(Habit.Question)));
        }

        [TestMethod]
        public async Task ValidatePresentRequiredQuestionWorks()
        {
            var habit = GenerateValidHabit();
            habit.Question = "Question";

            var errors = await validator.Validate(habit);

            Assert.AreEqual(0, errors.Count);
        }

        [TestMethod]
        public async Task ValidateCreatedByUserIdRequiredOnExisting()
        {
            var habit = GenerateValidHabit();
            habit.CreatedByUserId = null;

            var errors = await validator.Validate(habit);

            Assert.AreEqual(1, errors.Count);
            Assert.AreEqual(EntityValidations.MissingRequired, errors.First().Code);
            Assert.IsTrue(errors.First().Message.Contains(nameof(Habit.CreatedByUserId)));
        }

        [TestMethod]
        public async Task ValidateCreatedDateRequiredOnExisting()
        {
            var habit = GenerateValidHabit();
            habit.CreatedDate = null;

            var errors = await validator.Validate(habit);

            Assert.AreEqual(1, errors.Count);
            Assert.AreEqual(EntityValidations.MissingRequired, errors.First().Code);
            Assert.IsTrue(errors.First().Message.Contains(nameof(Habit.CreatedDate)));
        }

        [TestMethod]
        public async Task ValidateCreatedByUserIdNotRequiredOnNew()
        {
            var habit = GenerateValidHabit();
            habit.CreatedByUserId = null;
            habit.Id = default(Guid);

            var errors = await validator.Validate(habit);

            Assert.AreEqual(0, errors.Count);
        }

        [TestMethod]
        public async Task ValidateCreatedDateNotRequiredOnNew()
        {
            var habit = GenerateValidHabit();
            habit.CreatedDate = null;
            habit.Id = default(Guid);

            var errors = await validator.Validate(habit);

            Assert.AreEqual(0, errors.Count);
        }
    }
}
