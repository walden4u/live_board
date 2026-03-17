---
name: board-feature
description: 게시판 기능 구현 가이드 (Next.js + PocketBase)
user-invocable: true
---

# 게시판 기능 구현

Next.js App Router + PocketBase로 게시판 기능을 구현합니다.

## 사용법

```
/board-feature
```

## 기술 스택

- **Next.js 14+** App Router (app/ 디렉토리)
- **React** 서버/클라이언트 컴포넌트
- **PocketBase** JS SDK (`pocketbase` 패키지)
- **Tailwind CSS** 스타일링

## 프로젝트 구조 규칙

```
src/
  app/
    page.tsx                 # 메인 (게시글 목록)
    posts/
      [id]/page.tsx          # 게시글 상세
      new/page.tsx           # 게시글 작성
      [id]/edit/page.tsx     # 게시글 수정
    login/page.tsx           # 로그인
    register/page.tsx        # 회원가입
  components/
    PostList.tsx             # 게시글 목록 컴포넌트
    PostForm.tsx             # 게시글 작성/수정 폼
    AuthForm.tsx             # 인증 폼
    Navbar.tsx               # 네비게이션 바
  lib/
    pocketbase.ts            # PocketBase 클라이언트 싱글톤
```

## PocketBase 클라이언트 패턴

```typescript
// src/lib/pocketbase.ts
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export default pb;
```

## 구현 시 주의사항

- PocketBase SDK는 클라이언트 사이드에서 사용 (`'use client'` 필요)
- `pb.authStore`로 인증 상태 관리 — 쿠키/로컬스토리지에 자동 저장
- 서버 컴포넌트에서 데이터 fetch 시 PocketBase REST API 직접 호출
- 파일 URL: `pb.files.getURL(record, record.fieldName)`
- 페이지네이션: `getList(page, perPage, { sort, filter })` 사용
- 실시간 기능이 필요하면 `subscribe()` 활용

## 게시판에 필요한 PocketBase 컬렉션

### posts 컬렉션

| 필드 | 타입 | 설명 |
|------|------|------|
| title | text | 게시글 제목 (required) |
| content | editor | 게시글 내용 |
| author | relation → users | 작성자 |
| views | number | 조회수 (default: 0) |

### comments 컬렉션 (선택)

| 필드 | 타입 | 설명 |
|------|------|------|
| content | text | 댓글 내용 (required) |
| post | relation → posts | 대상 게시글 |
| author | relation → users | 작성자 |

컬렉션 생성은 `/pb-collection` 스킬로 자동화 가능합니다.
