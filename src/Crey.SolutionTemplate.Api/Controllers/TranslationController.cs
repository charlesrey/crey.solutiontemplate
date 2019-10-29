namespace Crey.SolutionTemplate.Api.Controllers
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Reflection;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.FileProviders;
    using Newtonsoft.Json;

    [Route("api/[controller]")]
    public class TranslationController : Controller
    {

        public TranslationController()
        {
        }

        // GET api/values
        [AllowAnonymous]
        [HttpGet("{lang}/{part}/{timestamp?}")]
        public async Task<IActionResult> Get(string lang, string part, long? timestamp)
        {
            var tempLang = lang.Replace("-", "_");
            var embeddedFileProvider = new EmbeddedFileProvider(Assembly.GetEntryAssembly());
            var contents = embeddedFileProvider.GetDirectoryContents("");
            var fileInfo = contents.FirstOrDefault(
                f => f.Name.Equals($"Translations.{tempLang}.{part}.json", StringComparison.InvariantCultureIgnoreCase));
            if (fileInfo != null)
            {
                if (fileInfo.LastModified.Ticks > timestamp.GetValueOrDefault())
                {
                    using (var reader = new StreamReader(fileInfo.CreateReadStream()))
                    {
                        var trad = await reader.ReadToEndAsync();
                        trad = trad.Insert(1, "\"Part\" : \"" + part + "\",");
                        object temp = JsonConvert.DeserializeObject(trad);
                        return this.Ok(new
                        {
                            TimeStamp = fileInfo.LastModified.Ticks,
                            Translation = temp,
                            Lang = lang,
                        });
                    }
                }
                else
                {
                    return this.StatusCode(304);
                }
            }
            else
            {
                return this.NotFound();
            }
        }
    }
}
