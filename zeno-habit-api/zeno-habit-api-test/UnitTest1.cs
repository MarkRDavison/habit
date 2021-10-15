using Microsoft.VisualStudio.TestTools.UnitTesting;
using zeno_habit_api;

namespace zeno_habit_api_test {
    [TestClass]
    public class UnitTest1 {
        [TestMethod]
        public void TestMethod1() {
            var wf = new WeatherForecast { 
                TemperatureC = 25
            };

            Assert.AreNotEqual(25, wf.TemperatureF);
        }
    }
}
