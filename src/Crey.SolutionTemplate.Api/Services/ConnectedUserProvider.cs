namespace Crey.SolutionTemplate.Api.Services
{
    using System.Threading.Tasks;
    using Crey.SolutionTemplate.BusinessLogic;
    using Crey.SolutionTemplate.Model;

    public class ConnectedUserProvider : IConnectedUserProvider
    {
        private readonly string userName;

        private readonly UserService userService;

        public ConnectedUserProvider(string userName, UserService userService)
        {
            this.userName = userName;
            this.userService = userService;
        }

        public async Task<User> GetConnectedUserAsync()
        {
            return await this.userService.FindAsync(this.userName);
        }
    }
}
