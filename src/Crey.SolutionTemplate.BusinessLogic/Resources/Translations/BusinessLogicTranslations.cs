namespace Crey.SolutionTemplate.BusinessLogic.Resources.Translations
{
    using Crey.SolutionTemplate.Utils.Translations;

    public class BusinessLogicTranslations : BaseTranslation
    {
        public string AccountCreationMailSubject { get; set; }

        public string AccountCreationMailBodySrc { private get; set; }

        public string AccountPasswordResetEmailSubject { get; set; }

        public string AccountPasswordResetEmailBodySrc { private get; set; }

        public string AccountPasswordResetEmailBodyNotFound { get; set; }

        public string AccountCreationMailBody(string userName, string link)
            => string.Format(this.AccountCreationMailBodySrc, userName, link);

        public string AccountPasswordResetEmailBody(string userName, string url)
            => string.Format(this.AccountPasswordResetEmailBodySrc, userName, url);
        
    }
}
