# CODEWORDS
  - See our [**live deployment here**](https://be-codewords.herokuapp.com/)
  - **Tech Stack**
    - Frontend: React, Material UI
    - Backend: Node, Express, MongoDB, JWT
  - **Team**
    - [Aecio Cavalcanti](https://github.com/aeciorc) (Team Lead)
    - [Haruka Izumichi](https://github.com/haruka-izm)
    - [Bhargava Guntoori](https://github.com/Flaagrah)
    - [Pavel Machuca](https://github.com/pavel6767/)
  - **About the game**
    - Check the rules at this [wikipedia article](<https://en.wikipedia.org/wiki/Codenames_(board_game)>)
  - **Install locally**
    - Both frontend and backend are in this repository, and have to be running
    - From root folder
      - Frontend:
        - `cd client`
        - `npm install`
      - Backend:
        - `cd server`
        - `npm install`
  - **Running locally**
    - Run the frontend client:
      - `npm run start`
    - Run the server:
      - `npm run dev`
## Game features
**login or signup**

![login](https://res.cloudinary.com/a-node/image/upload/v1588200816/codingwords/cw-login.png?raw=true "Optional Title")

**Starting a game, you can:**
  - start a public game (anyone clicking on 'join random' can join)
  - start a private game (players can only join if they have the game id)
  - Join a random game (any public)
  - Join a private game (only with game id)

![welcome screen](https://res.cloudinary.com/a-node/image/upload/v1588201201/codingwords/cw-welcome.png?raw=true "Optional Title")

**You're able to pick from 4 roles in the game**

![waiting room](https://res.cloudinary.com/a-node/image/upload/v1588201201/codingwords/cw-waiting_room.png?raw=true "Optional Title")

**Once 4 roles are picked, everyone is lead to the game view**
  - Field agents can chat in the chatbox, their messages are in grey

![field view](https://res.cloudinary.com/a-node/image/upload/v1588201201/codingwords/cw-gameplay.png?raw=true "Optional Title")

**Spies can see the values that each card holds**
  - They can enter their clue in the chatbox

![spy view](https://res.cloudinary.com/a-node/image/upload/v1588201535/codingwords/cw-spy_view.png "Optional Title")

**Once settled, the match outcome is saved to the database**
```
{
  "_id": {match.id},
  "date": {date},
  "blueScore": {match.blueScore},
  "redScore": {match.redScore},
  "winner": {match.winner},
  "participants": [
    {
      "_id": {internal.id},
      "user": {user.id},
      "role": {match.RedSpy}
    },
    {
      "_id": {internal.id},
      "user": {user.id},
      "role": {match.RedFieldAgent}
    },
    {
      "_id": {internal.id},
      "user": {user.id},
      "role": {match.BlueSpy}
    },
    {
      "_id": {internal.id},
      "user": {user.id},
      "role": {match.BlueFieldAgent}
    }
  ],
  "__v": 0
}
```
