using Microsoft.AspNetCore.SignalR;
using WebsocketHub;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<MatchHub>("/ws");

app.Run();