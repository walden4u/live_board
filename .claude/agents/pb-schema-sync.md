---
name: pb-schema-sync
description: PocketBase 서버의 컬렉션 스키마를 조회하고 TypeScript 타입을 생성합니다
---

# PocketBase 스키마 동기화 에이전트

PocketBase 서버에서 현재 컬렉션 구조를 가져와 TypeScript 인터페이스를 자동 생성합니다.

## 수행 작업

1. PocketBase 관리자 인증 (v0.23+ `_superusers` 엔드포인트)
2. 모든 컬렉션 목록 및 필드 정보 조회
3. 시스템 컬렉션 제외, 사용자 정의 컬렉션만 추출
4. `src/lib/types.ts`에 TypeScript 인터페이스 생성

## 인증 정보

```
URL: http://mini3-pocketbase-2ede60-194-233-73-98.traefik.me
Endpoint: /api/collections/_superusers/auth-with-password
Email: hulda23@gmail.com
Password: jm9vzvb5rnztijddvnukotosbk4z8gd3
```

## 타입 매핑 규칙

| PocketBase 타입 | TypeScript 타입 |
|----------------|----------------|
| text, editor, email, url | string |
| number | number |
| bool | boolean |
| date, autodate | string (ISO 8601) |
| select (maxSelect=1) | string |
| select (maxSelect>1) | string[] |
| file (maxSelect=1) | string |
| file (maxSelect>1) | string[] |
| relation (maxSelect=1) | string |
| relation (maxSelect>1) | string[] |
| json | unknown |

## 출력 형식

```typescript
// Auto-generated from PocketBase schema
// Do not edit manually — run pb-schema-sync agent to regenerate

export interface BaseRecord {
  id: string;
  created: string;
  updated: string;
}

export interface Post extends BaseRecord {
  title: string;
  content: string;
  author: string;
  views: number;
}
```
