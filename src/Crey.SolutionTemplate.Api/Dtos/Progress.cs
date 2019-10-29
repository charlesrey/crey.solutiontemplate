namespace Crey.SolutionTemplate.Api.Dtos
{
    using System;

    public class Progress
    {
        public Guid TaskId { get; set; }
        
        public double Percentage { get; set; }
    }
}
