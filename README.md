# 와이즐리 구독 서비스 API

## 사용기술

NestJs, TypeORM

## 설치 환경

- npm >= 6.14.16
- node >= 14.19.0
- yarn >= 1.22.17

## 개발환경

- 테이블 생성

```bash
$ yarn install
$ yarn start:dev
```

- 초기 데이터 생성

```bash
$ yarn seed:run
```

## 환경변수

.env.development

```
# App
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=00000000
DATABASE_NAME=wisely-app

# JWT
JWT_ACCESS_TOKEN_SECRET=plask
JWT_ACCESS_TOKEN_EXPIRESIN=30m

# ETC
SUBSCRIPTION_MIN_PRICE=8900
```

## API Docs

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)
