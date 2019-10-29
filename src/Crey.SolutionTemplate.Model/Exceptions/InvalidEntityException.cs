namespace Crey.SolutionTemplate.Model.Exceptions
{
    using System;

    public class InvalidEntityException : InvalidOperationException
    {
        public InvalidEntityException(string message) : base(message) {}
    }
}
