namespace Crey.SolutionTemplate.Model
{
    using System.ComponentModel.DataAnnotations;
    using System.Security.Cryptography;
    using System;


    /// <summary>
    /// Users representation.
    /// </summary>
    public class User : IUser
    {
        /// <summary>
        /// Hash constant.
        /// </summary>
        private const int HashIterationCount = 10000;

        /// <summary>
        /// Length of the salt used to crypt passwords.
        /// </summary>
        private const int SaltLength = 16;

        /// <summary>
        /// Length of the hash used to crypt password.
        /// </summary>
        private const int HashLength = 20;

        /// <summary>
        /// <see cref="IEntityWithId.Id"/>.
        /// </summary>
        [Required]
        public string Id { get; set; }

        /// <summary>
        /// <see cref="IUser.FirstName"/>.
        /// </summary>
        [Required]
        public string FirstName { get; set; }

        /// <summary>
        /// <see cref="IUser.LastName"/>.
        /// </summary>
        [Required]
        public string LastName { get; set; }

        /// <summary>
        /// <see cref="IUser.DisplayName"/>.
        /// </summary>
        public string DisplayName => $"{this.FirstName} {this.LastName}";

        /// <summary>
        /// <see cref="IUser.Email"/>.
        /// </summary>
        [Required]
        public string Email { get; set; }

        /// <summary>
        /// <see cref="IUser.Password"/>.
        /// </summary>
        [Required]
        public string Password { get; private set; }

        /// <summary>
        /// <see cref="IUser.Role"/>.
        /// </summary>
        [Required]
        public Role Role { get; set; }

        /// <summary>
        /// <see cref="IUser.CheckPassword(string)(string)"/>.
        /// </summary>
        public bool CheckPassword(string password)
        {
            if (!string.IsNullOrWhiteSpace(password) && this.Password != null)
            {
                byte[] original = Convert.FromBase64String(this.Password);
                byte[] salt = new byte[User.SaltLength];
                Array.Copy(original, 0, salt, 0, salt.Length);
                byte[] given = Convert.FromBase64String(this.Hash(salt, password));
                for (int indexHash = 0; indexHash < given.Length; indexHash++)
                {
                    if (original[indexHash] == given[indexHash])
                    {
                        // Hash is still the same we keep checking
                    }
                    else
                    {
                        return false;
                    }
                }
                return true;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// <see cref="IUser.SetPassword(string)"/>.
        /// </summary>
        public void SetPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
            {
                throw new ValidationException("Le mot de passe doit comporter au minimum 8 caractères");
            }
            else
            {
                this.Password = this.Hash(this.GetNewSalt(), password);
            }
        }

        /// <summary>
        /// Allows to have a new Salt to crypt passwords.
        /// </summary>
        /// <returns>An array of bytes conatining the new salt.</returns>
        private byte[] GetNewSalt()
        {
            byte[] salt = new byte[User.SaltLength];
            new RNGCryptoServiceProvider().GetBytes(salt);
            return salt;
        }

        /// <summary>
        /// Hash a given string with a salt.
        /// </summary>
        /// <param name="salt">The salt used to hash.</param>
        /// <param name="password">The string to hash.</param>
        /// <returns>The hashed password.</returns>
        private string Hash(byte[] salt, string password)
        {
            var hasher = new Rfc2898DeriveBytes(password, salt, User.HashIterationCount);

            byte[] hash = hasher.GetBytes(User.HashLength);

            byte[] completeHash = new byte[salt.Length + hash.Length];
            Array.Copy(salt, 0, completeHash, 0, salt.Length);
            Array.Copy(hash, 0, completeHash, salt.Length, hash.Length);

            return Convert.ToBase64String(completeHash);
        }
    }
}
