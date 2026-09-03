const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const { Server } = require('socket.io');
const http = require('http');

// Create a basic HTTP server for Socket.io
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Since the chromium download failed, we instruct Puppeteer to use the user's installed Google Chrome.
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
  puppeteer: {
    executablePath: chromePath, // Use local Chrome to bypass download errors
    headless: true, // Run in background
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run'
    ]
  }
});

let currentQR = null;
let clientStatus = 'LOADING'; // LOADING, WAITING_FOR_SCAN, CONNECTED

client.on('qr', (qr) => {
  console.log('REAL QR RECEIVED from WhatsApp', qr);
  clientStatus = 'WAITING_FOR_SCAN';
  
  // Generate Data URL for QR Code
  qrcode.toDataURL(qr, (err, url) => {
    if (!err) {
      currentQR = url;
      io.emit('qr_update', url);
    }
  });
});

client.on('ready', async () => {
  console.log('REAL WhatsApp Client is ready!');
  clientStatus = 'CONNECTED';
  currentQR = null;
  io.emit('status_update', clientStatus);
});

client.on('message', async (msg) => {
  console.log('MESSAGE RECEIVED', msg.from, msg.body);
  
  // Format the sender phone number
  const senderPhone = msg.from.split('@')[0];
  
  // Create message payload
  const messagePayload = {
    id: msg.id.id || Date.now().toString(),
    lead_id: senderPhone, // Using phone as temp ID for frontend demo
    direction: 'INBOUND',
    message_text: msg.body,
    timestamp: new Date().toISOString(),
    status: 'DELIVERED',
    contact: {
      name: msg._data.notifyName || senderPhone,
      phone: senderPhone
    }
  };

  // Emit to all connected frontend clients
  io.emit('new_message', messagePayload);

  // Basic AI Auto Reply Simulation directly on WhatsApp
  if (msg.body.toLowerCase().includes('hi') || msg.body.toLowerCase().includes('hello') || msg.body.toLowerCase().includes('help')) {
    setTimeout(async () => {
      const replyText = 'Hello! I am the Sales AI Assistant from MarketingPro CRM. How can I help you today?';
      await msg.reply(replyText);
      
      const aiReplyPayload = {
        id: Date.now().toString(),
        lead_id: senderPhone,
        direction: 'OUTBOUND',
        message_text: replyText,
        timestamp: new Date().toISOString(),
        status: 'SENT',
        contact: {
          name: 'AI Bot',
          phone: senderPhone
        }
      };
      
      io.emit('new_message', aiReplyPayload);
    }, 2000); // 2 second delay to feel human
  }
});

client.on('disconnected', (reason) => {
  console.log('Client was logged out', reason);
  clientStatus = 'DISCONNECTED';
  io.emit('status_update', clientStatus);
  client.initialize(); // Restart
});

// Socket connection for frontend
io.on('connection', (socket) => {
  console.log('Frontend connected to Socket');
  socket.emit('status_update', clientStatus);
  if (currentQR) {
    socket.emit('qr_update', currentQR);
  }

  // Listen for outgoing messages from the CRM UI
  socket.on('send_message', async (data) => {
    console.log('Sending message to:', data.phone, data.text);
    try {
      const formattedPhone = `${data.phone}@c.us`; // WhatsApp format
      await client.sendMessage(formattedPhone, data.text);
      
      // Emit back so UI updates
      const outgoingPayload = {
        id: Date.now().toString(),
        lead_id: data.phone,
        direction: 'OUTBOUND',
        message_text: data.text,
        timestamp: new Date().toISOString(),
        status: 'SENT',
        contact: {
          name: 'Me',
          phone: data.phone
        }
      };
      io.emit('new_message', outgoingPayload);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  });
});

// Start things up
const PORT = 3005;
server.listen(PORT, () => {
  console.log(`WhatsApp REAL Socket Service running on port ${PORT}`);
  console.log('Attempting to launch Chrome from:', chromePath);
  client.initialize().catch((err) => {
    console.log('WhatsApp Client initialization note:', err.message);
  });
});
