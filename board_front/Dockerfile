# 1. Node.js를 기반으로 빌드 환경 설정
FROM node:20.18 AS build

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json 복사 및 의존성 설치
COPY package.json ./
RUN npm install

# 4. 소스 코드 복사 및 React 빌드
COPY . .
RUN npm run build

# 5. Nginx 이미지로 전환 (정적 파일 제공)
FROM nginx:alpine

# 6. 빌드된 파일 복사
COPY --from=build /app/build /usr/share/nginx/html

# 7. 포트 노출
EXPOSE 80

# 8. Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
