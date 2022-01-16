using Microsoft.EntityFrameworkCore;
using zeno_habit_api_data.Models;

namespace zeno_habit_api_data.Services
{
    public class HabitDbContext : DbContext
    {

        public const string SQLITE = "sqlite";
        public const string POSTGRES = "postgres";

        /// <summary>
        /// Creates a new instance of the <see cref="TorrentDbContext"/> class.
        /// </summary>
        public HabitDbContext(DbContextOptions options) : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region Habit
            modelBuilder
                .Entity<Habit>()
                .HasKey(_ => _.Id);
            modelBuilder
                .Entity<Habit>()
                .Property(_ => _.Id)
                .IsRequired()
                .ValueGeneratedOnAdd();
            modelBuilder
                .Entity<Habit>()
                .Property(_ => _.Name)
                .IsRequired()
                .HasMaxLength(255);
            modelBuilder
                .Entity<Habit>()
                .Property(_ => _.CreatedByUserId)
                .IsRequired();
            modelBuilder
                .Entity<Habit>()
                .Property(_ => _.CreatedDate)
                .IsRequired();
            #endregion
            #region Occurence
            modelBuilder
                .Entity<Occurence>()
                .HasKey(_ => _.Id);
            modelBuilder
                .Entity<Occurence>()
                .Property(_ => _.Id)
                .IsRequired()
                .ValueGeneratedOnAdd();
            modelBuilder
                .Entity<Occurence>()
                .Property(_ => _.CreatedDate)
                .IsRequired();
            modelBuilder
                .Entity<Occurence>()
                .Property(_ => _.CreatedByUserId)
                .IsRequired();
            modelBuilder
                .Entity<Occurence>()
                .Property(_ => _.HabitId)
                .IsRequired();
            #endregion
        }

        public DbSet<Habit> Habits { get; set; }
        public DbSet<Occurence> Occurences { get; set; }
    }
}
