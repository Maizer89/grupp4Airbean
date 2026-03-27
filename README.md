# Airbean

[Beställa kaffe och få det levererat med drönare.]

## Teknikstack

- Node.js
- Express
- SQLite (better-sqlite3)
- dotenv
- UUID

## Installation

```bash
# Klona repot
git clone https://github.com/Maizer89/grupp4Airbean
cd grupp4Airbean

# Installera beroenden
npm install

# Skapa .env (kopiera från .env.example)
cp .env.example .env
# Fyll i dina värden i .env

# Starta servern
node server.js
# eller med --watch:
node --watch server.js
```

Servern startar på `http://localhost:${PORT}$`.

## API-dokumentation

[Här lägger ni er API-dokumentation – varje endpoint med metod, URL, body, svar och felfall.
Se guiden "API-dokumentation" för format och exempel.]

## WebSocket-diskussion

[Skriv en kort reflektion: Hur skulle WebSockets kunna användas i det här projektet?
T.ex. realtidsuppdateringar av orderstatus, live-notiser till baristan, etc.]

## Gruppmedlemmar

- [Rasmus Billgren]
- [Neha Chatrath]
- [Rasmus Lindvall]
- [Sofia Arfwedson]