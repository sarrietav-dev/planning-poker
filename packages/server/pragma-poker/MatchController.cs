using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace WebsocketHub;

[ApiController]
[Route("/api/[controller]")]
public class MatchController : ControllerBase
{
    private IHubContext<MatchHub> _context;
    private IMatchRepository _matchRepository;

    public MatchController(IHubContext<MatchHub> context, IMatchRepository matchRepository)
    {
        _context = context;
        _matchRepository = matchRepository;
    }

    [HttpPost]
    public void CreateMatch([FromBody] CreateMatchRequest request)
    {
    }
}

public class CreateMatchRequest
{
    public string Name { get; set; }
    public string OwnerId { get; set; }
}