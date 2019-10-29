namespace Crey.SolutionTemplate.Utils.Translations
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.Extensions.FileProviders;

    public interface ITranslationProvider
    {
        TTranslation Get<TTranslation>(List<IFileInfo> translationFiles) where TTranslation : ITranslation, new();
    }
}
