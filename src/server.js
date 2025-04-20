require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env-qq-config"),
});
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io")
const session = require("express-session");
const db = require("./utility/mysql");
const path = require("path");
const jwt = require("jsonwebtoken");
const chatRoutes = require('./router/chat')
const cors = require('cors');

const SECRET = process.env.JWT_SECRET;

//memulai untuk setel databse
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    // methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors())
app.use(express.static("hendra"));

const userSockets = {};
io.on('connection', (socket) => {

  socket.on('register', (userId) => {
    userSockets[userId] = socket.id;
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on('send_message', async (data) => {
    const { sender_id, receiver_id, message } = data;

    // Simpan ke DB
    const sql = 'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)';
    db.query(sql, [sender_id, receiver_id, message], (err, result) => {
      if (err) return console.error(err);

      const newMsg = {
        id: result.insertId,
        sender_id,
        receiver_id,
        message,
        timestamp: new Date()
      };

      // Kirim ke pengirim dan penerima
      const receiverSocket = userSockets[receiver_id];
      const senderSocket = userSockets[sender_id];

      if (senderSocket) io.to(senderSocket).emit('new_message', newMsg);
      if (receiverSocket && receiverSocket !== senderSocket) io.to(receiverSocket).emit('new_message', newMsg);
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // remove user from userSockets
    // if
    for (const uid in userSockets) {
      if (userSockets[uid] === socket.id) {
        delete userSockets[uid];
        break;
      }
    }
  });
})


// chat logic
app.use('/api/chat', chatRoutes);
// app.get("/api/chat/history/:sender_id/:receiver_id", async (req, res) => {
//   const { sender_id, receiver_id } = req.params;
//   const sql = `
//     SELECT * FROM messages 
//     WHERE (sender_id = ? AND receiver_id = ?) 
//        OR (sender_id = ? AND receiver_id = ?) 
//     ORDER BY timestamp ASC
//   `;
//   await db.query(
//     sql,
//     [sender_id, receiver_id, receiver_id, sender_id],
//     (err, results) => {
//       if (err) return res.status(500).json({ error: err });
//       res.json(results);
//     }
//   );
// });


function authenticationToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // ambil token setelah "Bearer"
  
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // token tidak valid
  
      req.user = user; // tempelkan info user di request
    //   console.log(req.user)
      next();
    });
}
  
app.get('/api/authentication', authenticationToken, (req, res) => {
  res.json({ loggedIn: true })
})

app.get('/api/friends/:playerId', authenticationToken, async (req, res) => {
    const userId = req.params.playerId;
    const [playerFriends] = await db.query('SELECT fr.QUID_friend, qm.username FROM friend_list fr left JOIN qq_member qm on fr.QUID_friend = qm.QUID WHERE fr.QUID = ?', [userId],)
    // console.log("helly: ", playerFriends)
    // res.json(playerFriends)
    res.json({ message: "yokoso to qq_chat", loggedIn: true, playerFriends })
})

app.delete('/api/logout', (req, res) => {
    res.json({ message: "data deleted" })
})

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const [rows] = await db.query('SELECT qm.QUID, qm.username, qma.email, qma.password FROM qq_member qm left JOIN qq_member_auth qma on qm.QUID = qma.QUID WHERE email = ? AND password = ?', [username, password]);
  
    if (rows.length > 0) {
      const user = rows[0];
      const token = jwt.sign({ id: user.QUID, name: user.username }, SECRET, { expiresIn: '1h' });
      res.json({ token, QUID: user.QUID, username: user.username });
    } else {
      res.status(401).json({ error: 'Login gagal' });
    }
});


server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
