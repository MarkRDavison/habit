namespace zeno_habit_api_framework.Configuration
{
    public class AppSettings
    {
        public static string ZENO_HABIT = "ZENO_HABIT";
        public string DATABASE_TYPE { get; set; }
        public string CONNECTION_STRING { get; set; }
        public string DATABASE_HOST { get; set; }
        public string DATABASE_PORT { get; set; }
        public string DATABASE_USER { get; set; }
        public string DATABASE_PASSWORD { get; set; }
        public string DATABASE_NAME { get; set; }
        public string AUTHORITY { get; set; }
        public bool REQUIRE_AUTH { get; set; } = true;
    }
}
