require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env-qq-config"),
});
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const express = require("express");
const app = express();
const http = require("http");
const https = require("https");
const { Server } = require("socket.io");
const session = require("express-session");
const db = require("./utility/mysql");
const path = require("path");
const jwt = require("jsonwebtoken");
const mediasoup = require('mediasoup')
const fs = require('fs')

const chatRoutes = require("./router/chat");
const friendRoutes = require("./router/friends");

const cors = require("cors");
const { json } = require("stream/consumers");

const SECRET = process.env.JWT_SECRET;
const DEFAULT_ROOM = "room"
// const HOST = "localhost";
// const HOST = "0.0.0.0";
// const HOST = "192.168.193.80";
const HOST = "192.168.191.80"; // << tunnel yang bisa dan tlah diuji 1 orang
// const HOST = "192.168.35.218";
// const HOST = "https://buck-well-kingfish.ngrok-free.app";
const PORT = 3000;
// const IPS = "192.168.35.218";
// const IPS = "192.168.193.80";
const IPS = "192.168.191.80"; // << tunnel yang bisa dan tlah diuji 1 orang
// const URL_PRIVATE = "http://localhost:3000"
// const URL_PRIVATE = "https://192.168.35.218:3000";
// const URL_PRIVATE = "https://192.168.193.80:3000";
const URL_PRIVATE = "https://192.168.191.80:3000"; // << tunnel yang bisa dan tlah diuji 1 orang

//memulai untuk setel databse
// const server = http.createServer(app);
const server = https.createServer(
  {
    key: fs.readFileSync("./certs/key.pem"),
    cert: fs.readFileSync("./certs/cert.pem"),
  },
  app
);
const io = new Server(server, {
  cors: {
    origin: "*",
    // methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const rooms = new Map();
let worker;
let router;

(async () => {
  worker = await mediasoup.createWorker();
  router = await worker.createRouter({
    mediaCodecs: [
      {
        kind: "audio",
        mimeType: "audio/opus",
        clockRate: 48000,
        channels: 2,
      },
    ],
  });
})();

const userSockets = {};
let voiceSockets = {}

io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    userSockets[userId] = socket.id;
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("send_message", async (data) => {
    const { sender_id, receiver_id, message } = data;

    // Simpan ke DB
    // db.query(sql, [sender_id, receiver_id, message], (err, result) => {
    //   if (err) return console.error(err);
    fetch(`${URL_PRIVATE}/api/chat/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender_id, receiver_id, message }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          const newMsg = {
            id: data.insertId,
            sender_id,
            receiver_id,
            message,
            timestamp: new Date(),
          };

          // Kirim ke pengirim dan penerima
          const receiverSocket = userSockets[receiver_id];
          const senderSocket = userSockets[sender_id];

          if (senderSocket) io.to(senderSocket).emit("new_message", newMsg);
          if (receiverSocket && receiverSocket !== senderSocket)
            io.to(receiverSocket).emit("new_message", newMsg);
        }
      });

    // });
  });

  // Saat user join group
  socket.on("loadGroupAuth", ({ quid }) => {
    // const members = groupMembers[group];

    fetch(`${URL_PRIVATE}/api/chat/getgroup?QUID_player=${quid}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {

        data.forEach((el) => {
          // console.log("apoa itu el: ", el);
          socket.join(`${DEFAULT_ROOM}${el["group_xid"]}`);
          // console.log("someData: ", el['group_xid'])
          // console.log(`${el} joined ${group}`);
          // userSockets[quid] = { ...group };
        });
        // userSockets[]

        // if (members && members.includes(quid)) {
        // userMap[socket.id] = { quid, group };
        // socket.join(group);
        // socket.emit("joined", `Welcome to group ${group}`);
        // } else {
        //   socket.emit("error", "Access denied to this group");
        // }
      })
      .catch((err) => {
        console.error("ini error di socket gorui[", err);
      });
  });

  // Saat kirim pesan
  socket.on("sendMessageGroup", ({ quid, groupId, message }) => {
    // const user = userMap[socket.id];
    const user = userSockets[quid];
    // console.log("try to use socket send message group")

    fetch(`${URL_PRIVATE}/api/chat/sendgroup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group_id: groupId, sender_id: quid, message }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          // console.log("succes send message grp")
        }
      })
      .catch(err => {
        console.error("something in line 129: ", err)
      })

    if (user) {
      const dataMSG = {
        from: quid,
        message,
        timestamp: new Date(),
      }
      io.to((DEFAULT_ROOM+groupId)).emit("receiveMessage", dataMSG);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // remove user from userSockets
    // if
    for (const uid in userSockets) {
      if (userSockets[uid] === socket.id) {
        delete userSockets[uid];
        break;
      }
    }

    cleanUpSocket(socket);
  });


  socket.on("voice_setParticipant", ({ playerName, playerId, roomId }) => {
    if(!voiceSockets[roomId]){
      voiceSockets[roomId] = {};
    }
    if(!voiceSockets[roomId][playerId]){
      voiceSockets[roomId][playerId] = { socketId: socket.id, playerName, roomId};
    }
    
    socket.join(roomId)
    io.to(roomId).emit('userInRVC', voiceSockets[roomId])
  })
  socket.on("voice_getAllParticipant", ({ roomId }) => {
    io.to(roomId).emit('userInRVC', voiceSockets[roomId])
  })
  socket.on('voice_removeParticipant', ({ roomId, playerId }) => {
    delete voiceSockets[roomId][playerId]

    io.to(roomId).emit("userInRVC", voiceSockets[roomId]);
  })



  //critical code
  socket.on("joinRoom", ({ roomId }, callback) => {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        producers: new Map(),
        consumers: new Map(),
        transports: new Map()
      });
    }

    socket.join(roomId);
    socket.data.roomId = roomId;

    console.log(`Socket ${socket.id} joined room ${roomId}`);
    callback({ joined: true });
  });

  socket.on("getRtpCapabilities", (data, callback) => {
    callback(router.rtpCapabilities);
  });

  socket.on("createProducerTransport", async (_, callback) => {
    const transport = await router.createWebRtcTransport({
      listenIps: [{ ip: IPS, announcedIp: null }],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });

    const roomchk = getRoom(socket);
    if (!roomchk) {
      console.warn("Room tidak ditemukan untuk socket ini.");
      return; // atau callback({ error: 'Room not found' });
    }


    getRoom(socket).transports.set(`${socket.id}_producer`, transport);
    callback({
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters
    });
  });

  socket.on("connectProducerTransport", async ({ dtlsParameters }, callback) => {
    const roomchk = getRoom(socket);
    if (!roomchk) {
      console.warn("Room tidak ditemukan untuk socket ini.");
      return; // atau callback({ error: 'Room not found' });
    }
    const transport = getRoom(socket).transports.get(`${socket.id}_producer`);
    await transport.connect({ dtlsParameters });
    callback();
  });

  socket.on("produce", async ({ kind, rtpParameters }, callback) => {
    const roomchk = getRoom(socket);
    if (!roomchk) {
      console.warn("Room tidak ditemukan untuk socket ini.");
      return; // atau callback({ error: 'Room not found' });
    }
    const transport = getRoom(socket).transports.get(`${socket.id}_producer`);
    const producer = await transport.produce({ kind, rtpParameters });

    getRoom(socket).producers.set(socket.id, producer);
    socket.broadcast.emit("new-producer", { producerId: producer.id });
    callback({ id: producer.id });
  });

  socket.on("createConsumerTransport", async (_, callback) => {
    const roomchk = getRoom(socket);
    if (!roomchk) {
      console.warn("Room tidak ditemukan untuk socket ini.");
      return; // atau callback({ error: 'Room not found' });
    }
    const transport = await router.createWebRtcTransport({
      listenIps: [{ ip: IPS, announcedIp: null }],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });

    getRoom(socket).transports.set(`${socket.id}_consumer`, transport);
    callback({
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters
    });
  });

  socket.on("connectConsumerTransport", async ({ dtlsParameters }, callback) => {
    const roomchk = getRoom(socket);
    if (!roomchk) {
      console.warn("Room tidak ditemukan untuk socket ini.");
      return; // atau callback({ error: 'Room not found' });
    }
    const transport = getRoom(socket).transports.get(`${socket.id}_consumer`);
    await transport.connect({ dtlsParameters });
    callback();
  });

  socket.on("getProducers", (_, callback) => {
    const roomchk = getRoom(socket);
    if (!roomchk) {
      console.warn("Room tidak ditemukan untuk socket ini.");
      return; // atau callback({ error: 'Room not found' });
    }
    const allProducers = Array.from(getRoom(socket).producers.entries())
      .filter(([id]) => id !== socket.id)
      .map(([id, producer]) => producer.id);

    callback(allProducers);
  });

  socket.on("consume", async ({ producerId, rtpCapabilities }, callback) => {
    const roomchk = getRoom(socket);
    if (!roomchk) {
      console.warn("Room tidak ditemukan untuk socket ini.");
      return; // atau callback({ error: 'Room not found' });
    }
    const producerEntry = Array.from(getRoom(socket).producers.values()).find(p => p.id === producerId);
    const transport = getRoom(socket).transports.get(`${socket.id}_consumer`);

    if (!router.canConsume({ producerId, rtpCapabilities })) {
      return callback({ error: "Cannot consume" });
    }

    const consumer = await transport.consume({
      producerId,
      rtpCapabilities,
      paused: false
    });

    getRoom(socket).consumers.set(`${socket.id}_${producerId}`, consumer);

    callback({
      id: consumer.id,
      producerId,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters
    });
  });

  socket.on("resume", async (_, callback) => {
    const roomchk = getRoom(socket);
    if (!roomchk) {
      console.warn("Room tidak ditemukan untuk socket ini.");
      return; // atau callback({ error: 'Room not found' });
    }
    const room = getRoom(socket);
    for (const [key, consumer] of room.consumers.entries()) {
      if (key.startsWith(socket.id)) {
        await consumer.resume();
      }
    }
    if (callback) callback();
  });

  socket.on("leaveRoom", () => {
    cleanUpSocket(socket);
    socket.leave(socket.data.roomId);
    socket.data.roomId = null;
  });

  // socket.on("disconnect", () => {
  //   cleanUpSocket(socket);
  //   console.log("Disconnected:", socket.id);
  // });

  function getRoom(socket) {
    const roomId = socket.data.roomId;
    return rooms.get(roomId);
  }

  function cleanUpSocket(socket) {
    const room = getRoom(socket);
    if (!room) return;

    room.producers.delete(socket.id);
    for (const key of room.consumers.keys()) {
      if (key.startsWith(socket.id)) room.consumers.delete(key);
    }

    for (const key of room.transports.keys()) {
      if (key.startsWith(socket.id)) {
        room.transports.get(key).close();
        room.transports.delete(key);
      }
    }

    // Jika room kosong, hapus
    if (
      room.producers.size === 0 &&
      room.consumers.size === 0 &&
      room.transports.size === 0
    ) {
      rooms.delete(socket.data.roomId);
    }
  }


});

// chat logic
app.use("/api/chat", chatRoutes);

// friend logic
app.use("/api/friend", friendRoutes);
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
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // ambil token setelah "Bearer"

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // token tidak valid

    req.user = user; // tempelkan info user di request
    //   console.log(req.user)
    next();
  });
}

app.get("/api/authentication", authenticationToken, (req, res) => {
  res.json({ loggedIn: true });
});

app.get("/api/friends/:playerId", authenticationToken, async (req, res) => {
  const userId = req.params.playerId;
  const [playerFriends] = await db.query(
    "SELECT fr.QUID_friend, qm.username FROM friend_list fr left JOIN qq_member qm on fr.QUID_friend = qm.QUID WHERE fr.QUID = ?",
    [userId]
  );
  // console.log("helly: ", playerFriends)
  // res.json(playerFriends)
  res.json({ message: "yokoso to qq_chat", loggedIn: true, playerFriends });
});

app.delete("/api/logout", (req, res) => {
  res.json({ message: "data deleted" });
});

app.post("/api/register", async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.json({ message: "Semua field wajib diisi." });
  }

  // Regex sederhana
  const isEmail = user.includes("@");
  const isPhone = /^\d+$/.test(user);

  if (isEmail) {
    // untuk mendapatakan OUT dari procedure
    const [status] = await db.query("call check_usedable_email(?, @dataOut)", [
      user,
    ]);
    const [statuslvl] = await db.query("select @dataOut as data");

    console.log(statuslvl[0]?.data);
    if (statuslvl[0]?.data == 0) {
      return res.json({
        message: "email atau nomor sudah digunakan",
        status: false,
      });
    }

    const [resultH] = await db.query("call app_registration(?,?,?)", [
      1,
      user,
      password,
    ]);
    return res.json({ message: "pendaftaran berhasil", status: true });
  }

  // let sqlN = `INSERT INTO`

  // if (isEmail) { // tolong data dimasukkan ke database
  //   console.log("Input adalah email:", user);
  //   const [rest] = await db.query()
  //   // Simpan ke database atau proses lain
  //   return res.json({ message: "Registrasi berhasil dengan email!" });
  // }

  if (isPhone) {
    console.log("Input adalah nomor telepon:", user);
    return res.json({ message: "Registrasi berhasil dengan nomor!" });
  }

  res.json({
    message: "anda seharusnya memasukkan email atau nomor-telepon",
    status: false,
  });

  // return res.json({ message: "Format tidak valid. Masukkan email atau nomor telepon." });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query(
    "SELECT qm.QUID, qm.username, qma.email, qma.password FROM qq_member qm left JOIN qq_member_auth qma on qm.QUID = qma.QUID WHERE email = ? AND password = ?",
    [username, password]
  );

  if (rows.length > 0) {
    const user = rows[0];
    const token = jwt.sign({ id: user.QUID, name: user.username }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, QUID: user.QUID, username: user.username });
  } else {
    res.status(401).json({ error: "Login gagal" });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
