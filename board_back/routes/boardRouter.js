const express = require("express");
const router = express.Router();
const {
  queryAsync,
  create,
  read,
  update,
  remove,
} = require("../utils/dbUtils");
const {
  createResponse,
  successResponse,
  clientErrorResponse,
  dataNotFoundErrorResponse,
  serverErrorResponse,
} = require("../utils/responseUtils");
const upload = require("../config/multerConfig");

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
 *         description: Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 */
router.post("/posts", async (req, res) => {
  console.log("Request received");

  const { title, contents, writer, ip_location } = req.body; //구조분해할당
  const table = "board";
  const data = {
    title,
    contents,
    views: 0,
    weather: "맑음",
    publish_date: new Date(),
    email: writer,
    ip_location,
  };

  if (!title || !contents) {
    return res
      .status(400)
      .json(clientErrorResponse("제목과 내용을 입력해야 합니다."));
  }

  if (!writer || !ip_location) {
    return res
      .status(400)
      .json(clientErrorResponse("이메일과 IP 주소를 입력해야 합니다."));
  }

  try {
    await create(table, data);
    res
      .status(200)
      .json(successResponse({}, "게시물이 성공적으로 작성되었습니다"));
  } catch (error) {
    console.error(error);
    res.status(500).json(serverErrorResponse("서버 에러 발생"));
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       404:
 *         description: Data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
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
      "update_date",
    ];
    const conditions = { is_deleted: false };
    const orderBy = "publish_date DESC";
    const result = await read(table, columns, conditions, orderBy);

    if (result.length === 0) {
      return res
        .status(404)
        .json(dataNotFoundErrorResponse("게시물이 없습니다."));
    }
    res.status(200).json(successResponse(result, "게시물 목록 조회 성공"));
  } catch (error) {
    console.log(error);
    res.status(500).json(serverErrorResponse("서버 에러 발생"));
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
 *                   type: object
 *                   properties:
 *                     board_id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     contents:
 *                       type: string
 *                     views:
 *                       type: integer
 *                     weather:
 *                       type: string
 *                     publish_date:
 *                       type: string
 *                     email:
 *                       type: string
 *                     ip_location:
 *                       type: string
 *                     update_date:
 *                       type: string
 *                 msg:
 *                   type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       404:
 *         description: Data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 */
router.get("/posts/:board_id", async (req, res) => {
  console.log("Request received");

  const { board_id } = req.params;
  const table = "board";
  const columns = "*";
  const data = { views: "views + 1" };
  const conditions = { board_id };

  try {
    if (!board_id) {
      return res.status(400).json(clientErrorResponse("게시물 ID가 없습니다."));
    }
    // 조회수 증가(views + 1 이 문자로 처리가 되는 이슈가 있어 커스텀 쿼리문을 작성하여 처리)
    const incrementViewsSql = `UPDATE ${table} SET views = views + 1 WHERE board_id = ?`;
    const incrementResult = await queryAsync(incrementViewsSql, [board_id]);
    if (incrementResult.affectedRows === 0) {
      return res
        .status(404)
        .json(dataNotFoundErrorResponse("해당 게시물이 없습니다."));
    }

    // 게시물 상세 정보 조회
    const post = await read(table, columns, conditions);
    if (post.length === 0) {
      return res
        .status(404)
        .json(dataNotFoundErrorResponse("해당 게시물이 없습니다."));
    }

    res.status(200).json(successResponse(post[0], "게시물 상세 조회 성공"));
  } catch (error) {
    console.error(error);
    res.status(500).json(serverErrorResponse("서버 에러 발생"));
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
 *               contents:
 *                 type: string
 *               board_id:
 *                 type: integer
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
 *                   type: object
 *                 msg:
 *                   type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       404:
 *         description: Data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 */
router.patch("/posts", async (req, res) => {
  // const title = req.body.title;
  // const contents = req.body.contents;
  // const board_id = req.body.board_id;
  const { title, contents, board_id } = req.body;

  console.log("Request received");

  // const sqlQuery =
  //   "UPDATE board SET title = ?, contents = ?, update_date = ? WHERE board_id = ?";

  const table = "board";
  const data = { title, contents, update_date: new Date() };
  const conditions = { board_id };

  if (!board_id) {
    return res.status(400).json(clientErrorResponse("게시물 ID가 없습니다."));
  }

  if (!title || !contents) {
    return res
      .status(400)
      .json(clientErrorResponse("제목과 내용을 입력해야 합니다."));
  }

  try {
    const result = await update(table, data, conditions);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json(dataNotFoundErrorResponse("해당 게시물이 없습니다."));
    }
    res
      .status(200)
      .json(successResponse({}, "게시물이 성공적으로 수정되었습니다"));
  } catch (error) {
    console.log(error);
    res.status(500).json(serverErrorResponse("서버 에러 발생"));
  }
  // db.query(sqlQuery, [title, contents, new Date(), board_id], (err, result) => {
  //   if (err) {
  //     console.error(err);
  //     return res.status(500).send(err);
  //   } else {
  //     res.send("Success!!");
  //   }
  // });
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
 *                   type: object
 *                 msg:
 *                   type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       404:
 *         description: Data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 */
router.delete("/posts", async (req, res) => {
  // 여러 게시물 한 번에 삭제할 수 있도록 수정 20241204 kwc
  const { board_ids } = req.body;
  console.log(board_ids);

  if (!board_ids || board_ids.length === 0) {
    return res.status(400).json(clientErrorResponse("게시물 ID가 없습니다."));
  }

  try {
    // const sqlQuery = "UPDATE board SET is_deleted = ? WHERE board_id IN (?)";
    // const result = queryAsync(sqlQuery, [board_ids]);
    const table = "board";
    const data = { is_deleted: true };
    const conditions = { board_id: board_ids };

    const result = await update(table, data, conditions);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json(dataNotFoundErrorResponse("해당 게시물이 없습니다."));
    }

    res
      .status(200)
      .json(successResponse({}, "게시물이 성공적으로 삭제되었습니다"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(serverErrorResponse("서버 에러 발생"));
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
 *         description: Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       404:
 *         description: Data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 */
router.post("/comments", async (req, res) => {
  // const board_id = req.body.board_id;
  // const comment = req.body.comment;
  // const writer = req.body.writer;
  // const ip_location = req.body.ip_location;
  const { board_id, comment, writer, ip_location } = req.body;
  console.log("Request received");
  if (!board_id) {
    return res.status(400).json(clientErrorResponse("게시물ID가 없습니다."));
  }

  if (!writer) {
    return res
      .status(400)
      .json(clientErrorResponse("작성자 이메일이 없습니다."));
  }

  if (!ip_location) {
    return res
      .status(400)
      .json(clientErrorResponse("작성자 IP 주소가 없습니다."));
  }

  if (!comment) {
    return res.status(400).json(clientErrorResponse("댓글을 입력해주세요."));
  }

  // const sqlQuery =
  //   "INSERT INTO comment (comment, email, board_id, publish_date, ip_location, is_deleted) VALUES (?, ?, ?, ?, ?, ?)";

  try {
    let table = "board";
    const columns = "*";
    const conditions = { board_id, is_deleted: false };

    // 게시물이 존재하는지 확인
    const articleExists = await read(table, columns, conditions);
    if (articleExists.length === 0) {
      return res
        .status(404)
        .json(clientErrorResponse("해당 게시물이 존재하지 않습니다."));
    }

    table = "comment";
    const data = {
      comment,
      email: writer,
      board_id,
      publish_date: new Date(),
      ip_location,
      is_deleted: false,
    };

    await create(table, data);
    return res
      .status(200)
      .json(successResponse({}, "댓글이 성공적으로 작성되었습니다"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(serverErrorResponse("서버 에러 발생"));
  }
  // db.query(
  //   sqlQuery,
  //   [comment, writer, board_id, new Date(), ip_location, false],
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
 *         description: Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       404:
 *         description: Data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 */
router.get("/comments/:board_id", async (req, res) => {
  const { board_id } = req.params;
  console.log("Request received");
  if (!board_id) {
    return res.status(400).json(clientErrorResponse("게시물 ID가 없습니다."));
  }

  const table = "comment";
  const columns = "*";
  const conditions = { board_id, is_deleted: false };
  const orderBy = "publish_date DESC";

  try {
    const result = await read(table, columns, conditions, orderBy);
    if (result.length === 0) {
      return res
        .status(404)
        .json(dataNotFoundErrorResponse("해당 게시물의 댓글이 없습니다."));
    }
    res.status(200).json(successResponse(result, "게시물 댓글 조회 성공"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(serverErrorResponse("서버 에러 발생"));
  }
  // const sqlQuery =
  //   "SELECT * FROM comment WHERE board_id = ? ORDER BY publish_date DESC";
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
 *         description: Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       404:
 *         description: Data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 msg:
 *                   type: string
 */
router.patch("/comments", async (req, res) => {
  // const title = req.body.title;
  // const contents = req.body.contents;
  // const board_id = req.body.board_id;

  const { comment, board_id } = req.body;
  console.log("Request received");

  if (!board_id) {
    return res.status(400).json(clientErrorResponse("게시물 ID가 없습니다."));
  }

  if (!title || !contents) {
    return res
      .status(400)
      .json(clientErrorResponse("제목과 내용을 입력해야 합니다."));
  }

  let table = "comment";
  const columns = "*";
  const data = { comment, update_date: new Date() };
  const conditions = { board_id };

  try {
    const articleExists = await read(table, columns, conditions);
    if (articleExists.length === 0) {
      return res.status.json(
        dataNotFoundErrorResponse("해당 게시물이 존재하지 않습니다.")
      );
    }
    const result = await update(table, data, conditions);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json(dataNotFoundErrorResponse("해당 댓글이 없습니다."));
    }
    res
      .status(200)
      .json(successResponse({}, "댓글이 성공적으로 수정되었습니다"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(serverErrorResponse("서버 에러 발생"));
  }

  // const sqlQuery =
  //   "UPDATE board SET title = ?, contents = ?, update_date = ? WHERE board_id = ?";
  // // "INSERT INTO board (title, contents, views, weather, publish_date, email, ip_location) VALUES (?, ?, ?, ?, ?, ?, ?)";
  // db.query(sqlQuery, [title, contents, new Date(), board_id], (err, result) => {
  //   if (err) {
  //     console.error(err);
  //     return res.status(500).send(err);
  //   } else {
  //     res.send("Success!!");
  //   }
  // });
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
