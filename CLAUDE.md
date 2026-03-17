# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

PocketBase 백엔드를 사용하는 간단한 게시판 웹 애플리케이션.

- **프론트엔드**: Next.js + React (TypeScript)
- **백엔드/DB**: PocketBase v0.23+ (외부 서버)
- **스타일링**: Tailwind CSS

## 개발 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 실행
```

## 아키텍처

```
src/
  app/              # Next.js App Router (페이지 및 레이아웃)
  components/       # React 컴포넌트
  lib/
    pocketbase.ts   # PocketBase 클라이언트 인스턴스 및 헬퍼
```

### PocketBase 연동

- PocketBase v0.23+ 사용 — 관리자 인증은 `_superusers` 컬렉션 사용
- API Base: `http://mini3-pocketbase-2ede60-194-233-73-98.traefik.me`
- 클라이언트 SDK: `pocketbase` npm 패키지
- 실시간 데이터는 PocketBase SSE 구독 활용

### 주요 컬렉션 (PocketBase)

- `users` (auth 타입): 사용자 인증/프로필 (email, name, avatar)
- 게시판 관련 컬렉션은 필요 시 PocketBase Admin UI에서 생성

## 환경 변수

```
NEXT_PUBLIC_POCKETBASE_URL=http://mini3-pocketbase-2ede60-194-233-73-98.traefik.me
```

## 스킬 및 에이전트

- `/pocketbase-db` — PocketBase 접속 정보 및 API 사용법
- `/pb-collection` — PocketBase 컬렉션 생성/관리
- `/board-feature` — 게시판 기능 구현 가이드
