using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
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
        private readonly Mock<IEntityService<Occurence>> occurenceEntityServiceMock = new(MockBehavior.Strict);
        private readonly OccurenceValidator validator;

        public OccurenceValidatorTests()
        {
            validator = new OccurenceValidator(occurenceEntityServiceMock.Object);
            occurenceEntityServiceMock.Setup(_ => _.Entities).Returns(new List<Occurence>().AsQueryable());
        }

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

        [TestMethod]
        public async Task ValidateCollidingOccurenceDatesForDifferentHabitPasses()
        {
            var occurence1 = GenerateValidOccurence(Guid.NewGuid());
            var occurence2 = GenerateValidOccurence(Guid.NewGuid());

            occurenceEntityServiceMock.Setup(_ => _.Entities).Returns(new List<Occurence> { occurence1 }.AsQueryable());

            var errors = await validator.Validate(occurence2);

            Assert.AreEqual(0, errors.Count);
        }

        [TestMethod]
        public async Task ValidateCollidingOccurenceDatesForSameHabitFails()
        {
            var habitId = Guid.NewGuid();
            var occurence1 = GenerateValidOccurence(habitId);
            var occurence2 = GenerateValidOccurence(habitId);

            occurenceEntityServiceMock.Setup(_ => _.Entities).Returns(new List<Occurence> { occurence1 }.AsQueryable());

            var errors = await validator.Validate(occurence2);

            Assert.AreEqual(1, errors.Count);
            Assert.AreEqual(EntityValidations.Duplicated, errors.First().Code);
            Assert.IsTrue(errors.First().Message.Contains(nameof(Occurence.OccurenceDate)));
        }

        public static IEnumerable<object[]> DuplicateOccurenceDatePredicate_WorksData()
        {
            var occurence = new Occurence
            {
                HabitId = Guid.NewGuid(),
                OccurenceDate = new DateTime(2022, 1, 27)
            };
            yield return new object[] { new Occurence { HabitId = Guid.NewGuid(), OccurenceDate = occurence.OccurenceDate.AddDays(+1) }, occurence, false };
            yield return new object[] { new Occurence { HabitId = Guid.NewGuid(), OccurenceDate = occurence.OccurenceDate.AddDays(-1) }, occurence, false };
            yield return new object[] { new Occurence { HabitId = Guid.NewGuid(), OccurenceDate = occurence.OccurenceDate }, occurence, false };
            yield return new object[] { new Occurence { HabitId = occurence.HabitId, OccurenceDate = occurence.OccurenceDate }, occurence, true };
            yield return new object[] { new Occurence { HabitId = occurence.HabitId, OccurenceDate = occurence.OccurenceDate.AddDays(+1) }, occurence, false };
            yield return new object[] { new Occurence { HabitId = occurence.HabitId, OccurenceDate = occurence.OccurenceDate.AddDays(-1) }, occurence, false };
        }

        [DataTestMethod]
        [DynamicData(nameof(DuplicateOccurenceDatePredicate_WorksData), DynamicDataSourceType.Method)]
        public void DuplicateOccurenceDatePredicate_Works(Occurence newOccurence, Occurence existingOccurence, bool expected)
        {
            var func = OccurenceValidator.DuplicateOccurenceDatePredicate(newOccurence);
            Assert.AreEqual(expected, func(existingOccurence));
        }
    }
}
