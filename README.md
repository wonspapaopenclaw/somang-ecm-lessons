# 소망교회 영어아동부 공과 사이트

GitHub Pages에 바로 올릴 수 있는 정적 웹사이트입니다.

## 폴더 구조

```text
somang-ecm-site/
├─ index.html
├─ style.css
├─ app.js
├─ data/
│  └─ lessons.json
└─ pdf/
   └─ 2026/
      └─ 10/
         ├─ low.pdf
         └─ high.pdf
```

## 사용 방법

1. 이 폴더 전체를 GitHub 저장소에 올립니다.
2. 저장소 Settings에서 Pages를 켭니다.
3. Branch를 `main`, folder를 `/root`로 선택합니다.
4. 공개된 Pages 주소로 접속하면 됩니다.

## 다음 달 자료 추가

### 자동 스크립트 사용 (권장)
```bash
python add_month.py 2026 11 "The Thankful Heart" "God gives us grateful hearts."
```
- `pdf/2026/11/` 폴더 자동 생성
- `data/lessons.json`에 4주차 템플릿 자동 추가
- 이후 `low.pdf`, `high.pdf`를 해당 폴더에 넣고 JSON에서 세부 내용 수정

### 수동 방법
새 PDF를 `pdf/2026/11/low.pdf`, `pdf/2026/11/high.pdf`처럼 넣고, `data/lessons.json`에 11월 데이터를 추가하면 됩니다.
