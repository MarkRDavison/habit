FROM mcr.microsoft.com/dotnet/sdk:6.0 as BUILD
WORKDIR /app 

COPY / /app/
RUN dotnet restore
RUN dotnet test
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:6.0-alpine
WORKDIR /app
COPY --from=BUILD /app/out .

ENTRYPOINT ["dotnet", "zeno-habit-api.dll"]
