# Blood on the Clocktower companion app

Companion app for the game Blood on the Clocktower that is meant for augmenting live games as an audiovisual aid and immersion enhancement for the players.

The app is meant to be shown on a big screen and a second device (mobile phone) is used by the storyteller to control events.

### Prerequisites

- Node.js
- npm

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm start
```

The app will be running at `http://localhost:5173`

It will automatically generate a six-string game ID for you, eg. `http://localhost:5173/abcdef`

Use mobile phone connected to the same network. Terminal will show
the correct IP address to connect to. For example:

`192.168.1.100:5173/abcdef`

To use a persistent database, run:

```bash
docker-compose up -d
USE_DATABASE=true npm start
```

## Authors

Jussi Saurio - [Github](https://github.com/jussisaurio)

Mikko McMenamin - [Github](https://github.com/mikkomcmenamin)

## License

This project is licensed under the MIT License
