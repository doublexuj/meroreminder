# PRD: Mero Reminder — Apple Reminders Web Clone

## 1. Overview

Apple Reminders 앱의 핵심 기능을 웹에서 사용할 수 있는 서비스를 개발한다.

- **Backend**: Spring Boot 4.0.3 + JPA/H2 REST API
- **Frontend**: Next.js (latest) SPA
- **목표**: 단일 사용자 환경에서 리마인더를 생성, 관리, 완료할 수 있는 깔끔한 웹 앱

---

## 2. 핵심 기능

### 2.1 리마인더 (Reminder)

| 항목 | 설명 |
|------|------|
| 생성 | 제목 입력으로 빠르게 생성 |
| 편집 | 제목, 메모, 마감일, 마감시간, 우선순위, 플래그 수정 |
| 삭제 | 리마인더 삭제 (확인 다이얼로그) |
| 완료/미완료 토글 | 체크박스 클릭으로 완료 상태 전환 |
| 우선순위 | 없음 / 낮음 / 보통 / 높음 (4단계) |
| 플래그 | 중요 리마인더 플래그 표시 |
| 메모 | 리마인더에 부가 설명 추가 |
| 정렬 | 마감일순, 우선순위순, 생성일순 |

### 2.2 리스트 (List)

| 항목 | 설명 |
|------|------|
| 생성 | 이름, 색상을 지정하여 리스트 생성 |
| 편집 | 이름, 색상 변경 |
| 삭제 | 리스트 삭제 시 포함된 리마인더도 함께 삭제 |
| 색상 | 12가지 프리셋 색상 중 선택 |

### 2.3 스마트 리스트 (Smart List)

서버에서 필터링하여 자동 생성되는 가상 리스트:

| 스마트 리스트 | 조건 |
|--------------|------|
| **Today** | 마감일이 오늘인 미완료 리마인더 |
| **Scheduled** | 마감일이 설정된 미완료 리마인더 |
| **All** | 모든 미완료 리마인더 |
| **Flagged** | 플래그가 설정된 미완료 리마인더 |
| **Completed** | 완료된 리마인더 |

---

## 3. UI/UX 디자인 — Apple Reminders 스타일

### 3.1 디자인 원칙

Apple Reminders 앱의 시각적 언어를 최대한 충실히 재현한다.

- **SF Pro 스타일 타이포그래피**: `system-ui, -apple-system, BlinkMacSystemFont` 폰트 스택
- **iOS/macOS 색상 체계**: Apple 시스템 컬러 사용 (Blue #007AFF, Red #FF3B30, Orange #FF9500, Yellow #FFCC00, Green #34C759, Cyan #5AC8FA, Indigo #5856D6, Purple #AF52DE, Pink #FF2D55, Brown #A2845E, Gray #8E8E93, Teal #30B0C7)
- **Glassmorphism**: 사이드바에 반투명 배경 + backdrop blur 적용
- **부드러운 모션**: 모든 상태 전환에 ease-in-out 애니메이션

### 3.2 전체 레이아웃

```
┌──────────────────────────────────────────────────────────────────┐
│ (macOS 스타일 상단바 — 사이드바 토글, 검색 없음)                     │
├───────────────┬──────────────────────────────────────────────────┤
│               │                                                  │
│   ┌─────┐    │  Today                          2026년 3월 15일   │
│   │ 📅  │ 3  │  ─────────────────────────────────────────────── │
│   │Today│    │                                                  │
│   └─────┘    │  ○  장보기                                        │
│   ┌─────┐    │     우유, 계란, 빵                                 │
│   │ 📋  │ 5  │                                                  │
│   │Sche │    │  ○  회의 준비                                      │
│   └─────┘    │     발표자료 검토                    🚩            │
│   ┌─────┐    │                                                  │
│   │ 📥  │12  │  ○  운동하기                        !!            │
│   │ All │    │     2026-03-15 18:00                              │
│   └─────┘    │                                                  │
│   ┌─────┐    │                                                  │
│   │ 🚩  │ 2  │                                                  │
│   │Flag │    │                                                  │
│   └─────┘    │                                                  │
│   ┌─────┐    │                                                  │
│   │ ✓   │ 8  │                                                  │
│   │Done │    │                                                  │
│   └─────┘    │                                                  │
│              │                                                  │
│  ───────────  │                                                  │
│  My Lists    │                                                  │
│  ● 개인    3  │                                                  │
│  ● 업무    5  │                                                  │
│  ● 공부    2  │                                                  │
│              │                                                  │
│  + Add List  │              + Add Reminder                      │
└───────────────┴──────────────────────────────────────────────────┘
```

### 3.3 사이드바 (좌측 패널)

Apple Reminders의 사이드바를 충실히 재현:

| 요소 | 디자인 상세 |
|------|------------|
| 배경 | `rgba(246,246,246,0.8)` + `backdrop-filter: blur(20px)` — macOS 반투명 효과 |
| 너비 | 280px 고정, 좌측 border 없음 |
| 스마트 리스트 카드 | 2열 그리드 배치, 각 카드는 `border-radius: 12px`, 배경 white, 그림자 `0 1px 3px rgba(0,0,0,0.08)` |
| 스마트 리스트 아이콘 | 원형 배경(각 리스트 테마색) 안에 흰색 SF Symbols 스타일 아이콘 (아이콘은 Lucide React 사용) |
| 스마트 리스트 카운트 | 카드 우측 상단, 굵은 큰 숫자(24px bold) |
| 스마트 리스트 라벨 | 카드 하단, 회색 작은 텍스트(13px, `#8E8E93`) |
| 구분선 | 스마트 리스트와 My Lists 사이 `1px solid rgba(0,0,0,0.1)` |
| 사용자 리스트 | 리스트 행: 좌측에 색상 원(12px), 리스트 이름, 우측에 카운트 뱃지 |
| 사용자 리스트 hover | 배경 `rgba(0,0,0,0.04)`, `border-radius: 8px` |
| 사용자 리스트 선택 | 배경 `rgba(0,0,0,0.08)`, 좌측 색상 원 강조 |
| Add List 버튼 | 사이드바 하단 고정, `+ Add List` 텍스트, 시스템 블루 색상 |

### 3.4 메인 콘텐츠 영역

| 요소 | 디자인 상세 |
|------|------------|
| 배경 | `#FFFFFF` |
| 헤더 | 리스트 이름을 큰 볼드 타이틀로 표시 (28px, bold), 리스트 테마 색상 적용. 스마트리스트인 경우 우측에 오늘 날짜 표시 |
| 리마인더 행 높이 | 최소 44px (Apple HIG 터치 타겟 기준) |
| 체크 서클 | 24px 원형 border (`2px solid #C7C7CC`), 리스트 테마 색상 적용. hover 시 안쪽에 연한 색상 fill |
| 체크 완료 | 원이 리스트 테마 색상으로 채워지고 흰색 체크마크 표시, 0.3초 스케일 애니메이션 |
| 리마인더 제목 | 16px, `#1C1C1E`. 완료 시 취소선 + 색상 `#8E8E93` |
| 리마인더 부가정보 | 제목 아래 작은 텍스트(13px, `#8E8E93`): 메모 미리보기, 마감일, 마감시간 |
| 우선순위 표시 | 제목 앞에 `!`(낮음), `!!`(보통), `!!!`(높음) — 리스트 테마 색상 |
| 플래그 표시 | 행 우측에 주황색 깃발 아이콘 (`#FF9500`) |
| 구분선 | 각 리마인더 사이 `1px solid rgba(0,0,0,0.06)`, 좌측 체크서클 이후부터 시작 (Apple 스타일 인덴트 구분선) |
| Add Reminder | 목록 하단, `+ Add Reminder` 텍스트, 시스템 블루 색상. 클릭 시 인라인 입력 필드로 전환 |

### 3.5 리마인더 상세 편집

리마인더 클릭 시 **인라인 확장** 방식으로 상세 편집 (Apple Reminders macOS 스타일):

| 요소 | 디자인 상세 |
|------|------------|
| 동작 | 리마인더 행 클릭 시 해당 행이 아래로 확장되며 편집 필드 노출 |
| 제목 편집 | contentEditable 스타일 — 밑줄/테두리 없이 텍스트 직접 편집 |
| 메모 | 제목 아래 회색 placeholder("Add Note"), textarea 스타일 |
| 날짜 선택 | 네이티브 date/time input, Apple 스타일 라운드 필 배경 |
| 우선순위 | 세그먼트 컨트롤 (없음 / ! / !! / !!!), 선택 시 파란 배경 |
| 플래그 토글 | 깃발 아이콘 토글 버튼 |
| 리스트 변경 | 드롭다운으로 소속 리스트 변경, 색상 원 표시 |
| 삭제 | 빨간색 "Delete Reminder" 텍스트 버튼, 하단 배치 |

### 3.6 리스트 생성/편집 모달

| 요소 | 디자인 상세 |
|------|------------|
| 모달 | 중앙 정렬, `border-radius: 14px`, 그림자, backdrop dimming |
| 크기 | 360px x auto |
| 아이콘 미리보기 | 모달 상단 중앙에 선택한 색상의 큰 원형 아이콘 (56px) |
| 이름 입력 | 중앙 정렬 텍스트, 라운드 배경 (`#F2F2F7`) |
| 색상 선택 | 12색 원형 팔레트 (3행 4열 그리드), 선택 시 체크마크 오버레이 |
| 버튼 | Cancel(좌) / Done(우), 시스템 블루 텍스트 버튼 |

### 3.7 인터랙션 & 애니메이션

| 인터랙션 | 상세 |
|---------|------|
| 완료 체크 | 원 → 채워진 원 + 체크마크 (scale 0→1, 0.3s ease). 0.5초 후 리스트에서 부드럽게 슬라이드 아웃 |
| 리스트 전환 | 메인 콘텐츠가 fade + 약간의 slide 전환 (0.2s) |
| 리마인더 추가 | 새 행이 위에서 slide-down (0.25s) |
| 리마인더 삭제 | 행이 좌측으로 slide-out 후 collapse (0.3s) |
| 사이드바 hover | 부드러운 배경색 전환 (0.15s) |
| 리마인더 확장 | 상세 편집 영역이 아래로 부드럽게 expand (0.25s ease) |
| 스마트리스트 카드 | hover 시 약간의 scale-up (1.02) + 그림자 강화 |

### 3.8 빈 상태 (Empty State)

| 화면 | 표시 내용 |
|------|---------|
| 리스트에 리마인더 없음 | 중앙에 연한 회색 아이콘 + "No Reminders" 텍스트 |
| 사용자 리스트 없음 | "My Lists" 영역에 "No lists yet" 안내 |
| Today 비어있음 | 체크마크 원형 아이콘 + "All Clear for Today" |

### 3.9 반응형 동작

| 화면 크기 | 동작 |
|----------|------|
| Desktop (>1024px) | 사이드바 항상 표시, 고정 280px |
| Tablet (768-1024px) | 사이드바 오버레이 모드, 햄버거 메뉴로 토글 |
| Mobile (<768px) | 사이드바 풀스크린 오버레이, 리스트 선택 시 사이드바 닫힘 |

### 3.10 색상 토큰 정리

```
--color-bg-primary:      #FFFFFF
--color-bg-sidebar:      rgba(246, 246, 246, 0.8)
--color-bg-hover:        rgba(0, 0, 0, 0.04)
--color-bg-selected:     rgba(0, 0, 0, 0.08)
--color-bg-input:        #F2F2F7
--color-text-primary:    #1C1C1E
--color-text-secondary:  #8E8E93
--color-text-tertiary:   #C7C7CC
--color-border:          rgba(0, 0, 0, 0.06)
--color-border-strong:   rgba(0, 0, 0, 0.1)
--color-system-blue:     #007AFF
--color-system-red:      #FF3B30
--color-system-orange:   #FF9500
--color-system-yellow:   #FFCC00
--color-system-green:    #34C759
--color-system-cyan:     #5AC8FA
--color-system-indigo:   #5856D6
--color-system-purple:   #AF52DE
--color-system-pink:     #FF2D55
--color-system-brown:    #A2845E
--color-system-gray:     #8E8E93
--color-system-teal:     #30B0C7
```

---

## 4. API 설계

### 4.1 Reminder API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/reminders` | 전체 리마인더 조회 (쿼리 파라미터로 필터링) |
| GET | `/api/reminders/{id}` | 단일 리마인더 조회 |
| POST | `/api/reminders` | 리마인더 생성 |
| PUT | `/api/reminders/{id}` | 리마인더 수정 |
| PATCH | `/api/reminders/{id}/toggle` | 완료 상태 토글 |
| DELETE | `/api/reminders/{id}` | 리마인더 삭제 |

**쿼리 파라미터** (`GET /api/reminders`):
- `listId` — 특정 리스트 필터
- `completed` — 완료 상태 필터 (`true`/`false`)
- `flagged` — 플래그 필터 (`true`)
- `dueToday` — 오늘 마감 필터 (`true`)
- `scheduled` — 마감일 존재 필터 (`true`)
- `sort` — 정렬 기준 (`dueDate`, `priority`, `createdAt`)

### 4.2 List API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/lists` | 전체 리스트 조회 (각 리스트별 미완료 카운트 포함) |
| POST | `/api/lists` | 리스트 생성 |
| PUT | `/api/lists/{id}` | 리스트 수정 |
| DELETE | `/api/lists/{id}` | 리스트 삭제 (cascade) |

### 4.3 Summary API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/summary` | 스마트 리스트 카운트 일괄 조회 |

**응답 예시**:
```json
{
  "today": 3,
  "scheduled": 5,
  "all": 12,
  "flagged": 2,
  "completed": 8
}
```

---

## 5. 데이터 모델

### 5.1 ReminderList

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | Long (PK) | 자동 생성 |
| name | String | 리스트 이름 (필수) |
| color | String | 색상 코드 (예: `RED`, `BLUE`) |
| createdAt | LocalDateTime | 생성일시 |
| updatedAt | LocalDateTime | 수정일시 |

### 5.2 Reminder

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | Long (PK) | 자동 생성 |
| title | String | 제목 (필수) |
| memo | String (nullable) | 메모 |
| dueDate | LocalDate (nullable) | 마감일 |
| dueTime | LocalTime (nullable) | 마감시간 |
| priority | Enum | `NONE`, `LOW`, `MEDIUM`, `HIGH` |
| flagged | Boolean | 플래그 여부 (기본 false) |
| completed | Boolean | 완료 여부 (기본 false) |
| completedAt | LocalDateTime (nullable) | 완료일시 |
| listId | Long (FK) | 소속 리스트 |
| createdAt | LocalDateTime | 생성일시 |
| updatedAt | LocalDateTime | 수정일시 |

---

## 6. 기술 스택

### Backend
- **Spring Boot 4.0.3** / Java 25
- **Spring Data JPA** + **H2 Database** (embedded, file mode)
- REST API (JSON)
- Bean Validation으로 입력 검증

### Frontend
- **Next.js** (latest, App Router)
- **TypeScript**
- **Tailwind CSS** — Apple 스타일 미니멀 UI
- **Fetch API** — 서버 통신

---

## 7. 비기능 요구사항

- H2를 file mode로 사용하여 서버 재시작 시에도 데이터 유지
- CORS 설정: Next.js 개발 서버(localhost:3000) 허용
- API 에러 시 적절한 HTTP 상태 코드와 에러 메시지 반환
- 반응형 디자인: 데스크톱 우선, 모바일에서도 사용 가능

---

## 8. 개발 순서

### Phase 1: Backend API
1. Entity 정의 (Reminder, ReminderList)
2. Repository 생성
3. Service 레이어 구현
4. REST Controller 구현
5. CORS 설정 및 H2 콘솔 활성화
6. API 테스트

### Phase 2: Frontend
1. Next.js 프로젝트 생성 (`frontend/`)
2. API 클라이언트 구성
3. 사이드바 (스마트 리스트 + 사용자 리스트)
4. 리마인더 목록 뷰
5. 리마인더 생성/편집 폼
6. 완료 토글 및 삭제
7. 스타일링 (Apple Reminders 느낌)

### Phase 3: Polish
1. 빈 상태 화면 처리
2. 로딩/에러 상태 처리
3. 애니메이션 (완료 체크 등)

---

## 9. Scope 외 (향후 고려)

- 사용자 인증/로그인
- 하위 작업 (subtasks)
- 태그
- 반복 리마인더
- 드래그 앤 드롭 정렬
- 알림/푸시 노티피케이션
