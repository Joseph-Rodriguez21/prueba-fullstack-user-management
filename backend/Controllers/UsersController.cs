using backend.Data;
using backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.ToListAsync();

            return Ok(users);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId =
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user =
                await _context.Users.FindAsync(
                    Guid.Parse(userId!)
                );

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(
            Guid id,
            UpdateUserDto dto
        )
        {
            var currentUserId =
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var currentUserRole =
                User.FindFirst(ClaimTypes.Role)?.Value;

            if (
                currentUserRole != "admin" &&
                currentUserId != id.ToString()
            )
            {
                return Forbid();
            }

            var user =
                await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            user.Name = dto.Name;
            user.Email = dto.Email;

            await _context.SaveChangesAsync();

            return Ok(user);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user =
                await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            return Ok("User deleted");
        }

        [HttpGet("admin")]
        [Authorize(Roles = "admin")]
        public IActionResult AdminOnly()
        {
            return Ok("Welcome Admin");
        }
        
        [Authorize(Roles = "admin")]
        [HttpPut("{id}/toggle-active")]
        public async Task<IActionResult> ToggleActive(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            
            if (user == null)
            {
                return NotFound();
            }
            
            var currentUserId =
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (
                currentUserId == id.ToString()
                && user.IsActive
                )
                
            {
                return BadRequest(
                    "You cannot deactivate yourself"
                    );
            }
            
            user.IsActive = !user.IsActive;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}/toggle-role")]
public async Task<IActionResult> ToggleRole(Guid id)
{
    var user = await _context.Users.FindAsync(id);

    if (user == null)
    {
        return NotFound();
    }

    var currentUserId =
        User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (
        currentUserId == id.ToString()
        && user.Role == "admin"
    )
    {
        return BadRequest(
            "You cannot remove your own admin role"
        );
    }

    user.Role =
        user.Role == "admin"
        ? "user"
        : "admin";

    user.UpdatedAt = DateTime.UtcNow;

    await _context.SaveChangesAsync();

    return Ok(user);
}
    }

}