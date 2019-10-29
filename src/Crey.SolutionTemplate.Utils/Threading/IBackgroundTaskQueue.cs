namespace Crey.SolutionTemplate.Utils.Threading
{
    using System.Threading;
    using System.Threading.Tasks;

    public interface IBackgroundTaskQueue<TParam> where TParam: struct
    {
        void QueueBackgroundWorkItem((IBackgroundTask<TParam>, TParam) workItem);

        Task<(IBackgroundTask<TParam>, TParam)> DequeueAsync(CancellationToken cancellationToken);
    }
}
