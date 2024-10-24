const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Function to shuffle an array using the Fisher-Yates algorithm
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Define rotation values
const ascendingValues = Array.from({ length: 12 }, (_, i) => i * 10); // [0, 10, 20, ..., 110]
const descendingValues = [...ascendingValues].reverse(); // [110, 100, ..., 0]

// Initial state
let currentValues = shuffle(ascendingValues);
let currentIndex = 0;
let direction = 'ascending'; // Initial direction

let clients = [];

wss.on('connection', (ws) => {
  // Add new client to the clients array
  clients.push(ws);

  // Handle client disconnection
  ws.on('close', () => {
    clients = clients.filter(client => client !== ws); // Cleanup disconnected clients
    clearInterval(ws.intervalId); // Cleanup interval on connection close
  });

  // Handle WebSocket errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  // Send rotation values in sequence to all clients every second
  ws.intervalId = setInterval(() => {
    const rotationSpeed = currentValues[currentIndex];
    console.log(rotationSpeed);

    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(JSON.stringify({ rotationSpeed }));
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    });

    // Update the index and direction
    if (direction === 'ascending') {
      if (currentIndex === currentValues.length - 1) {
        direction = 'descending';
        currentValues = shuffle(descendingValues);
        currentIndex = 0; // Reset index for new sequence
      } else {
        currentIndex++;
      }
    } else {
      if (currentIndex === currentValues.length - 1) {
        direction = 'ascending';
        currentValues = shuffle(ascendingValues);
        currentIndex = 0; // Reset index for new sequence
      } else {
        currentIndex++;
      }
    }
  }, 1000);
});

// Handle server errors
wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});
