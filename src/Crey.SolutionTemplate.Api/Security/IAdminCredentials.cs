namespace Crey.SolutionTemplate.Api.Security
{
    public interface IAdminCredentials
    {
        string Mail { get; }

        string Password { get; }
    }
}
