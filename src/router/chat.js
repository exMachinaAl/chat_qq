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

router.post("/sendgroup", async (req, res) => {
  const { group_id, sender_id, message } = req.body;

  try {
    const sql =
      "INSERT INTO group_member_message_wa (group_xid, QUID, group_message) VALUES (?,?,?)";

    const [result] = await db.query(sql, [group_id, sender_id, message]);

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
    const [results] = await db.query(sql, [
      sender_id,
      receiver_id,
      receiver_id,
      sender_id,
    ]);
    res.json(results);
    // console.log(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/getgroup", async (req, res) => {
  const { QUID_player } = req.query;
  const sql = `
    SELECT grp.group_xid, grp.group_member_authority, grpd.group_name, qm.username, qm.QUID FROM group_member_data_list_wa grp LEFT JOIN qq_member qm on grp.QUID = qm.QUID
LEFT JOIN group_member_data_wa grpd on grp.group_xid = grpd.group_xid
WHERE qm.QUID = ?;
  `;

  try {
    const [results] = await db.query(sql, [QUID_player]);
    res.json(results);
    // console.log(results[0]);
    // results.forEach(el => {
    //   console.log(el["group_xid"])
    // })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/historygroupwa", async (req, res) => {
  const { group_xid } = req.query;
  const sql = `
    SELECT gwa.group_message, gwa.QUID, gwa.timestamp from group_member_message_wa gwa WHERE group_xid = ?
ORDER BY timestamp ASC;
  `;

  try {
    const [results] = await db.query(sql, [group_xid]);
    res.json(results);
    // console.log(results);
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

router.get("/chatstatus", async (req, res) => {
  const { eventTrigger, received_id } = req.query;

  let sql = "UPDATE messages SET";

  if (eventTrigger === "appOpen") {
    sql += " is_received = ? where receiver_id = ?";
    try {
      const [results] = await db.query(sql, [1, received_id]);
      return res.json(results);
      // console.log(results);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  
  if (eventTrigger === "chatFocus") {
    const { sender_id } = req.query;
    sql += " is_readed = ? where receiver_id = ? and sender_id = ?";
    try {
      const [results] = await db.query(sql, [1, received_id, sender_id]);
      return res.json(results);
      // console.log(results);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
});

module.exports = router;
