namespace Crey.SolutionTemplate.Api.Security
{
    public class AdminCredentials : IAdminCredentials
    {
        public string Mail { get; set; }

        public string Password { get; set; }
    }
}
