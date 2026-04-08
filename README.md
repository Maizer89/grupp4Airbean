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


|Metod   |            URL            |      Body (POST/PUT)        | Query parameter | Status code |
|--------|---------------------------|-----------------------------|-----------------|-------------|
|  GET   |    /api/menu              |                             | -               |200, 500     |
|--------|---------------------------|-----------------------------|-----------------|-------------|
|  GET   |    /api/menu/:id          |                             | -               |200, 404, 500|
|--------|---------------------------|-----------------------------|-----------------|-------------|
|  GET   |    /api/orders/my-orders  |                             | -               |200, 401,403 |
|--------|---------------------------|-----------------------------|-----------------|-------------|
|  GET   |/api/orders/status/:orderId|                             | -               |200, 403, 404|
|--------|---------------------------|-----------------------------|-----------------|-------------|
|  POST  |    /api/users             |    name, email              | -               |201, 500     |
|--------|---------------------------|-----------------------------|-----------------|-------------|
|  POST  |    /api/orders            | shippingAdress, orderItems  | -               |201, 400     |
|--------|---------------------------|-----------------------------|-----------------|-------------|
|  POST  |    /api/menu              |    title, price, desc,      | -               |201, 400     |
|--------|---------------------------|-----------------------------|-----------------|-------------|
|  PUT   |    /api/users/:id         |    name?, email?            | -               |200, 400, 404|
|--------|---------------------------|-----------------------------|-----------------|-------------|
|  PUT   |    /api/menu/:id          |    title?, price?, desc?    | -               |204, 404     |
|--------|---------------------------|-----------------------------|-----------------|-------------|
| DELETE |    /api/users/:id         |                             | -               |204, 404     |
|--------|---------------------------|-----------------------------|-----------------|-------------|           

1
Hämta alla kaffealternativ
GET /api/menu
Svar (200): (ok) 

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
Fel (500): "kan inte fetch menu"
---
2
Hämta ett specifikt kattealternativ med id
GET /api/menu/:id
Svar (200): (ok) 
Exempel:
      {
        "id":1,
        "title":"Bryggkaffe",
        "desc":"Bryggd på månadens bönor.",
        "price":39
      },
Fel (404 + 500): "Kan inte hitta item i menu" + "Kan inte fetch item"
---
3
Kunna se beställningar när man är inloggad
GET /api/orders/my-orders
Svar (): ok
Exempel:
{
        "id": 30,
        "total_amount": 62.4,
        "shipping_address": "Kaffegatan 1",
        "delivery_time": "10-15min leveranstid",
        "createdAt": "2026-04-08T09:32:05.114Z",
        "items": [
            {
                "product_id": 1,
                "price": 39,
                "quantity": 2,
                "product_name": "Bryggkaffe"
            }
        ]
    }

Fel (401): "Logga in för att se orders"
---
4
Kunna se status på hur lång tid kvar det är på sin leverans
GET /api/orders/status/orderId
Svar (200): (ok)
{
    "orderId": "10",
    "remainingTime": 0,
    "status": "delivered"
}
Fel (403 + 404): "Logga in för att se status för denna order" + "Order hittades inte."
---
5
Registrerar en ny användare
POST /api/users
Svar (201): (ok)
Exempel: (Body)
{
  "name": "hej Testsson",
  "email": "hej@mail.se"
}
Fel (500): "Kunde inte skapa användare"
---
6
Lägger till en order
POST /api/orders
Svar (ok):
Exempel: (Body)
{
  "userId": "b13adf84-7d27-4fe0-993e-e09eed473cfe",
  "shippingAddress": "Kaffegatan 1",
  "orderItems": [
    {
      "product_name": "Bryggkaffe",
      "product_id": 1,
      "quantity": 2
    }
  ]
}
Fel (400): "orderItems måste vara en array och innehålla minst 1 produkt"
---
7
Lägg till fler beställningsmöjligheter med ADMIN
POST /api/menu
Svar (ok): 201
Exempel: (Body)
  {
     "title": "mycketfinkopp te",
     "price": 55,
     "desc": "Bryggd på gårdagens bönor."     
  }
Fel (403): "Åtkomst nekad. Admin krävs."
---
8
Uppdatera items i menu
PUT /api/menu/id:
Svar (200): (ok)
Exempel: (Body)
{
    "id": 289,
    "title": "mycketfin kaffe",
    "price": 60,
    "desc": "Bryggd på gårdagens bönor. mycket gott",
    "createdAt": "2026-04-08T12:04:04.643Z",
    "updatedAt": "2026-04-08T12:42:10.032Z"
}
Fel (404): "kan inte hitta item i menu"
---
9
Uppdaterar ett användarkonto med hjälp av COALESCE.
PUT /api/users/:id
Svar (200): (ok)
Exempel: (Body)
"namn": "nytt namn"
"email": "nytt email"

Fel (500): "Kunde inte uppdatera användare"
---
10
Raderar ett användarkonto
DELETE /api/users/:id
Svar (200): (ok)
{
    "Konto är raderat"
}

Fel (404): "Kan inte hitta användaren"
---

## WebSocket-diskussion

Websockets gör det möjligt att frontend och backend uppdaterar direkt, i detta projekt använder vi orderstatus där man ska kunna se hur lång tid det är kvar på sin order att leverera. Man skulle då ha kunnat använda websockets för att i realtid se sin orderstatus utan att behöva uppdatera sidan själv. Detta hade gjort det smidigare men även en ökad användarupplevelsen på gränssnittet. Detta kan även bli tilldelat med den som gör kaffet, att någon har lagt en beställning och att en live-notis skickas till arbetaren för att sedan göra kaffet.


## Gruppmedlemmar

- [Rasmus Billgren]
- [Neha Chatrath]
- [Rasmus Lindvall]
- [Sofia Arfwedson]