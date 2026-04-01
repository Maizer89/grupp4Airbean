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


Base URL: https://localhost:3000/api/menu

|--------|------------------|-----------------------------|-----------------|-------------|
|Metod   |       URL        | Body (POST/PUT)             | Query parameter | Status code |
|--------|------------------|-----------------------------|-----------------|-------------|
|GET     | /api/menu        |                             | -               |200, 500     |
|--------|------------------|-----------------------------|-----------------|-------------|
|GET     | /api/menu/:id    |                             | -               |200, 404, 500|
|--------|------------------|-----------------------------|-----------------|-------------|
|POST    | /api/users       | name, email                 | -               |201, 500     |
|--------|------------------|-----------------------------|-----------------|-------------|
|POST    | /api/orders      | shippingAdress, orderItems  | -               |201, 400     |
|--------|------------------|-----------------------------|-----------------|-------------|
|PUT     |/api/users/:id    | "name": "email"             |                 |200, 400, 404|
|--------|------------------|-----------------------------|-----------------|-------------|
|DELETE  |/api/users/:id    |                             | -               |204, 404     |
|--------|------------------|-----------------------------|-----------------|-------------|          


Hämta alla kaffealternativ
GET /api/menu

      {
        "id":1,
        "title":"Bryggkaffe",
        "desc":"Bryggd på månadens bönor.",
        "price":39
      },
      {
        "id":2,
        "title":"Caffè Doppio",
        "desc":"Bryggd på månadens bönor.",
        "price":49
      },


Hämta ett specifikt kattealternativ med id
GET /api/menu/:id

      {
        "id":1,
        "title":"Bryggkaffe",
        "desc":"Bryggd på månadens bönor.",
        "price":39
      },

Registrerar en ny användare
POST /api/users


Ändrar på ett användarkonto med hjälp av COALESCE.

PUT /api/users/:id

"namn": "nytt namn"
"email": "nytt email"


Raderar ett användarkonto

DELETE /api/users/:id

"Användaren har raderats"




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