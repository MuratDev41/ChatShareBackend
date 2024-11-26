const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 6969 });

const clients = new Map();

wss.on('connection', (ws) => {
  let serverId = null;

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'register') {
      serverId = data.serverId;
      clients.set(serverId, ws);
    } else if (data.type === 'chat') {
      clients.forEach((client) => {
        if (client !== ws) {
          client.send(JSON.stringify(data));
        }
      });
    } else if (data.type === 'player_list') {
      clients.forEach((client) => {
        if (client !== ws) {
          client.send(JSON.stringify(data));
        }
      });
    }
  });

  ws.on('close', () => {
    if (serverId) {
      clients.delete(serverId);
    }
  });
});

console.log('Backend WebSocket server running on ws://localhost:6868');
