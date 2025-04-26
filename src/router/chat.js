const express = require("express");
const router = express.Router();
const db = require("../utility/mysql");

router.post("/send", async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  try {
    const sql =
      "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)";
    
    const [result] = await db.query(sql, [sender_id, receiver_id, message]);

    res.json({ success: true, message_id: result.insertId });
  } catch (err) {
    console.error("Error inserting message:", err);
    res.status(500).json({ error: "Database error" });
  }
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
    console.log(results)
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
