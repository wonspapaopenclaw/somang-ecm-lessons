#!/usr/bin/env python3
"""
소망교회 영어아동부 공과 사이트 - 새 월 추가 스크립트
사용법: python add_month.py 2026 11 "월 제목" "월 요약"
"""

import json
import sys
import os
from pathlib import Path

def add_month(year: int, month: int, title: str, summary: str):
    base_dir = Path(__file__).parent
    data_file = base_dir / "data" / "lessons.json"
    pdf_dir = base_dir / "pdf" / str(year) / f"{month:02d}"
    
    # PDF 디렉토리 생성
    pdf_dir.mkdir(parents=True, exist_ok=True)
    print(f"✅ PDF 디렉토리 생성: {pdf_dir}")
    print(f"   이곳에 low.pdf, high.pdf 파일을 넣으세요.")
    
    # 기존 데이터 로드
    with open(data_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    month_key = f"{year}-{month:02d}"
    
    if month_key in data["months"]:
        print(f"⚠️  {month_key} 이미 존재합니다. 덮어쓰시겠습니까? (y/n)")
        if input().lower() != 'y':
            print("취소됨")
            return
    
    # 주차 템플릿 (4주차 기본)
    weeks_template = []
    for week in range(1, 5):
        weeks_template.append({
            "week": week,
            "story": f"{week}주차 성경 이야기",
            "reference": "성경 구절",
            "memoryVerse": "암송 구절",
            "bottomLine": "핵심 메시지",
            "virtue": "덕목",
            "grades": {
                "low": {
                    "activity": f"{week}주차 저학년 활동",
                    "pdf": f"pdf/{year}/{month:02d}/low.pdf",
                    "lessonPage": 2 * week - 0,  # 사용자 수정 필요
                    "activityPage": 2 * week + 1  # 사용자 수정 필요
                },
                "high": {
                    "activity": f"{week}주차 고학년 활동",
                    "pdf": f"pdf/{year}/{month:02d}/high.pdf",
                    "lessonPage": 2 * week - 0,  # 사용자 수정 필요
                    "activityPage": 2 * week + 1  # 사용자 수정 필요
                }
            }
        })
    
    # 새 월 데이터 추가
    data["months"][month_key] = {
        "year": year,
        "month": month,
        "title": title,
        "summary": summary,
        "weeks": weeks_template
    }
    
    # JSON 저장 (한글 유지, 들여쓰기 2)
    with open(data_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ {month_key} 월 데이터 추가 완료: {data_file}")
    print(f"")
    print(f"📝 다음 단계:")
    print(f"1. {pdf_dir}/ 에 low.pdf, high.pdf 넣기")
    print(f"2. {data_file} 열어서 각 주차의 story, reference, memoryVerse, bottomLine, virtue 수정")
    print(f"3. 각 grade의 lessonPage, activityPage 페이지 번호 수정 (PDF 실제 페이지에 맞게)")

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("사용법: python add_month.py <년도> <월> <제목> <요약>")
        print("예시: python add_month.py 2026 11 \"The Thankful Heart\" \"God gives us grateful hearts.\"")
        sys.exit(1)
    
    year = int(sys.argv[1])
    month = int(sys.argv[2])
    title = sys.argv[3]
    summary = sys.argv[4]
    
    add_month(year, month, title, summary)