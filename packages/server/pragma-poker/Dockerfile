FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["websocket-hub.csproj", "./"]
RUN dotnet restore "websocket-hub.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "websocket-hub.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "websocket-hub.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "websocket-hub.dll"]
