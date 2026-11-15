# 생활기록부 근거 축적과 초안 생성 · 웹 교재

은평문화예술정보학교 교원 연수(50분 × 3차시) 교재입니다. 왼쪽 목차로 슬라이드와 복사 자료를 바로 찾고, 수식·에이전트 지침·요청 문구를 버튼 하나로 복사합니다.

## 파일 구성

| 파일 | 내용 |
| --- | --- |
| `index.html` | 교재 본문(슬라이드 34장, 노트, 복사 상자) |
| `assets/deck.css` | 슬라이드 스타일(교안과 같은 파일) |
| `assets/site.css` | 웹 교재 화면 스타일 |
| `assets/site.js` | 슬라이드 크기 맞춤, 복사 버튼, 발표 모드, 강사 설정 |
| `.nojekyll` | 깃허브 페이지에서 파일을 그대로 쓰도록 하는 빈 파일 |

## 깃허브 페이지 배포

1. 깃허브에서 새 저장소 만들기(공개)
2. 압축을 푼 파일을 저장소 최상위에 그대로 올리기(`index.html`이 최상위에 있어야 함)
3. Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, 폴더 `/ (root)` → Save
4. 1~2분 뒤 `https://<깃허브 아이디>.github.io/<저장소 이름>/` 에서 확인

## 강사 설정

`assets/site.js` 맨 위 `CONFIG`의 `observeFormCopyUrl`에 관찰노트 폼 사본 링크(…/copy)를 넣으면 ‘사본 만들기’ 버튼이 그 링크로 연결됩니다.

## 교안 슬라이드 버튼 연결 주소

웹 교재 주소 뒤에 아래 `#이름`을 붙이면 해당 복사 상자로 바로 이동합니다.

| 교안 버튼 | 주소 끝 |
| --- | --- |
| 예약 예시 요청 | `#schedule-example` |
| 관찰노트 폼 사본 만들기 | `#form-observe-copy` |
| A2 · B2 · C2 수식 | `#formula-a2` · `#formula-b2` · `#formula-c2` |
| E2 글자 수 수식 | `#formula-e2` |
| 에이전트 설명 · 지침 | `#agent-desc` · `#agent-guide` |
| 초안 · 여러 명 · 다듬기 요청 | `#prompt-draft` · `#prompt-multi` · `#prompt-refine` |

## 발표 모드

상단 ‘발표 모드’ 또는 슬라이드마다 있는 ‘발표’ 버튼. 방향키·스페이스로 넘기고 Esc로 닫습니다. 발표 화면의 복사 버튼도 그대로 동작합니다.
