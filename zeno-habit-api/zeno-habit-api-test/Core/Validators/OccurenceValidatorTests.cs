using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;
using System.Threading.Tasks;
using zeno_habit_api_core.Validators;
using zeno_habit_api_data.Models;
using zeno_habit_api_service.Services.Interfaces;

namespace zeno_habit_api_test.Core.Validators
{
    [TestClass]
    public class OccurenceValidatorTests
    {
        private readonly OccurenceValidator validator = new OccurenceValidator();

        internal Occurence GenerateValidOccurence(Guid habitId)
        {
            return new Occurence
            {
                Id = Guid.NewGuid(),
                HabitId = habitId,
                CreatedByUserId = Guid.NewGuid().ToString(),
                CreatedDate = DateTime.Today.AddDays(-1),
                OccurenceDate = DateTime.Today.AddDays(1)
            };
        }

        [TestMethod]
        public async Task ValidateMissingRequiredHabitIdWorks()
        {
            Guid habitId = Guid.NewGuid();
            var occurence = GenerateValidOccurence(habitId);
            occurence.HabitId = default(Guid);

            var errors = await validator.Validate(occurence);

            Assert.AreEqual(1, errors.Count);
            Assert.AreEqual(EntityValidations.MissingRequired, errors.First().Code);
            Assert.IsTrue(errors.First().Message.Contains(nameof(Occurence.HabitId)));
        }

        [TestMethod]
        public async Task ValidatePresentRequiredHabitIdWorks()
        {
            Guid habitId = Guid.NewGuid();
            var occurence = GenerateValidOccurence(habitId);
            occurence.HabitId = habitId;

            var errors = await validator.Validate(occurence);

            Assert.AreEqual(0, errors.Count);
        }

        [TestMethod]
        public async Task ValidateMissingRequiredOccurenceDateWorks()
        {
            Guid habitId = Guid.NewGuid();
            var occurence = GenerateValidOccurence(habitId);
            occurence.OccurenceDate = default(DateTime);

            var errors = await validator.Validate(occurence);

            Assert.AreEqual(1, errors.Count);
            Assert.AreEqual(EntityValidations.MissingRequired, errors.First().Code);
            Assert.IsTrue(errors.First().Message.Contains(nameof(Occurence.OccurenceDate)));
        }

        [TestMethod]
        public async Task ValidatePresentRequiredOccurenceDateWorks()
        {
            Guid habitId = Guid.NewGuid();
            var occurence = GenerateValidOccurence(habitId);
            occurence.OccurenceDate = DateTime.Today;

            var errors = await validator.Validate(occurence);

            Assert.AreEqual(0, errors.Count);
        }

        [TestMethod]
        public async Task ValidateCreatedByUserIdRequiredOnExisting()
        {
            Guid habitId = Guid.NewGuid();
            var occurence = GenerateValidOccurence(habitId);
            occurence.CreatedByUserId = null;

            var errors = await validator.Validate(occurence);

            Assert.AreEqual(1, errors.Count);
            Assert.AreEqual(EntityValidations.MissingRequired, errors.First().Code);
            Assert.IsTrue(errors.First().Message.Contains(nameof(Occurence.CreatedByUserId)));
        }

        [TestMethod]
        public async Task ValidateCreatedDateRequiredOnExisting()
        {
            Guid habitId = Guid.NewGuid();
            var occurence = GenerateValidOccurence(habitId);
            occurence.CreatedDate = null;

            var errors = await validator.Validate(occurence);

            Assert.AreEqual(1, errors.Count);
            Assert.AreEqual(EntityValidations.MissingRequired, errors.First().Code);
            Assert.IsTrue(errors.First().Message.Contains(nameof(Occurence.CreatedDate)));
        }

        [TestMethod]
        public async Task ValidateCreatedByUserIdNotRequiredOnNew()
        {
            Guid habitId = Guid.NewGuid();
            var occurence = GenerateValidOccurence(habitId);
            occurence.CreatedByUserId = null;
            occurence.Id = default(Guid);

            var errors = await validator.Validate(occurence);

            Assert.AreEqual(0, errors.Count);
        }

        [TestMethod]
        public async Task ValidateCreatedDateNotRequiredOnNew()
        {
            Guid habitId = Guid.NewGuid();
            var occurence = GenerateValidOccurence(habitId);
            occurence.CreatedDate = null;
            occurence.Id = default(Guid);

            var errors = await validator.Validate(occurence);

            Assert.AreEqual(0, errors.Count);
        }
    }
}
