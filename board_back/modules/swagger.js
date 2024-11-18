const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "게시판 프로토타입 프로젝트",
      version: "1.0.0",
      description: "게시판 API documentation with Swagger",
    },
    servers: [
      {
        url: process.env.REACT_APP_SERVER_URL, // IP와 포트번호 설정
      },
    ],
  },
  apis: ["./index.js", "./routes/authRouter.js", "./routes/boardRouter.js"], // 실제 API 경로 넣기
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUI, swaggerDocs };
