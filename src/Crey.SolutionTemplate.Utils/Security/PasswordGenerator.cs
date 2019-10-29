namespace Crey.SolutionTemplate.Utils.Security
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Cryptography;

    public class PasswordGenerator : IDisposable
    {
        public const string AlphaNumericalCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
            "abcdefghijklmnopqrstuvwxyz" +
            "0123456789";

        private RandomNumberGenerator generator = RandomNumberGenerator.Create();
        private bool disposedValue = false; // To detect redundant calls

        public string GetRandomString(int length, IEnumerable<char> characterSet)
        {
            if (length < 0)
            {
                throw new ArgumentException("length must not be negative", "length");
            }
            else if (length > int.MaxValue / 8) // 250 million chars ought to be enough for anybody
            {
                throw new ArgumentException("length is too big", "length");
            }
            else if (characterSet == null)
            {
                throw new ArgumentNullException("characterSet");
            }
            else if (!characterSet.Any())
            {
                throw new ArgumentException("characterSet must not be empty", "characterSet");
            }
            else
            {
                var characterArray = characterSet.Distinct().ToArray();
                var bytes = new byte[length * 8];
                this.generator.GetBytes(bytes);
                var result = new char[length];
                for (int i = 0; i < length; i++)
                {
                    ulong value = BitConverter.ToUInt64(bytes, i * 8);
                    result[i] = characterArray[value % (uint)characterArray.Length];
                }
                return new string(result);
            }
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    this.generator.Dispose();
                }
                else
                {
                    // Pas en train d'être disposé
                }
                disposedValue = true;
            }
            else
            {
                // Déjà disposé
            }
        }

        public void Dispose()
        {
            this.Dispose(true);
        }
    }
}
