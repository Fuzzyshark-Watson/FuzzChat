Kørsel af programmet
Programmet er stadig under udvikling og findes derfor ikke som en eksekverbar fil. For at køre det skal man navigere til projektets root directory via PowerShell eller en terminal og benytte et af de definerede startup-scripts via npm run.
Nedenfor er de tilgængelige scripts, som er defineret i root package.json:
"scripts": {
  "start:desktop": "cd App/Desktop && npm start",
  "serve:mobile": "cd App/Mobile && npm run serve",
  "build:mobile": "cd App/Mobile && npm run build",
  "lint:mobile": "cd App/Mobile && npm run lint",
  "start:api": "cd API && npm start",
  "start:servers": "concurrently \"cd API && node server.js\" \"cd API && node websocketServer.js\"",
  "start:all": "concurrently \"npm run start:servers\" \"npm run serve:mobile\""
}

For at starte hele udviklingsmiljøet på én gang kan følgende kommando anvendes:
npm run start:all
