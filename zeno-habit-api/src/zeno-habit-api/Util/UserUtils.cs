using System.Security.Claims;
using zeno_habit_api_data.Models;
using zeno_habit_api_service.Auth;

namespace zeno_habit_api.Util
{
    public class UserUtils
    {

        public static User Create(ClaimsPrincipal user)
        {
            return new User
            {
                Sub = user.ProxiedUserSubjectId()
            };
        }

    }
}
