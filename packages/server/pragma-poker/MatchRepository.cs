namespace WebsocketHub;

public interface IMatchRepository
{
    string CreateMatch(string name, string ownerId);
    void JoinMatch(string matchId, string userId);
    void LeaveMatch(string matchId, string userId);
    void RestartMatch(string matchId);
    void EndMatch(string matchId);
}