const redis = require('redis');

// Redis 클라이언트 생성
const redisClient = redis.createClient({
  // 클라우드 Redis URL redis://<username>:<password>@<host>:<port> env.환경변수로 관리해야할듯함
  url: "redis://default:xh0S9lFS04MTY8uzzNvtzl3Olucek4Ry@redis-10981.c340.ap-northeast-2-1.ec2.redns.redis-cloud.com:10981", 
  legacyMode: false, // Redis 버전에 따라 필요할 수 있음(최신버전에선 켜야함).... 라고했는데 이걸 false하니까 문제없이 잘돌아간다...
});

// Redis 연결
redisClient.connect().catch(console.error);

redisClient.on("connect", () => {
  console.log("Redis에 연결되었습니다");
});

redisClient.on("error", (err) => {
  console.error("Redis 연결 오류:", err);
});

module.exports = redisClient;