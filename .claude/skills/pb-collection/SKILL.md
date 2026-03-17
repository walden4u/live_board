---
name: pb-collection
description: PocketBase 컬렉션(테이블) 생성 및 관리 자동화
user-invocable: true
---

# PocketBase 컬렉션 관리

PocketBase API를 통해 컬렉션을 생성/수정/삭제합니다.

## 사용법

```
/pb-collection
```

사용자가 원하는 컬렉션 구조를 설명하면, PocketBase API로 직접 생성합니다.

## 수행 작업

### 1단계: 관리자 인증

```bash
TOKEN=$(curl -s -X POST "http://mini3-pocketbase-2ede60-194-233-73-98.traefik.me/api/collections/_superusers/auth-with-password" \
  -H "Content-Type: application/json" \
  -d '{"identity":"hulda23@gmail.com","password":"jm9vzvb5rnztijddvnukotosbk4z8gd3"}' | python -c "import sys,json; print(json.load(sys.stdin)['token'])")
```

### 2단계: 현재 컬렉션 확인

```bash
curl -s "http://mini3-pocketbase-2ede60-194-233-73-98.traefik.me/api/collections" \
  -H "Authorization: $TOKEN" | python -m json.tool
```

### 3단계: 컬렉션 생성

사용자 요청에 맞는 컬렉션을 API로 생성합니다.

```bash
curl -X POST "http://mini3-pocketbase-2ede60-194-233-73-98.traefik.me/api/collections" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "컬렉션명",
    "type": "base",
    "fields": [
      {"name": "필드명", "type": "text", "required": true}
    ]
  }'
```

### PocketBase 필드 타입 참고

| 타입 | 설명 | 옵션 |
|------|------|------|
| `text` | 텍스트 | min, max, pattern |
| `number` | 숫자 | min, max |
| `bool` | 불리언 | — |
| `email` | 이메일 | — |
| `url` | URL | — |
| `date` | 날짜/시간 | min, max |
| `select` | 선택 | values, maxSelect |
| `relation` | 관계 | collectionId, maxSelect |
| `file` | 파일 | maxSelect, maxSize, mimeTypes |
| `editor` | 리치텍스트 | — |
| `autodate` | 자동 날짜 | onCreate, onUpdate |

### API 규칙 (Rule) 설정

```json
{
  "listRule": "",
  "viewRule": "",
  "createRule": "@request.auth.id != ''",
  "updateRule": "@request.auth.id != '' && author = @request.auth.id",
  "deleteRule": "@request.auth.id != '' && author = @request.auth.id"
}
```

- `""` (빈 문자열) = 누구나 접근 가능
- `null` = 관리자만 접근 가능
- PQL 필터 문법으로 조건 지정 가능
