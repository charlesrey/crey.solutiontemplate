namespace Crey.SolutionTemplate.Utils.Threading
{
    using System.Threading.Tasks;
    using System.Threading;

    public interface IBackgroundTask<TParam> where TParam: struct
    {
        string Name { get; }

        Task ExecuteAsync(TParam parameters, CancellationToken token);
    }
}
