require('dotenv').config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("FATAL ERROR: Supabase environment variables are not defined.");
  process.exit(1);
}

console.log("Environment Supabase variables loaded.");

const http = require('http');
const { Server } = require('socket.io');
const supabase = require('./src/config/supabase');
const seedDatabase = require('./src/utils/seedData');
const app = require('./src/index');

const port = process.env.PORT || 5000;

console.log('--- STARTUP LOGS ---');
console.log('Supabase URL detected?', !!process.env.SUPABASE_URL);
console.log('Supabase Service Role Key detected?', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

let dataSource = 'local_db.json';
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  dataSource = 'Supabase';
  // verify connection by making a dummy query
  supabase.from('products').select('id').limit(1)
    .then(({ error }) => {
      console.log('Supabase connection successful?', !error);
      if (error) console.error('Supabase connection error:', error.message);
    })
    .catch(err => {
      console.log('Supabase connection successful?', false);
    });
}
console.log('Data source currently used:', dataSource);
console.log('--------------------');

const server = http.createServer(app);
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  process.env.RENDER_EXTERNAL_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  'https://artisan-connect-frontend.vercel.app',
  'https://artisan-connect-backend-db2z.onrender.com',
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  // eslint-disable-next-line no-console
  console.log('A user connected via socket:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    // eslint-disable-next-line no-console
    console.log(`User ${userId} joined room`);
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { senderId, receiverId, text, id, _id } = data;

      if (!senderId || !receiverId || (!text?.trim() && !id && !_id)) {
        console.warn('Invalid message data received:', data);
        return socket.emit('messageError', { error: 'Invalid message data' });
      }

      if (senderId.toString() === receiverId.toString()) {
        return socket.emit('messageError', { error: 'Cannot send message to yourself' });
      }

      let mappedMessage;

      if (id || _id) {
        // Message already saved via API, just broadcast it
        mappedMessage = {
          ...data,
          _id: _id || id,
          id: id || _id
        };
      } else {
        // Save to database
        const { data: message, error } = await supabase
          .from('messages')
          .insert({
            sender_id: senderId.toString(),
            receiver_id: receiverId.toString(),
            text: text.trim(),
            seen: false
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }

        mappedMessage = {
          _id: message.id,
          id: message.id,
          senderId: message.sender_id,
          receiverId: message.receiver_id,
          text: message.text,
          seen: message.seen,
          createdAt: message.created_at
        };
      }

      console.log(`Broadcasting message from ${senderId} to ${receiverId}`);
      io.to(receiverId.toString()).emit('receiveMessage', mappedMessage);
      // Optional: Emit to sender too if they have multiple tabs
      socket.broadcast.to(senderId.toString()).emit('receiveMessage', mappedMessage);
    } catch (error) {
      console.error('Socket send message error:', error);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    // eslint-disable-next-line no-console
    console.log('User disconnected socket:', socket.id);
  });
});

// Init and Seed
(async () => {
  try {
    await seedDatabase();
    server.listen(port, '0.0.0.0', () => {
      // eslint-disable-next-line no-console
      console.log(`Backend server running on http://127.0.0.1:${port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start backend:', error);
    process.exit(1);
  }
})();
