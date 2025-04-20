const express = require("express");
const router = express.Router();
const db = require("../utility/mysql");

router.post("send", (req, res) => {
  const { sender_id, receiver_id, message } = req.body;
  const sql =
    "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)";
  db.query(sql, [sender_id, receiver_id, message], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, message_id: result.insertId });
  });
});

// Ambil riwayat pesan antar 2 user
router.get("/history", async (req, res) => {
  const { sender_id, receiver_id } = req.query;
  const sql = `
    SELECT * FROM messages 
    WHERE (sender_id = ? AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = ?) 
    ORDER BY timestamp ASC
  `;

  try {
    const [results] = await db.query(sql, [sender_id, receiver_id, receiver_id, sender_id]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//   function queryAsync(sql, values) {
//     return new Promise((resolve, reject) => {
//       db.query(sql, values, (err, results) => {
//         if (err) return reject(err);
//         resolve(results);
//       });
//     });
//   }
  
  

module.exports = router;
