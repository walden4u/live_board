---
name: pocketbase-db
description: PocketBase 데이터베이스 접속 정보 및 API 사용법 (v0.23+)
user-invocable: true
---

# PocketBase 데이터베이스

이 프로젝트는 **PocketBase v0.23+**를 백엔드로 사용합니다.

## 접속 정보

| 항목 | 값 |
|------|-----|
| Admin UI | http://mini3-pocketbase-2ede60-194-233-73-98.traefik.me/_/#/login |
| API Base URL | http://mini3-pocketbase-2ede60-194-233-73-98.traefik.me |
| Admin Email | hulda23@gmail.com |
| Admin Password | jm9vzvb5rnztijddvnukotosbk4z8gd3 |

## PocketBase v0.23+ 주요 변경점

- 관리자 → `_superusers` 컬렉션으로 변경
- 인증 엔드포인트: `/api/collections/_superusers/auth-with-password`
- 기존 `/api/admins/` 엔드포인트는 404 반환

## 현재 컬렉션

| 컬렉션 | 타입 | 필드 |
|--------|------|------|
| `users` | auth | email, name, avatar |
| `_superusers` | auth (시스템) | email (관리자용) |

## 클라이언트 연동 (TypeScript)

```bash
npm install pocketbase
```

```typescript
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://mini3-pocketbase-2ede60-194-233-73-98.traefik.me');

// 사용자 인증
await pb.collection('users').authWithPassword('email@example.com', 'password');

// 레코드 CRUD
const list = await pb.collection('posts').getList(1, 20, { sort: '-created' });
const record = await pb.collection('posts').create({ title: '제목', content: '내용' });
await pb.collection('posts').update(record.id, { title: '수정된 제목' });
await pb.collection('posts').delete(record.id);

// 실시간 구독
pb.collection('posts').subscribe('*', (e) => {
  console.log(e.action, e.record);
});

// 구독 해제
pb.collection('posts').unsubscribe('*');
```

## 관리자 API 호출 (curl)

```bash
# 관리자 인증 (v0.23+)
curl -X POST http://mini3-pocketbase-2ede60-194-233-73-98.traefik.me/api/collections/_superusers/auth-with-password \
  -H "Content-Type: application/json" \
  -d '{"identity":"hulda23@gmail.com","password":"jm9vzvb5rnztijddvnukotosbk4z8gd3"}'

# 컬렉션 목록 (인증 토큰 필요)
curl http://mini3-pocketbase-2ede60-194-233-73-98.traefik.me/api/collections \
  -H "Authorization: TOKEN"
```

## 주의사항

- 외부 서버(mini3)에서 실행 — 로컬 DB가 아님
- Traefik 리버스 프록시를 통해 노출
- 스키마 변경은 Admin UI 또는 API로 관리
- 환경변수 `NEXT_PUBLIC_POCKETBASE_URL`에 URL 저장
