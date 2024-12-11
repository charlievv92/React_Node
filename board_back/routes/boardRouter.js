const express = require("express");
const router = express.Router();
const {
  queryAsync,
  create,
  read,
  update,
  remove,
} = require("../utils/dbUtils");
const upload = require("../config/multerConfig");

// 비동기 처리를 위한 함수
// const queryAsync = (sql, params) => {
//   return new Promise((resolve, reject) => {
//     db.query(sql, params, (err, result) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve(result);
//     });
//   });
// };

/**
 * @swagger
 * /api/board/posts:
 *   post:
 *     summary: 게시물 작성
 *     tags:
 *     - Board API
 *     description: 새 게시물을 작성합니다
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시물 제목
 *               contents:
 *                 type: string
 *                 description: 게시물 내용
 *               writer:
 *                 type: string
 *                 description: 작성자 이메일
 *               ip_location:
 *                 type: string
 *                 description: 작성자 IP 주소
 *     responses:
 *       200:
 *        description: Successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: integer
 *                data:
 *                  type: object
 *                msg:
 *                  type: string
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/posts", async (req, res) => {
  // const title = req.body.title;
  // const contents = req.body.contents;
  // const email = req.body.writer;
  // const ip_location = req.body.ip_location;
  console.log("Request received");

  const { title, contents, writer, ip_location } = req.body; //구조분해할당

  if (!title || !contents) {
    return res.status(400).send({
      code: 400,
      message: "Invalid input: Title and contents are required.",
    });
  }

  if (!writer || !ip_location) {
    return res.status(400).send({
      code: 400,
      message: "Invalid input: Email and IP location are required.",
    });
  }

  try {
    await create("board", {
      title,
      contents,
      views: 0,
      weather: "맑음",
      publish_date: new Date(),
      email: writer,
      ip_location,
    });
    res
      .status(200)
      .json({ code: 200, message: "게시물이 성공적으로 작성되었습니다" });
  } catch (error) {
    console.error(err);
    res.status(500).json({ code: 500, msg: "Server Error" });
  }
  // const sqlQuery =
  //   "INSERT INTO board (title, contents, views, weather, publish_date, email, ip_location) VALUES (?, ?, ?, ?, ?, ?, ?)";
  // db.query(
  //   sqlQuery,
  //   [title, contents, 0, "맑음", new Date(), email, ip_location],
  //   (err, result) => {
  //     if (err) {
  //       console.error(err);
  //       return res.status(500).send(err);
  //     } else {
  //       res.send("Success!!");
  //     }
  //   }
  // );
});

/**
 * @swagger
 * /api/board/posts:
 *   get:
 *     summary: 게시물 목록 조회
 *     tags:
 *     - Board API
 *     description: 게시물 목록을 조회합니다
 *     produces: application/json
 *     responses:
 *       200:
 *         description: Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       board_id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       contents:
 *                         type: string
 *                       views:
 *                         type: integer
 *                       is_deleted:
 *                         type: boolean
 *                       publish_date:
 *                         type: string
 *                         format: date-time
 *                       email:
 *                         type: string
 *                       update_date:
 *                         type: string
 *                         format: date-time
 *                 msg:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
router.get("/posts", async (req, res) => {
  console.log("Request received");
  try {
    const table = "board";
    const columns = [
      "board_id",
      "title",
      "views",
      "publish_date",
      "email",
      "is_deleted",
    ];
    const conditions = { is_deleted: false };
    const orderBy = "publish_date DESC";
    const result = await read(table, columns, conditions, orderBy);

    if (result.length === 0) {
      return res.status(404).send("Not Found");
    }
    res.status(200).json({ code: 200, data: result, msg: "Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }

  // const sqlQuery =
  //   "SELECT board_id, title, views, publish_date, email, is_deleted FROM board ORDER BY publish_date DESC";
  // db.query(sqlQuery, (err, results) => {
  //   if (err) {
  //     console.error(err);
  //     return res.status(500).send(err);
  //   } else {
  //     if (results.length === 0) {
  //       return res.status(404).send("No data found");
  //     }
  //     res.json(results);
  //   }
  // });
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
 *      200:
 *        description: Successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: integer
 *                data:
 *                  type: object
 *                  properties:
 *                    board_id:
 *                      type: integer
 *                    title:
 *                      type: string
 *                    contents:
 *                      type: string
 *                    views:
 *                      type: integer
 *                    weather:
 *                      type: string
 *                    publish_date:
 *                      type: string
 *                    email:
 *                      type: string
 *                    ip_location:
 *                      type: string
 *                    update_date:
 *                      type: string
 *                msg:
 *                  type: string
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get("/posts/:board_id", async (req, res) => {
  console.log("Request received");

  const { board_id } = req.params;
  const getPostQuery = "SELECT * FROM board WHERE board_id = ?";
  const incrementViewsQuery =
    "UPDATE board SET views = views + 1 WHERE board_id = ?";

  try {
    if (!board_id) {
      return res
        .status(400)
        .json({ code: 400, msg: "Bad Request: Missing id" });
    }
    // 조회수 증가
    const incrementResult = await queryAsync(incrementViewsQuery, [board_id]);
    if (incrementResult.affectedRows === 0) {
      return res
        .status(404)
        .json({ code: 404, msg: "Not Found: No post with the given id" });
    }

    // 게시물 상세 정보 조회
    const post = await queryAsync(getPostQuery, [board_id]);
    if (post.length === 0) {
      return res
        .status(404)
        .json({ code: 404, msg: "Not Found: No post with the given id" });
    }
    //response.data.data[0] = [{board_id: 0, title: "hi"}]
    res.status(200).json({ code: 200, data: post });
  } catch (error) {
    console.error(err);
    res.status(500).json({ code: 500, msg: "Server Error" });
  }
  // db.query(sqlQuery, [board_id], (err, results) => {
  //   if (err) {
  //     console.error(err);
  //     return res.status(500).send(err);
  //   } else {
  //     if (results.length === 0) {
  //       return res.status(404).send("No data found");
  //     }
  //     res.json(results);
  //   }
  // });
});

/**
 * @swagger
 * /api/board/posts:
 *   patch:
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
router.patch("/posts", (req, res) => {
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
 * /api/board/posts:
 *   delete:
 *     summary: 게시물 데이터 삭제
 *     tags:
 *     - Board API
 *     description: board_id에 해당하는 게시물의 데이터를 삭제합니다(논리적 삭제)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               board_ids:
 *                 type: array
 *                 items:
 *                  type: integer
 *     responses:
 *      200:
 *        description: Successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: integer
 *                msg:
 *                  type: string
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.delete("/posts", async (req, res) => {
  // 여러 게시물 한 번에 삭제할 수 있도록 수정 20241204 kwc
  const { board_ids } = req.body;
  console.log(board_ids);

  if (!board_ids || !Array.isArray(board_ids) || board_ids.length === 0) {
    return res.status(400).json({
      code: 400,
      msg: "Bad Request: board_ids is required and should be an array",
    });
  }

  try {
    const sqlQuery = "UPDATE board SET is_deleted = true WHERE board_id IN (?)";
    const result = queryAsync(sqlQuery, [board_ids]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ code: 404, msg: "Not Found: No posts with the given ids" });
    }

    res.status(200).json({ code: 200, msg: "Successfully deleted" });
  } catch (error) {
    console.error("Error deleting post:", err);
    return res.status(500).json({ code: 500, msg: "Server Error" });
  }
  // db.query(sqlQuery, [board_id], (err, result) => { 기존 코드
  //   if (err) {
  //     console.error("Error deleting post:", err);
  //     return res.status(500).json({ code: 500, msg: "Server Error" });
  //   }

  //   if (result.affectedRows === 0) {
  //     return res
  //       .status(404)
  //       .json({ code: 404, msg: "Not Found: No post with the given id" });
  //   }

  //   res.status(200).json({ code: 200, msg: "Successfully deleted" });
  // });
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
    "INSERT INTO comment (comment, email, board_id, publish_date, ip_location, is_deleted) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sqlQuery,
    [comment, writer, board_id, new Date(), ip_location, false],
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
 * /api/board/comments:
 *   patch:
 *     summary: 게시물 댓글 수정
 *     tags:
 *     - Board API
 *     description: 특정 게시물의 댓글을 수정합니다
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
router.patch("/comments", (req, res) => {
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
 * /api/board/upload-image:
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
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  res.status(200).json({
    imageUrl: `http://localhost:8000/uploads/${req.file.filename}`,
  });
});

module.exports = router;
