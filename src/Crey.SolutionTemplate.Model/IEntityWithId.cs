namespace Crey.SolutionTemplate.Model
{
    /// <summary>
    /// Base contract for businesse entities with id.
    /// </summary>
    public interface IEntityWithId : IEntity
    {
        /// <summary>
        /// Entity id (Guid).
        /// </summary>
        string Id { get; }
    }
}
