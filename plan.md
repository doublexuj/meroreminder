# Mero Reminder — 개발 계획

spec.md 기반, 단순한 것부터 점진적으로 기능을 추가하는 방식으로 구성.

---

## 기술 스택

### Backend
| 항목 | 기술 | 비고 |
|------|------|------|
| Framework | Spring Boot 4.0.3 | Java 25 |
| ORM | Spring Data JPA | Repository 패턴 |
| Database | H2 | file mode — 재시작 시 데이터 유지 |
| Validation | Bean Validation (`jakarta.validation`) | `@NotBlank`, `@NotNull` 등 |
| Build | Gradle Kotlin DSL | 이미 생성 완료 |
| 의존성 | Lombok, JPA, H2 | 이미 포함 |

### Frontend
| 항목 | 기술 | 비고 |
|------|------|------|
| Framework | Next.js (latest, App Router) | TypeScript |
| Styling | Tailwind CSS v4 | Apple 시스템 컬러를 CSS 변수로 정의 |
| Icons | Lucide React | SF Symbols 대체 |
| HTTP | Fetch API | Next.js 내장, 별도 라이브러리 불필요 |
| 상태 관리 | React hooks (`useState`, `useEffect`) | 외부 상태 라이브러리 불필요 |

### 프로젝트 구조
```
mero-reminder/
├── src/main/java/mero/ai/meroreminder/   # Spring Boot backend
│   ├── entity/
│   ├── repository/
│   ├── service/
│   ├── controller/
│   └── config/
├── src/main/resources/
│   └── application.properties
├── frontend/                              # Next.js frontend
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
├── build.gradle.kts
├── spec.md
└── plan.md
```

---

## Phase 1: Backend 기본 CRUD

**목표**: Reminder의 생성/조회/수정/삭제 API가 동작하는 최소 백엔드

### 1.1 프로젝트 설정
- [ ] `application.properties` — H2 file mode, JPA 설정, 서버 포트
- [ ] CORS 설정 (`WebMvcConfigurer`) — `localhost:3000` 허용

### 1.2 Entity
- [ ] `Reminder` 엔티티 — id, title, completed, createdAt, updatedAt만 (최소 필드)
- [ ] `Priority` enum — `NONE`, `LOW`, `MEDIUM`, `HIGH`

### 1.3 Repository
- [ ] `ReminderRepository extends JpaRepository<Reminder, Long>`

### 1.4 Service
- [ ] `ReminderService` — CRUD 메서드 (create, findAll, findById, update, delete)
- [ ] 완료 토글 로직 (`toggleComplete`)

### 1.5 Controller
- [ ] `ReminderController` — REST 엔드포인트
  - `GET /api/reminders` — 전체 조회
  - `GET /api/reminders/{id}` — 단일 조회
  - `POST /api/reminders` — 생성
  - `PUT /api/reminders/{id}` — 수정
  - `PATCH /api/reminders/{id}/toggle` — 완료 토글
  - `DELETE /api/reminders/{id}` — 삭제

### 1.6 검증
- [ ] `./gradlew build` 통과
- [ ] H2 콘솔로 데이터 확인 가능
- [ ] curl 또는 HTTP 클라이언트로 API 테스트

---

## Phase 2: Frontend 기본 UI

**목표**: 리마인더 목록 표시, 추가, 완료 토글이 되는 최소 프론트엔드

### 2.1 프로젝트 생성
- [ ] `npx create-next-app@latest frontend` — TypeScript, Tailwind CSS, App Router
- [ ] Apple 시스템 컬러 CSS 변수 정의 (spec.md 3.10 색상 토큰)
- [ ] 기본 폰트 설정 (`system-ui, -apple-system, BlinkMacSystemFont`)

### 2.2 API 클라이언트
- [ ] `lib/api.ts` — Backend API 호출 함수 (fetch wrapper)
- [ ] `types/index.ts` — Reminder, ReminderList 타입 정의

### 2.3 메인 레이아웃
- [ ] 2컬럼 레이아웃 (사이드바 + 메인 영역) 뼈대
- [ ] 사이드바에 "All" 스마트 리스트만 하드코딩 (Phase 1은 리스트 없이 전체만)

### 2.4 리마인더 목록
- [ ] 리마인더 목록 컴포넌트 — Apple 스타일 체크 서클 + 제목 표시
- [ ] "Add Reminder" 버튼 → 인라인 입력 필드 → Enter로 생성
- [ ] 체크 서클 클릭 → 완료 토글 API 호출
- [ ] 빈 상태 화면 ("No Reminders")

### 2.5 기본 스타일링
- [ ] 사이드바 반투명 배경 + backdrop blur
- [ ] 리마인더 행 — 44px 높이, 인덴트 구분선
- [ ] 체크 서클 기본 스타일 (border만 있는 원)

---

## Phase 3: Reminder 상세 필드 추가

**목표**: 메모, 마감일, 우선순위, 플래그 — Reminder의 모든 필드 지원

### 3.1 Backend 확장
- [ ] `Reminder` 엔티티에 필드 추가 — memo, dueDate, dueTime, priority, flagged, completedAt
- [ ] API 필터링 쿼리 파라미터 지원 — completed, flagged, dueToday, scheduled, sort
- [ ] Summary API — `GET /api/summary` (스마트 리스트 카운트)

### 3.2 리마인더 인라인 편집
- [ ] 리마인더 클릭 → 행 확장 (인라인 상세 편집 영역)
- [ ] 제목 편집 (borderless input)
- [ ] 메모 입력 (textarea, placeholder "Add Note")
- [ ] 마감일/시간 선택 (date/time input)
- [ ] 우선순위 세그먼트 컨트롤 (없음 / ! / !! / !!!)
- [ ] 플래그 토글 버튼
- [ ] 삭제 버튼 (빨간색 텍스트, 확인 다이얼로그)

### 3.3 목록 표시 강화
- [ ] 제목 아래 부가정보 표시 (메모 미리보기, 마감일)
- [ ] 우선순위 `!` / `!!` / `!!!` 표시
- [ ] 플래그 아이콘 (주황색 깃발)
- [ ] 완료 시 취소선 + 회색 텍스트

---

## Phase 4: 리스트 (List) 기능

**목표**: 사용자 리스트 CRUD + 리마인더를 리스트에 소속시키기

### 4.1 Backend
- [ ] `ReminderList` 엔티티 — id, name, color, createdAt, updatedAt
- [ ] `ReminderListRepository`
- [ ] `ReminderListService` + `ReminderListController`
  - `GET /api/lists` — 리스트 목록 (미완료 카운트 포함)
  - `POST /api/lists` — 생성
  - `PUT /api/lists/{id}` — 수정
  - `DELETE /api/lists/{id}` — 삭제 (cascade)
- [ ] `Reminder` 엔티티에 `list` 연관관계 추가 (`@ManyToOne`)
- [ ] `GET /api/reminders?listId=` 필터 지원

### 4.2 사이드바 — 사용자 리스트
- [ ] My Lists 섹션 — 색상 원 + 이름 + 카운트
- [ ] 리스트 클릭 → 해당 리스트의 리마인더만 표시
- [ ] 리스트 선택 상태 하이라이트

### 4.3 리스트 생성/편집 모달
- [ ] "+ Add List" 클릭 → 모달
- [ ] 이름 입력 (중앙 정렬)
- [ ] 12색 원형 팔레트 (3x4 그리드), 선택 시 체크마크
- [ ] 상단 아이콘 미리보기 (선택한 색상)
- [ ] Cancel / Done 버튼
- [ ] 리스트 편집 (우클릭 또는 컨텍스트 메뉴)
- [ ] 리스트 삭제 (확인 다이얼로그)

### 4.4 리마인더-리스트 연동
- [ ] 리마인더 생성 시 현재 선택된 리스트에 자동 소속
- [ ] 리마인더 상세 편집에서 소속 리스트 변경 드롭다운
- [ ] 메인 헤더에 리스트 이름 + 테마 색상 반영

---

## Phase 5: 스마트 리스트

**목표**: Today, Scheduled, All, Flagged, Completed 스마트 리스트 완성

### 5.1 사이드바 스마트 리스트 카드
- [ ] 2열 그리드 카드 배치 (spec.md 3.3)
- [ ] 각 카드: 원형 아이콘(테마색 배경 + 흰색 Lucide 아이콘) + 카운트 + 라벨
  - Today: CalendarDays (Blue)
  - Scheduled: Calendar (Red)
  - All: Inbox (Gray)
  - Flagged: Flag (Orange)
  - Completed: CheckCircle (Gray)
- [ ] Summary API 호출하여 카운트 표시

### 5.2 스마트 리스트 필터링
- [ ] Today 클릭 → `GET /api/reminders?dueToday=true&completed=false`
- [ ] Scheduled 클릭 → `GET /api/reminders?scheduled=true&completed=false`
- [ ] All 클릭 → `GET /api/reminders?completed=false`
- [ ] Flagged 클릭 → `GET /api/reminders?flagged=true&completed=false`
- [ ] Completed 클릭 → `GET /api/reminders?completed=true`

### 5.3 스마트 리스트 헤더
- [ ] 리스트 이름 볼드 타이틀 + 테마 색상
- [ ] Today인 경우 우측에 오늘 날짜 표시

---

## Phase 6: 애니메이션 & 폴리시

**목표**: Apple Reminders 수준의 인터랙션 품질

### 6.1 애니메이션
- [ ] 완료 체크 — 원 채움 + 체크마크 scale 애니메이션 (0.3s)
- [ ] 완료 후 0.5초 뒤 리스트에서 슬라이드 아웃
- [ ] 리스트 전환 — fade + slide 전환 (0.2s)
- [ ] 리마인더 추가 — slide-down (0.25s)
- [ ] 리마인더 삭제 — slide-out + collapse (0.3s)
- [ ] 리마인더 인라인 확장 — expand (0.25s ease)
- [ ] 스마트리스트 카드 hover — scale(1.02) + 그림자 강화

### 6.2 빈 상태
- [ ] Today 비어있음 — "All Clear for Today"
- [ ] 일반 리스트 비어있음 — "No Reminders"
- [ ] My Lists 비어있음 — "No lists yet"

### 6.3 에러/로딩 처리
- [ ] API 호출 중 로딩 인디케이터
- [ ] API 에러 시 토스트 또는 인라인 에러 메시지
- [ ] 낙관적 업데이트 (optimistic update) — 완료 토글, 삭제 시 즉시 UI 반영

### 6.4 반응형
- [ ] Desktop (>1024px) — 사이드바 항상 표시
- [ ] Tablet (768-1024px) — 사이드바 오버레이, 햄버거 토글
- [ ] Mobile (<768px) — 사이드바 풀스크린 오버레이

---

## Phase 간 의존관계

```
Phase 1 (Backend CRUD)
  └─▶ Phase 2 (Frontend 기본)
        └─▶ Phase 3 (상세 필드)
              └─▶ Phase 4 (리스트)
                    └─▶ Phase 5 (스마트 리스트)
                          └─▶ Phase 6 (폴리시)
```

각 Phase 완료 후 동작 확인 → 다음 Phase 진행.
