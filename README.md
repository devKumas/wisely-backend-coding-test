# 와이즐리 구독 서비스 API

## 사용기술

NestJs, TypeORM

## 설치 환경

- npm >= 6.14.16
- node >= 14.19.0
- yarn >= 1.22.17

## 개발환경

- 프로젝트 실행

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

### API 호출 시나리오

- 상품 구독
  - 로그인 -> 구독 등록
- 구독 주기 변경
  - 로그인 -> 구독 조회 -> 구독 변경
- 구독 삭제
  - 로그인 -> 구독 조회 -> 구독 삭제
- 구독 상품 추가
  - 로그인 -> 구독 조회 -> 구독 상품 추가
- 구독 상품 수정
  - 로그인 -> 구독 조회 -> 구독 상품 수정
- 구독 상품 삭제
  - 로그인 -> 구독 조회 -> 구독 상품 삭제
- 구독 결제
  - 로그인 -> 구독 조회 -> 구독 결제
