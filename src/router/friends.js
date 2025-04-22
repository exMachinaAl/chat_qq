const express = require("express");
const router = express.Router();
const db = require("../utility/mysql");

router.get("/addfriend", async (req, res) => {
  const { playerQuid, emailQnotelp } = req.query;

  try {
    const sql1 =
      "SELECT qm.QUID, qm.username, qa.email, qa.no_telp from qq_member qm LEFT JOIN qq_member_auth qa on qm.QUID = qa.QUID WHERE email = ? OR no_telp = ? ";
    const [resultsFQ] = await db.query(sql1, [emailQnotelp, ""]);

    // logika untuk filtrasi apakah sudah berteman atau tidak

    const sql2 = "INSERT INTO friend_list (QUID, QUID_friend) VALUES (?, ?)";
    const [resulta] = await db.query(sql2, [playerQuid, resultsFQ[0]?.QUID]);
    // console.log(emailQnotelp)
    res.json({ success: true });
    console.log(resulta);
  } catch (error) {
    console.error(error)
  }
});

module.exports = router;
