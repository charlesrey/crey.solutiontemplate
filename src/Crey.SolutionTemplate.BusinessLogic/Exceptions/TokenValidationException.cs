namespace Crey.SolutionTemplate.BusinessLogic.Exceptions
{
    using System;

    public class TokenValidationException : InvalidOperationException
    {
        public TokenValidationException(string message) : base(message) { }
    }
}
