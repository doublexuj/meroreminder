# Mero Reminder — Tasks

---

## Phase 1: Backend 기본 CRUD

### 1.1 프로젝트 설정
- [ ] `application.properties` 설정 (H2 file mode, JPA ddl-auto, 서버 포트 8080, H2 콘솔 활성화)
- [ ] `WebConfig.java` — CORS 설정 (`localhost:3000` 허용, GET/POST/PUT/PATCH/DELETE)

### 1.2 Entity & Enum
- [ ] `Priority.java` enum 생성 (`NONE`, `LOW`, `MEDIUM`, `HIGH`)
- [ ] `Reminder.java` 엔티티 생성 (id, title, completed, createdAt, updatedAt)

### 1.3 Repository
- [ ] `ReminderRepository.java` 생성 (`extends JpaRepository<Reminder, Long>`)

### 1.4 Service
- [ ] `ReminderService.java` — `create(title)` 메서드
- [ ] `ReminderService.java` — `findAll()` 메서드
- [ ] `ReminderService.java` — `findById(id)` 메서드
- [ ] `ReminderService.java` — `update(id, request)` 메서드
- [ ] `ReminderService.java` — `delete(id)` 메서드
- [ ] `ReminderService.java` — `toggleComplete(id)` 메서드

### 1.5 Controller
- [ ] `ReminderController.java` — `GET /api/reminders`
- [ ] `ReminderController.java` — `GET /api/reminders/{id}`
- [ ] `ReminderController.java` — `POST /api/reminders`
- [ ] `ReminderController.java` — `PUT /api/reminders/{id}`
- [ ] `ReminderController.java` — `PATCH /api/reminders/{id}/toggle`
- [ ] `ReminderController.java` — `DELETE /api/reminders/{id}`

### 1.6 검증
- [ ] `./gradlew build` 통과
- [ ] H2 콘솔 접속 확인 (`/h2-console`)
- [ ] curl로 CRUD API 테스트 (생성 → 조회 → 수정 → 토글 → 삭제)

---

## Phase 2: Frontend 기본 UI

### 2.1 프로젝트 초기화
- [x] `npx create-next-app@latest frontend` (TypeScript, Tailwind CSS, App Router, src/ 없음)
- [x] `lucide-react` 패키지 설치
- [x] CSS 변수 정의 — Apple 시스템 컬러 12색 + 배경/텍스트/보더 토큰 (spec.md 3.10)
- [x] 글로벌 폰트 설정 (`system-ui, -apple-system, BlinkMacSystemFont`)

### 2.2 타입 & API 클라이언트
- [x] `types/index.ts` — `Reminder`, `Priority` 타입 정의
- [x] `lib/api.ts` — `fetchReminders()` 함수
- [x] `lib/api.ts` — `createReminder(title)` 함수
- [x] `lib/api.ts` — `toggleReminder(id)` 함수
- [x] `lib/api.ts` — `deleteReminder(id)` 함수

### 2.3 레이아웃
- [x] `app/layout.tsx` — 글로벌 레이아웃 (폰트, CSS 변수 적용)
- [x] `app/page.tsx` — 2컬럼 레이아웃 뼈대 (사이드바 280px + 메인 영역)

### 2.4 사이드바 컴포넌트
- [x] `components/Sidebar.tsx` — 사이드바 컨테이너 (반투명 배경 + backdrop blur)
- [x] "All" 스마트 리스트 항목 하드코딩 (Inbox 아이콘, 카운트 표시)

### 2.5 리마인더 목록 컴포넌트
- [x] `components/ReminderList.tsx` — 리마인더 목록 렌더링
- [x] `components/ReminderItem.tsx` — 개별 리마인더 행 (체크 서클 + 제목)
- [x] 체크 서클 클릭 → `toggleReminder()` API 호출
- [x] 빈 상태 화면 — 중앙 아이콘 + "No Reminders" 텍스트

### 2.6 리마인더 추가
- [x] `components/AddReminder.tsx` — "+ Add Reminder" 버튼
- [x] 클릭 시 인라인 입력 필드 표시
- [x] Enter 키로 `createReminder()` 호출 후 목록 갱신
- [x] Escape 키로 입력 취소

### 2.7 기본 스타일링
- [x] 사이드바 — `rgba(246,246,246,0.8)` 배경, `backdrop-filter: blur(20px)`
- [x] 리마인더 행 — 최소 44px 높이, 인덴트 구분선 (`1px solid rgba(0,0,0,0.06)`)
- [x] 체크 서클 — 24px, `2px solid #C7C7CC` border, hover 시 연한 fill
- [x] 헤더 — 리스트 이름 28px bold

---

## Phase 3: Reminder 상세 필드 추가

### 3.1 Backend 엔티티 확장
- [x] `Reminder` 엔티티에 필드 추가: `memo`, `dueDate`, `dueTime`, `priority`, `flagged`, `completedAt`
- [x] `ReminderRepository` — 쿼리 메서드 추가 (completed, flagged, dueDate 필터)
- [x] `ReminderService` — 필터링 로직 (completed, flagged, dueToday, scheduled 파라미터)
- [x] `ReminderService` — 정렬 로직 (dueDate, priority, createdAt)
- [x] `ReminderController` — `GET /api/reminders` 쿼리 파라미터 처리

### 3.2 Summary API
- [x] `SummaryController.java` — `GET /api/summary`
- [x] 응답: `{ today, scheduled, all, flagged, completed }` 카운트

### 3.3 Frontend 타입 & API 확장
- [x] `types/index.ts` — Reminder 타입에 memo, dueDate, dueTime, priority, flagged 추가
- [x] `lib/api.ts` — `updateReminder(id, data)` 함수
- [x] `lib/api.ts` — `fetchSummary()` 함수

### 3.4 인라인 상세 편집 UI
- [x] `components/ReminderDetail.tsx` — 확장 편집 영역 컨테이너
- [x] 리마인더 행 클릭 → 해당 행 아래로 확장 (편집 필드 노출)
- [x] 제목 편집 — borderless input, 기존 제목 표시
- [x] 메모 입력 — textarea, placeholder "Add Note"
- [x] 마감일 선택 — `<input type="date">`, 라운드 배경
- [x] 마감시간 선택 — `<input type="time">`, 라운드 배경
- [x] 우선순위 세그먼트 컨트롤 — 4버튼 (없음 / ! / !! / !!!), 선택 시 파란 배경
- [x] 플래그 토글 — 깃발 아이콘 버튼
- [x] 삭제 버튼 — 빨간색 "Delete Reminder", 클릭 시 확인 다이얼로그
- [x] 변경사항 자동 저장 (blur 또는 debounce로 `updateReminder()` 호출)

### 3.5 목록 표시 강화
- [x] 제목 아래 부가정보 행 — 메모 미리보기 (1줄, 말줄임), 마감일/시간
- [x] 우선순위 표시 — 제목 앞에 `!`/`!!`/`!!!` (리스트 테마 색상)
- [x] 플래그 아이콘 — 행 우측 주황색 깃발 (`#FF9500`)
- [x] 완료 상태 — 제목 취소선 + 색상 `#8E8E93`

---

## Phase 4: 리스트 (List) 기능

### 4.1 Backend — ReminderList CRUD
- [x] `ReminderList.java` 엔티티 (id, name, color, createdAt, updatedAt)
- [x] `ReminderListRepository.java`
- [x] `ReminderListService.java` — CRUD + 미완료 카운트 조회
- [x] `ReminderListController.java` — `GET /api/lists` (카운트 포함)
- [x] `ReminderListController.java` — `POST /api/lists`
- [x] `ReminderListController.java` — `PUT /api/lists/{id}`
- [x] `ReminderListController.java` — `DELETE /api/lists/{id}` (cascade)

### 4.2 Backend — Reminder-List 연관관계
- [x] `Reminder` 엔티티에 `@ManyToOne` `reminderList` 필드 추가
- [x] `ReminderController` — `GET /api/reminders?listId=` 필터 지원
- [x] `POST /api/reminders` 요청에 `listId` 필드 추가

### 4.3 Frontend 타입 & API 확장
- [x] `types/index.ts` — `ReminderList` 타입 추가
- [x] `lib/api.ts` — `fetchLists()`, `createList()`, `updateList()`, `deleteList()` 함수

### 4.4 사이드바 — My Lists 섹션
- [x] `components/Sidebar.tsx` — My Lists 섹션 추가 (구분선 아래)
- [x] 리스트 행 — 색상 원(12px) + 이름 + 미완료 카운트
- [x] 리스트 클릭 → 해당 리스트의 리마인더만 메인 영역에 표시
- [x] 선택된 리스트 하이라이트 (`rgba(0,0,0,0.08)` 배경)
- [x] "+ Add List" 버튼 (사이드바 하단, 시스템 블루)

### 4.5 리스트 생성/편집 모달
- [x] `components/ListModal.tsx` — 모달 컨테이너 (360px, border-radius 14px, backdrop dimming)
- [x] 상단 아이콘 미리보기 — 선택한 색상의 원형 아이콘 (56px)
- [x] 이름 입력 필드 — 중앙 정렬, `#F2F2F7` 배경
- [x] 12색 원형 팔레트 — 3행 4열 그리드, 선택 시 체크마크 오버레이
- [x] Cancel / Done 버튼 — 시스템 블루 텍스트
- [x] 편집 모드 — 기존 리스트 데이터 로드
- [x] 삭제 기능 — 리스트 컨텍스트 메뉴 또는 편집 모달 내 삭제 버튼 + 확인 다이얼로그

### 4.6 리마인더-리스트 연동
- [x] 리마인더 생성 시 현재 선택된 리스트에 자동 소속
- [x] 리마인더 상세 편집 — 소속 리스트 변경 드롭다운 (색상 원 표시)
- [x] 메인 영역 헤더 — 선택된 리스트 이름 + 테마 색상 적용

---

## Phase 5: 스마트 리스트

### 5.1 사이드바 — 스마트 리스트 카드 UI
- [x] 스마트 리스트 영역 — 2열 그리드 배치
- [x] Today 카드 — CalendarDays 아이콘 (Blue #007AFF), 카운트, 라벨
- [x] Scheduled 카드 — Calendar 아이콘 (Red #FF3B30), 카운트, 라벨
- [x] All 카드 — Inbox 아이콘 (Gray #8E8E93), 카운트, 라벨
- [x] Flagged 카드 — Flag 아이콘 (Orange #FF9500), 카운트, 라벨
- [x] Completed 카드 — CheckCircle 아이콘 (Gray #8E8E93), 카운트, 라벨
- [x] 각 카드 — 원형 아이콘(테마색 배경 + 흰색 아이콘) + 우측 상단 카운트(24px bold) + 하단 라벨(13px gray)
- [x] Summary API 호출하여 카운트 실시간 표시

### 5.2 스마트 리스트 필터링 연동
- [x] Today 클릭 → `fetchReminders({ dueToday: true, completed: false })`
- [x] Scheduled 클릭 → `fetchReminders({ scheduled: true, completed: false })`
- [x] All 클릭 → `fetchReminders({ completed: false })`
- [x] Flagged 클릭 → `fetchReminders({ flagged: true, completed: false })`
- [x] Completed 클릭 → `fetchReminders({ completed: true })`

### 5.3 스마트 리스트 메인 영역
- [x] 헤더 — 스마트 리스트 이름 (볼드 28px, 테마 색상)
- [x] Today 헤더 — 우측에 오늘 날짜 표시
- [x] 스마트 리스트별 빈 상태 메시지 (Today → "All Clear for Today")

---

## Phase 6: 애니메이션 & 폴리시

### 6.1 완료 체크 애니메이션
- [x] 체크 서클 → 테마색 채움 + 흰색 체크마크 (scale 0→1, 0.3s ease)
- [x] 완료 후 0.5초 딜레이 → 리스트에서 부드럽게 슬라이드 아웃 (height collapse)

### 6.2 리스트/항목 전환 애니메이션
- [x] 사이드바 리스트 전환 시 메인 콘텐츠 fade + slide (0.2s)
- [x] 리마인더 추가 시 새 행 slide-down (0.25s)
- [x] 리마인더 삭제 시 행 slide-out + collapse (0.3s)
- [x] 리마인더 인라인 확장 시 expand 애니메이션 (0.25s ease)

### 6.3 사이드바 인터랙션
- [x] 사용자 리스트 hover — 배경색 부드러운 전환 (0.15s)
- [x] 스마트 리스트 카드 hover — scale(1.02) + 그림자 강화

### 6.4 빈 상태 화면
- [x] Today 비어있음 — 체크 원 아이콘 + "All Clear for Today"
- [x] 일반 리스트 비어있음 — 연한 회색 아이콘 + "No Reminders"
- [x] My Lists 비어있음 — "No lists yet" 안내 텍스트

### 6.5 에러/로딩 처리
- [x] API 호출 중 로딩 인디케이터 (스피너 또는 스켈레톤)
- [x] API 에러 시 토스트 메시지 또는 인라인 에러
- [x] 낙관적 업데이트 — 완료 토글, 삭제 시 즉시 UI 반영 후 API 호출

### 6.6 반응형 디자인
- [x] Desktop (>1024px) — 사이드바 항상 표시, 고정 280px
- [x] Tablet (768-1024px) — 사이드바 오버레이 모드, 상단 햄버거 메뉴로 토글
- [x] Mobile (<768px) — 사이드바 풀스크린 오버레이, 리스트 선택 시 자동 닫힘
