namespace Crey.SolutionTemplate.Model.Exceptions
{
    using System;

    public class EntityNotFoundException : InvalidOperationException
    {
        public EntityNotFoundException(string message) : base(message) {}
    }

}
