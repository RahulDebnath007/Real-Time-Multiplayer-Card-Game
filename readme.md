Naruto Card Battle ⚔️

A real-time multiplayer Naruto-inspired card battle game built with
React, TypeScript, Node.js, Express, WebSockets, and Redis.

Features

Real-time 1v1 multiplayer battles

WebSocket-based communication

Matchmaking queue

Server-authoritative game state

Real-time state synchronization

Attack and defense card mechanics

HP, energy, and shield systems

Win/loss detection

Responsive desktop and mobile UI

Battle audio/music

Production deployment with Vercel and Render

Redis-backed matchmaking/game infrastructure

Tech Stack

Frontend

React

TypeScript

Vite

Tailwind CSS

WebSocket API

Backend

Node.js

TypeScript

Express

ws

Redis

UUID

Deployment

Frontend: Vercel

Backend: Render

Redis/Valkey: Render

Architecture

React + Vite (Vercel)
        |
        | Secure WebSocket (WSS)
        v
Node.js + Express + WebSocket (Render)
        |
        v
Redis / Valkey
        |
        v
Matchmaking + Game State

Project Structure

Real-Time-Multiplayer-Card-Game/
├── client/
│   ├── public/
│   │   ├── audio/
│   │   ├── characters/
│   │   └── ...
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
│   └── package.json
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
│   └── package.json
├── shared/
├── docker-compose.yml
└── .gitignore

How It Works

1. Character Selection

A player selects a shinobi before entering matchmaking.

2. Matchmaking

The client sends a WebSocket request:

{
  "type": "JOIN_QUEUE",
  "characterId": "naruto"
}

The backend places the player in the matchmaking queue. When another
player is available, a game is created.

3. Game Creation

Both players receive MATCH_FOUND and GAME_STARTED messages
containing the game information and initial state.

4. Playing Cards

A card action is sent through WebSocket:

{
  "type": "PLAY_CARD",
  "gameId": "game-id",
  "cardId": "rasengan"
}

The backend validates and executes the action, then sends the resulting
game state to both players.

5. State Synchronization

Successful actions produce:

GAME_STATE_UPDATED

The backend remains responsible for the authoritative game state.

6. Game Over

When the game reaches a winning condition, both players receive a
GAME_OVER message with the appropriate result.

WebSocket Messages

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

Backend Architecture

The backend uses a modular server architecture:

server/src/
├── cards/          # Card definitions
├── characters/     # Character definitions
├── game/           # Game logic and actions
├── matchmaking/    # Matchmaking service
├── players/        # Connected player management
├── redis/          # Redis connection
├── websocket/      # WebSocket handling
└── server.ts       # HTTP/WebSocket server

The project currently uses a modular backend, not a true microservices
architecture.

Local Development

Prerequisites

Node.js

npm

Redis

Clone

git clone https://github.com/RahulDebnath007/Real-Time-Multiplayer-Card-Game.git
cd Real-Time-Multiplayer-Card-Game

Start Backend

cd server
npm install
npm run dev

Local HTTP/WebSocket server:

http://localhost:3000
ws://localhost:3000

Start Frontend

Open another terminal:

cd client
npm install
npm run dev

Environment Variables

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

Deployment

Vercel Frontend

The Vercel project uses:

Framework: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist

Production environment variable:

VITE_WS_URL=wss://real-time-multiplayer-card-game.onrender.com

Render Backend

Root directory:

server

Build command:

npm install && npm run build

Start command:

npm start

The server uses the PORT environment variable supplied by Render.

Redis

The backend connects to the production Redis/Valkey instance through:

REDIS_URL=...

Production Verification

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

Security and Future Hardening

The backend executes game actions server-side rather than trusting
client-calculated results.

Future hardening should include:

Authentication

Strong input validation

Rate limiting

WebSocket reconnection

Disconnect handling

Race-condition protection

Per-game authorization

Persistent match history

Structured logging and monitoring

Future Improvements

Player authentication

Leaderboards and rankings

Persistent match history

Automatic WebSocket reconnection

Stronger concurrency handling

Rate limiting

Player profiles

Ranked matchmaking

More characters and cards

Additional battle effects and animations

Dedicated microservices architecture if scaling requires it

Project Status

Component                            Status

React frontend                       ✅
TypeScript                           ✅
Responsive UI                        ✅
WebSockets                           ✅
Real-time synchronization            ✅
Matchmaking                          ✅
Server-authoritative game logic      ✅
Redis                                ✅
Multiplayer gameplay                 ✅
Vercel deployment                    ✅
Render deployment                    ✅
Production Redis/Valkey              ✅
Microservices architecture           ❌
Authentication                       🚧
Advanced race-condition protection   🚧

Author

Rahul Debnath

Full Stack Developer

GitHub: https://github.com/RahulDebnath007

License

This project is intended as a portfolio/educational project.

Naruto and its characters are trademarks of their respective rights
holders. This is a fan-made software project and is not affiliated with
or endorsed by the Naruto franchise or its rights holders.