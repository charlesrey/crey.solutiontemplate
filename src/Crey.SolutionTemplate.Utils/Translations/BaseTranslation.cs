namespace Crey.SolutionTemplate.Utils.Translations
{
    public class BaseTranslation : ITranslation
    {
        public string Name => this.GetType().Name;
    }
}
