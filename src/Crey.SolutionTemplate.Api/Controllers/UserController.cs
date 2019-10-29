namespace Crey.SolutionTemplate.Api.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Crey.SolutionTemplate.BusinessLogic;
    using Crey.SolutionTemplate.BusinessLogic.Exceptions;
    using Crey.SolutionTemplate.Model;
    using Crey.SolutionTemplate.Model.Exceptions;
    using Crey.SolutionTemplate.Api.Dtos;
    using Crey.SolutionTemplate.Api.Security;

    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly UserService userService;

        public UserController(UserService userService)
        {
            this.userService = userService;
        }

        // GET api/values
        [Authorize(Policy = PolicyConstants.IsAdmin)]
        [HttpGet("Users")]
        public async Task<IEnumerable<Model.User>> Get()
        {
            return await this.userService.QueryAsync(query => query);
        }

        // GET api/values
        [HttpGet]
        public async Task<IActionResult> UserInfo()
        {
            var user = await this.userService.FindAsync(this.HttpContext.User.FindFirst("username").Value);
            if (user != null)
            {
                return this.Ok(user);
            }
            else
            {
                return this.NotFound();
            }
        }

        [Authorize(Policy = PolicyConstants.IsAdmin)]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Model.User user)
        {
            try
            {
                return this.Ok(await this.userService.SaveAsync(user));
            }
            catch (InvalidEntityException exc)
            {
                return this.BadRequest(exc.Message);
            }
        }

        [Authorize(Policy = PolicyConstants.IsAdmin)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] Model.User user)
        {
            try
            {
                return this.Ok(await this.userService.SaveAsync(user));
            }
            catch (InvalidEntityException exc)
            {
                return this.BadRequest(exc.Message);
            }
        }

        [Authorize(Policy = PolicyConstants.IsAdmin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            id = WebUtility.UrlDecode(id);
            var user = (await this.userService.QueryAsync(query => query.Where(usr => usr.Id.Equals(id)))).FirstOrDefault();
            if (user != null)
            {
                await this.userService.DeleteAsync(user);
                return this.NoContent();
            }
            else
            {
                return this.NotFound();
            }
        }

        [AllowAnonymous]
        [HttpPost("AskReset")]
        public async Task<IActionResult> AskResetPassword([FromForm]AskResetPassword userEmail)
        {
            await this.userService.AskResetPassowrd(userEmail.Mail);
            return this.NoContent();
        }

        [AllowAnonymous]
        [HttpPost("PerformReset")]
        public async Task<IActionResult> PerformResetPassword([FromForm]ResetPassword resetRequest)
        {
            try
            {
                await this.userService.ResetPassword(resetRequest.Password, resetRequest.Token);
                return this.NoContent();
            }
            catch(Exception exc) when (exc is EntityNotFoundException || exc is TokenValidationException)
            {
                return this.BadRequest();
            }
        }
    }
}
