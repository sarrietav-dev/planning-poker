using Microsoft.AspNetCore.SignalR;

namespace WebsocketHub;

public class MatchHub : Hub
{
    private readonly IMatchRepository _matchRepository;

    public MatchHub(IMatchRepository matchRepository)
    {
        _matchRepository = matchRepository;
    }

    public async Task CreateMatch(string name)
    {
        var matchId = _matchRepository.CreateMatch(name, Context.ConnectionId);
        await Groups.AddToGroupAsync(Context.ConnectionId, matchId);
        await Clients.Caller.SendAsync("MatchCreated", matchId);
    }
}