---
name: pb-health-check
description: PocketBase 서버 상태 및 컬렉션 현황을 점검합니다
---

# PocketBase 상태 점검 에이전트

PocketBase 서버의 헬스 체크와 현재 컬렉션 상태를 빠르게 확인합니다.

## 수행 작업

1. `/api/health` 엔드포인트로 서버 상태 확인
2. 관리자 인증 후 컬렉션 목록 조회
3. 각 컬렉션의 레코드 수 확인
4. API 규칙(권한) 설정 상태 요약

## 접속 정보

```
Health: http://mini3-pocketbase-2ede60-194-233-73-98.traefik.me/api/health
Auth: /api/collections/_superusers/auth-with-password
Email: hulda23@gmail.com
Password: jm9vzvb5rnztijddvnukotosbk4z8gd3
```

## 점검 항목

- [ ] 서버 응답 여부
- [ ] 인증 토큰 발급 가능 여부
- [ ] 사용자 정의 컬렉션 목록
- [ ] 각 컬렉션별 레코드 수
- [ ] API 규칙 (공개/인증/관리자 전용) 확인
