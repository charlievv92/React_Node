const express = require("express");
const router = express.Router();
const db = require("../config/db");
const upload = require("../config/multerConfig");

/**
 * @swagger
 * /api/board/posts:
 *   post:
 *     summary: 게시물 작성
 *     tags:
 *     - Board API
 *     description: 새 게시물을 작성합니다
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: OK
 */
router.post("/posts", (req, res) => {
  const title = req.body.title;
  const contents = req.body.contents;

  const sqlQuery =
    "INSERT INTO board (title, contents, views, weather, publish_date, email, ip_location) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sqlQuery,
    [title, contents, 0, "맑음", new Date(), "aaa@aaa.com", "200.200.1.1"],
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

/**
 * @swagger
 * /api/board/posts:
 *   get:
 *     summary: 게시물 리스트 조회
 *     tags:
 *     - Board API
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
 *     - Board API
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

/**
 * @swagger
 * /api/board/posts:
 *   put:
 *     summary: 게시물 데이터 수정
 *     tags:
 *     - Board API
 *     description: 특정 게시물의 데이터를 수정합니다
 *     produces:
 *     - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               board_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.put("/posts", (req, res) => {
  const title = req.body.title;
  const contents = req.body.contents;
  const board_id = req.body.board_id;

  const sqlQuery =
    "UPDATE board SET title = ?, contents = ?, update_date = ? WHERE board_id = ?";
  // "INSERT INTO board (title, contents, views, weather, publish_date, email, ip_location) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sqlQuery, [title, contents, new Date(), board_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    } else {
      res.send("Success!!");
    }
  });
  console.log("Request received");
});

/**
 * @swagger
 * /api/board/comments:
 *   post:
 *     summary: 게시물 댓글 작성
 *     tags:
 *     - Board API
 *     description: 해당 게시물의 댓글을 작성합니다
 *     produces:
 *     - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               writer:
 *                 type: string
 *               comment:
 *                 type: string
 *               board_id:
 *                 type: integer
 *               ip_location:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.post("/comments", (req, res) => {
  const board_id = req.body.board_id;
  const comment = req.body.comment;
  const writer = req.body.writer;
  const ip_location = req.body.ip_location;

  const sqlQuery =
    "INSERT INTO comment (comment, email, board_id, publish_date, ip_location) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sqlQuery,
    [comment, writer, board_id, new Date(), ip_location],
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

/**
 * @swagger
 * /api/board/comments/{board_id}:
 *   get:
 *     summary: 게시물 상세 조회
 *     tags:
 *     - Board API
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
router.get("/comments/:board_id", (req, res) => {
  const board_id = req.params.board_id;
  const sqlQuery =
    "SELECT * FROM comment WHERE board_id = ? ORDER BY publish_date DESC";
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

/**
 * @swagger
 * /api/board/upload-image/{board_id}:
 *   post:
 *     summary: 이미지 업로드
 *     tags:
 *     - Board API
 *     description: 이미지를 업로드합니다
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: OK
 */
router.post("/upload-image/:board_id", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;
