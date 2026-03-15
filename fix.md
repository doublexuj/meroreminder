# Code Review Fix Tasks

---

## Backend

### 버그/정확성

- [x] `ReminderRepository.deleteByReminderListId`에 `@Modifying` 어노테이션 추가
- [x] `DefaultReminderService.update()` — `Map<String, Object>` unsafe cast를 안전한 타입 변환으로 교체
- [x] `DefaultReminderService.update()` — `Priority.valueOf()` 잘못된 값 처리 (`IllegalArgumentException` 핸들링)
- [x] `DefaultReminderService.update()` — `LocalDate.parse()` / `LocalTime.parse()` 예외 처리 (`DateTimeParseException` 핸들링)
- [x] `ReminderController.create()` — `title` null 검증 추가

### 보안

- [x] `application.properties` — H2 Console을 dev 프로파일에서만 활성화
- [x] 컨트롤러 입력 유효성 검증 추가 — 문자열 길이 제한, null 체크 등
- [x] `WebConfig` — `allowedHeaders("*")` 를 필요한 헤더만 허용하도록 변경
- [ ] 인증/인가 레이어 추가 (향후 과제)

### 성능

- [x] `DefaultReminderListService.findAllWithCount()` — N+1 쿼리를 단일 JOIN + GROUP BY 쿼리로 교체
- [x] `DefaultReminderService.findAll()` — 메모리 내 정렬을 DB `ORDER BY`로 변경
- [ ] 리마인더 목록 조회에 페이지네이션(`Pageable`) 지원 추가
- [x] `DefaultReminderService.getSummary()` — 5개 개별 count 쿼리를 단일 쿼리로 통합

### 설계/아키텍처

- [x] `@ControllerAdvice` 전역 예외 핸들러 추가 — 적절한 HTTP 상태 코드 및 에러 응답 구조화
- [x] 요청 바디를 `Map<String, Object>` 에서 DTO 클래스로 교체 + Bean Validation (`@Valid`, `@NotBlank`, `@Size` 등) 적용
- [ ] JPA 엔티티 직접 반환 대신 Response DTO 도입 — API 계약과 DB 스키마 분리
- [x] 엔티티 `@Setter` 범위 축소 — `id`, `createdAt`, `updatedAt`에 setter 제거
- [x] 엔티티 문자열 필드에 `@Column(length = ...)` 제약 추가
- [ ] `Reminder.getListId()` — LAZY 프록시 의존 대신 `@Column(insertable = false, updatable = false)` 필드 도입
- [ ] 서비스/컨트롤러에 로깅 추가
- [ ] `ddl-auto=update` — 프로덕션 대비 Flyway 또는 Liquibase 마이그레이션 도입 (향후 과제)

---

## Frontend

### 버그

- [x] `ReminderList.tsx` — `prevIdsRef`를 새 ID 발견 여부에 관계없이 항상 업데이트하도록 수정
- [x] `page.tsx` `handleToggle` — `setTimeout` race condition 수정 (cleanup 함수, 언마운트 방어)
- [x] `page.tsx` `handleDelete` — API 호출을 `setTimeout` 바깥으로 이동, 낙관적 업데이트 구조 개선
- [x] `ReminderDetail.tsx` — 날짜/시간 입력 `onChange`에서 API 호출 → `onBlur`로 변경
- [x] `ReminderDetail.tsx` — 부모 prop 변경 시 로컬 state 동기화 (`useEffect` 또는 `key` prop 활용)
- [x] `ReminderItem.tsx` — `justChecked` state 리셋 로직 추가

### 아키텍처/설계

- [ ] `page.tsx` God Component 분리 — `useReminders`, `useLists` 등 커스텀 훅 추출 또는 `useReducer` 적용
- [ ] `isSmartListSelected` + `smartListType` + `selectedListId` → discriminated union 단일 state로 통합
- [ ] `COLORS` 상수를 `ListModal.tsx`에서 `lib/colors.ts`로 분리
- [ ] `api.ts` — API base URL을 환경변수(`NEXT_PUBLIC_API_BASE`)로 변경
- [ ] `api.ts` — GET 요청에 불필요한 `Content-Type: application/json` 헤더 제거
- [ ] `api.ts` — `undefined as T` 타입 캐스팅 제거, void 반환 엔드포인트 별도 처리
- [ ] React Error Boundary 추가

### 접근성 (A11y)

- [ ] `ListModal.tsx` — 포커스 트랩 추가, `role="dialog"`, `aria-modal="true"` 설정
- [ ] `ReminderItem.tsx` — 체크 버튼에 `aria-label` 추가 ("완료로 표시" / "미완료로 표시")
- [ ] `page.tsx` — 햄버거 메뉴 버튼에 `aria-label="메뉴 열기"` 추가
- [ ] `ListModal.tsx` — 색상 팔레트 버튼에 `aria-label={색상이름}` 추가
- [ ] `Sidebar.tsx` — 컨텍스트 메뉴에 `role="menu"`, 항목에 `role="menuitem"` 추가
- [ ] `ReminderDetail.tsx` — 폼 입력에 `<label>` 요소 추가
- [ ] `Toast.tsx` — `role="alert"` 또는 `aria-live="polite"` 추가
- [ ] 사이드바 오버레이 — `Escape` 키로 닫기 지원

### 성능

- [ ] 핸들러 함수 안정화 (`useCallback`) + 자식 컴포넌트에 `React.memo` 적용
- [ ] `todayDate` — `useMemo`로 불필요한 재계산 방지

### CSS/테마

- [ ] `bg-white` 하드코딩 → `bg-[var(--color-bg-primary)]`로 교체 (Sidebar, ListModal, 컨텍스트 메뉴)
- [ ] 스마트 리스트 카드/설정 내 hex 직접 사용 → CSS 변수 참조로 통일
- [ ] 매직넘버 픽셀값 (`pl-[52px]`, `w-[280px]` 등) → 공유 상수 또는 CSS 변수로 정의
