# 1. Node.js 기본 이미지 사용
FROM node:20.18

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json 및 package-lock.json 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 소스 코드 복사
COPY . .

# 6. 포트 노출
EXPOSE 3000

# 7. 애플리케이션 실행
CMD ["npm", "start"]
