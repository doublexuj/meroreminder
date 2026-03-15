# CLAUDE.md — Mero Reminder 코딩 관례

## 프로젝트 개요
Apple Reminders Web Clone. Backend(Spring Boot 4) + Frontend(Next.js).

## 빌드 & 테스트
- 빌드: `./gradlew build`
- 테스트: `./gradlew test`
- 서버 실행: `./gradlew bootRun` (port 8080)
- Frontend: `cd frontend && npm run dev` (port 3000)

## 기능 추가/수정 시 반드시 테스트 작성
- 모든 기능 변경에는 해당 기능을 검증하는 테스트를 함께 작성한다.
- 테스트 통과 확인 후 작업 완료로 간주한다.

## Backend 관례

### 패키지 구조
```
mero.ai.meroreminder
├── domain/        # Entity, Enum
├── service/
│   ├── ports/inp/ # Service 인터페이스 (입력 포트)
│   └── Default*   # Service 구현체 (Default 접두사)
├── repository/    # JpaRepository 인터페이스
├── controller/    # REST Controller
└── config/        # 설정 클래스
```

### Service 계층 관례
- 인터페이스는 `ports/inp/` 패키지에 정의 (예: `ReminderService`)
- 구현 클래스는 `service/` 패키지에 `Default` 접두사로 네이밍 (예: `DefaultReminderService`)
- Controller는 `ports/inp/` 인터페이스 타입으로 주입받음

### 코드 스타일
- Lombok 사용: `@Getter`, `@Setter`, `@NoArgsConstructor`, `@RequiredArgsConstructor`
- Entity 타임스탬프: `@PrePersist` / `@PreUpdate`로 createdAt, updatedAt 자동 관리
- Service: 클래스 레벨 `@Transactional(readOnly = true)`, 쓰기 메서드에 `@Transactional`
- Controller: `@RestController` + `@RequestMapping("/api/...")`
- HTTP 상태: 생성 `201 Created`, 삭제 `204 No Content`, 나머지 `200 OK`

### 테스트
- **Mock 테스트 사용 금지** — 모든 테스트는 `@SpringBootTest` 기반 통합 테스트로 작성
- ControllerTest: `@SpringBootTest` + `@AutoConfigureMockMvc` (Spring Boot 4: `org.springframework.boot.webmvc.test.autoconfigure` 패키지)
- ServiceTest: `@SpringBootTest` + 실제 DB(H2) 사용, `@Autowired`로 Service 주입
- `@DisplayName`으로 한글 테스트명 작성
- `@BeforeEach`에서 `deleteAll()`로 데이터 초기화

## Frontend 관례 (Phase 2부터)
- TypeScript 필수
- Tailwind CSS로 스타일링
- Apple 시스템 컬러는 CSS 변수로 관리
- 아이콘: Lucide React

## 참고 문서
- `spec.md` — 기능/UI/API 스펙
- `plan.md` — Phase별 개발 계획
- `tasks.md` — 세부 작업 체크리스트
