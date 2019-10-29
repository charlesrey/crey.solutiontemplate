namespace Crey.SolutionTemplate.Utils.Threading
{
    using System;
    using System.Collections.Concurrent;
    using System.Threading.Tasks;
    using System.Threading;

    public class BackgroundTaskQueue<TParam> : IBackgroundTaskQueue<TParam> where TParam: struct
    {
        private ConcurrentQueue<(IBackgroundTask<TParam>, TParam)> workItems = new ConcurrentQueue<(IBackgroundTask<TParam>, TParam)>();

        private SemaphoreSlim signal = new SemaphoreSlim(0);

        public void QueueBackgroundWorkItem((IBackgroundTask<TParam>, TParam) workItem)
        {
            if (workItem.Item1 == null)
            {
                throw new ArgumentNullException(nameof(workItem));
            }
            else
            {
                this.workItems.Enqueue(workItem);
                this.signal.Release();
            }

        }

        public async Task<(IBackgroundTask<TParam>, TParam)> DequeueAsync(CancellationToken cancellationToken)
        {
            await this.signal.WaitAsync(cancellationToken);
            this.workItems.TryDequeue(out var workItem);

            return workItem;
        }
    }
}
