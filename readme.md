⚔️ Naruto Card Battle

Real-time Shinobi Combat --- 1v1 multiplayer card battles powered by
WebSockets and Redis.

A Naruto-inspired real-time multiplayer card battle game built with
React, TypeScript, Node.js, Express, WebSockets, and Redis.

Players select a shinobi, enter a matchmaking queue, and battle another
player in real time. The backend is server-authoritative, meaning
game actions are validated and resolved on the server before the
resulting state is synchronized with both players.

🎮 Features

⚔️ Real-time 1v1 multiplayer battles

🔌 WebSocket-based real-time communication

🎯 Matchmaking queue

🛡️ Server-authoritative game state

🔄 Real-time state synchronization

🃏 Attack and defense card mechanics

❤️ HP, energy, and shield systems

🏆 Win/loss detection

📱 Responsive desktop and mobile UI

🎵 Battle audio and music

⚡ Redis-backed matchmaking and game infrastructure

🚀 Production deployment with Vercel and Render

🧰 Tech Stack

Frontend

Technology      Purpose

React           UI development
TypeScript      Type-safe application code
Vite            Frontend build tooling
Tailwind CSS    Styling and responsive UI
WebSocket API   Real-time server communication

Backend

Technology   Purpose

Node.js      Server runtime
TypeScript   Type-safe backend code
Express      HTTP server
ws         WebSocket server
Redis        Matchmaking/game infrastructure
UUID         Unique player/game identifiers

Deployment

Service                 Usage

Vercel                  Frontend
Render                  Backend
Render Redis / Valkey   Redis infrastructure

🏗️ Architecture

┌──────────────────────────────┐
│      React + Vite            │
│          Vercel              │
└──────────────┬───────────────┘
               │
               │ Secure WebSocket (WSS)
               ▼
┌──────────────────────────────┐
│ Node.js + Express + ws       │
│          Render              │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Redis / Valkey         │
│                              │
│  Matchmaking + Game State    │
└──────────────────────────────┘

Server-authoritative flow

Player Action
     │
     ▼
WebSocket
     │
     ▼
Backend Validation
     │
     ▼
Game Logic
     │
     ▼
Updated Game State
     │
     ├──────────────► Player 1
     │
     └──────────────► Player 2

The client does not determine the final game result. The backend
validates and executes actions, then broadcasts the resulting state.

📁 Project Structure

Real-Time-Multiplayer-Card-Game/
│
├── client/
│   ├── public/
│   │   ├── audio/
│   │   ├── characters/
│   │   └── ...
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   └── cards/
│   │   ├── services/
│   │   │   └── websocket.ts
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── cards/
│   │   ├── characters/
│   │   ├── game/
│   │   ├── matchmaking/
│   │   ├── players/
│   │   ├── redis/
│   │   ├── websocket/
│   │   └── server.ts
│   │
│   └── package.json
│
├── shared/
├── docker-compose.yml
└── .gitignore

🕹️ How It Works

1. Character Selection

A player selects a shinobi before entering matchmaking.

2. Matchmaking

The client sends a WebSocket request:

{
  "type": "JOIN_QUEUE",
  "characterId": "naruto"
}

The backend places the player into the matchmaking queue. When another
compatible player is available, a game is created.

3. Game Creation

Both players receive:

MATCH_FOUND
GAME_STARTED

These messages contain the game information and initial game state.

4. Playing Cards

A card action is sent through WebSocket:

{
  "type": "PLAY_CARD",
  "gameId": "game-id",
  "cardId": "rasengan"
}

The backend validates the action, executes the game logic, and produces
the resulting state.

5. State Synchronization

Successful actions produce:

GAME_STATE_UPDATED

The updated state is synchronized with both players.

6. Game Over

When a winning condition is reached, both players receive:

GAME_OVER

with the appropriate result.

🔌 WebSocket Protocol

Client → Server

JOIN_QUEUE
PLAY_CARD

Server → Client

CONNECTED
QUEUE_JOINED
MATCH_FOUND
GAME_STARTED
GAME_STATE_UPDATED
GAME_OVER
ACTION_ERROR
ERROR

🧩 Backend Architecture

The backend follows a modular server architecture:

server/src/
├── cards/          # Card definitions
├── characters/     # Character definitions
├── game/           # Game logic and actions
├── matchmaking/    # Matchmaking service
├── players/        # Connected player management
├── redis/          # Redis connection
├── websocket/      # WebSocket handling
└── server.ts       # HTTP/WebSocket server

Architecture note: This is a modular backend, not a true
microservices architecture. A dedicated microservices architecture
would be a future scaling option rather than a current project
characteristic.

💻 Local Development

Prerequisites

Node.js

npm

Redis

Clone the repository

git clone https://github.com/RahulDebnath007/Real-Time-Multiplayer-Card-Game.git
cd Real-Time-Multiplayer-Card-Game

Start the backend

cd server
npm install
npm run dev

Local server:

HTTP:      http://localhost:3000
WebSocket: ws://localhost:3000

Start the frontend

Open another terminal:

cd client
npm install
npm run dev

🔐 Environment Variables

Client

Create:

client/.env.local

For local development:

VITE_WS_URL=ws://localhost:3000

For production:

VITE_WS_URL=wss://real-time-multiplayer-card-game.onrender.com

Server

REDIS_URL=your-redis-connection-url

Never commit secrets or .env files to GitHub.

🚀 Deployment

Frontend --- Vercel

Configuration:

Framework:       Vite
Root Directory:  client
Build Command:   npm run build
Output Directory: dist

Production environment variable:

VITE_WS_URL=wss://real-time-multiplayer-card-game.onrender.com

Backend --- Render

Configuration:

Root Directory: server
Build Command: npm install && npm run build
Start Command: npm start

The backend listens on the PORT environment variable supplied by
Render.

Redis / Valkey

The production backend connects through:

REDIS_URL=...

✅ Production Verification

The deployed application has been tested for:

Frontend loading

Production card assets

WebSocket connection

Character selection

Matchmaking

Multiplayer game creation

Card actions

Real-time state synchronization

Attack/defense mechanics

HP, energy, and shield updates

Game-over handling

Redis connectivity

Two separate browser sessions can be used to simulate two players.

🔒 Security & Future Hardening

The backend executes game actions server-side instead of trusting
client-calculated results.

Planned hardening includes:

Authentication

Strong input validation

Rate limiting

WebSocket reconnection

Disconnect handling

Race-condition protection

Per-game authorization

Persistent match history

Structured logging and monitoring

🔮 Future Improvements

👤 Player authentication

🏆 Leaderboards and rankings

📜 Persistent match history

🔄 Automatic WebSocket reconnection

🔐 Stronger concurrency handling

🚦 Rate limiting

👤 Player profiles

🎯 Ranked matchmaking

🃏 More characters and cards

✨ Additional battle effects and animations

🧱 Dedicated microservices architecture if scaling requires it

📊 Project Status

Component                             Status

React frontend                          ✅
TypeScript                              ✅
Responsive UI                           ✅
WebSockets                              ✅
Real-time synchronization               ✅
Matchmaking                             ✅
Server-authoritative game logic         ✅
Redis                                   ✅
Multiplayer gameplay                    ✅
Vercel deployment                       ✅
Render deployment                       ✅
Production Redis/Valkey                 ✅
Microservices architecture              ❌
Authentication                          🚧
Advanced race-condition protection      🚧

👨‍💻 Author

Rahul Debnath

Full Stack Developer

GitHub:
https://github.com/RahulDebnath007

📜 License & Disclaimer

This project is intended for portfolio and educational purposes.

Naruto and its characters are trademarks of their respective rights
holders. This is a fan-made software project and is not affiliated
with, sponsored by, or endorsed by the Naruto franchise or its rights
holders.