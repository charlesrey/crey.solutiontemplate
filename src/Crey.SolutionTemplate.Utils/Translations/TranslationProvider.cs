namespace Crey.SolutionTemplate.Utils.Translations
{
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.Extensions.FileProviders;
    using Newtonsoft.Json;

    public class TranslationProvider : ITranslationProvider
    {
        public TTranslation Get<TTranslation>(List<IFileInfo> translationFiles)
            where TTranslation : ITranslation, new()
        {
            var translation = new TTranslation();
            var file = translationFiles.FirstOrDefault(
                f => f.Name.EndsWith($"{CultureInfo.CurrentCulture.Name.Replace("-", "_")}.{translation.Name}.json"));
            if (file != null)
            {
                using (var reader = new StreamReader(file.CreateReadStream()))
                {
                    return new JsonSerializer().Deserialize<TTranslation>(new JsonTextReader(reader));
                }
            }
            else
            {
                throw new FileNotFoundException(
                    $"The translation file {translation.Name}.json for culture {CultureInfo.CurrentCulture.Name} is missing");
            }
        }
    }
}
