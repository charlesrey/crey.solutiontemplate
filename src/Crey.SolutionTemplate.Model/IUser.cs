namespace Crey.SolutionTemplate.Model
{
    /// <summary>
    /// Contract for users entities.
    /// </summary>
    public interface IUser : IEntityWithId
    {
        /// <summary>
        /// Name to display.
        /// </summary>
        string DisplayName { get; }

        /// <summary>
        /// Mail address.
        /// </summary>
        string Email { get; }

        /// <summary>
        /// User password.
        /// </summary>
        string Password { get; }

        /// <summary>
        /// First name.
        /// </summary>
        string FirstName { get; }

        /// <summary>
        /// Last name.
        /// </summary>
        string LastName { get; }

        /// <summary>
        /// Role.
        /// </summary>
        Role Role { get; }

        /// <summary>
        /// Allows to set and encrypt a new password.
        /// </summary>
        /// <param name="newPassword">The new password (unencrypted).</param>
        void SetPassword(string newPassword);

        /// <summary>
        /// Check if the given unuencrypted password match the user's password.
        /// </summary>
        /// <param name="password">The password to check (unencrypted).</param>
        /// <returns>True if the password is the user's one.</returns>
        bool CheckPassword(string password);
    }
}
