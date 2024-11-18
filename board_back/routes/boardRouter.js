const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/posts", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;

  const sqlQuery =
    "INSERT INTO board (title, contents, views, weather, publish_date, email, ip_location) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sqlQuery,
    [title, content, 0, "맑음", new Date(), "aaa@aaa.com", "200.200.1.1"],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      } else {
        res.send("Success!!");
      }
    }
  );

  console.log("Request received");
});

// 게시물 리스트 조회
/**
 * @swagger
 * /api/board/posts:
 *   get:
 *     summary: 게시물 리스트 조회
 *     tags:
 *     - API Sample
 *     description: 게시물 전체 리스트를 조회합니다
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/posts", (req, res) => {
  const sqlQuery =
    "SELECT board_id, title, views, publish_date, email FROM board ORDER BY publish_date DESC";
  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    } else {
      if (results.length === 0) {
        return res.status(404).send("No data found");
      }
      res.json(results);
    }
  });

  console.log("Request received");
});

/**
 * @swagger
 * /api/board/posts/{board_id}:
 *   get:
 *     summary: 게시물 상세 조회
 *     tags:
 *     - 게시판 API
 *     description: 게시물 상세 데이터를 조회합니다
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: board_id
 *       in: path
 *       description: 게시물 ID
 *       schema:
 *          type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/posts/:board_id", (req, res) => {
  const board_id = req.params.board_id;
  const sqlQuery = "SELECT * FROM board WHERE board_id = ?";
  db.query(sqlQuery, [board_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    } else {
      if (results.length === 0) {
        return res.status(404).send("No data found");
      }
      res.json(results);
    }
  });

  console.log("Request received");
});

module.exports = router;
