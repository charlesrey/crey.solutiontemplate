namespace Crey.SolutionTemplate.Utils.Mail
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using MailKit.Net.Smtp;
    using Microsoft.Extensions.FileProviders;
    using Microsoft.Extensions.Options;
    using MimeKit;
    using Crey.SolutionTemplate.Utils.Configuration;
    using Crey.SolutionTemplate.Utils.Translations;

    public class MailSender
    {
        private readonly Smtp smtpConfig;

        private readonly ITranslationProvider translationProvider;

        /// <summary>
        /// <see cref="Service{T, TContext}.Service(IRepository{T, TContext})"
        /// </summary>
        public MailSender(
            IOptions<Smtp> smtpConfig,
            ITranslationProvider translationProvider)
        {
            this.smtpConfig = smtpConfig.Value;
            this.translationProvider = translationProvider;
        }

        public async Task SendMailAsync<TTranslation>(
            string to,
            string toName,
            Func<TTranslation, string> body,
            Func<TTranslation, string> subject)
            where TTranslation: ITranslation, new()
        {
            using (SmtpClient client = new SmtpClient())
            {
                var embeddedFileProvider = new EmbeddedFileProvider(typeof(TTranslation).Assembly);
                var contents = embeddedFileProvider.GetDirectoryContents("");
                var translation = this.translationProvider.Get<TTranslation>(contents.ToList());
                await client.ConnectAsync(this.smtpConfig.Host, this.smtpConfig.Port, false);

                await client.AuthenticateAsync(this.smtpConfig.Username, this.smtpConfig.Password);

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(this.smtpConfig.From, this.smtpConfig.FromMail));
                message.To.Add(new MailboxAddress(toName, to));

                message.Subject = subject(translation);

                message.Body = new TextPart("html")
                {
                    Text = body(translation)
                };
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }
    }
}
