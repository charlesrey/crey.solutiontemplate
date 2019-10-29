namespace Crey.SolutionTemplate.BusinessLogic
{
    using System.Threading.Tasks;
    using Crey.SolutionTemplate.Model;

    public interface IConnectedUserProvider
    {
        Task<User> GetConnectedUserAsync();
    }
}
