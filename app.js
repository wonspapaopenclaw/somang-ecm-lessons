const app = document.querySelector("#app");
const crumbs = {
  months: document.querySelector('[data-view="months"]'),
  weeks: document.querySelector('[data-view="weeks"]'),
  lesson: document.querySelector('[data-view="lesson"]')
};

const state = {
  data: null,
  monthKey: null,
  week: null,
  grade: null
};

const gradeLabels = {
  low: "저학년",
  high: "고학년"
};

const gradeClass = {
  low: "low",
  high: "high"
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setCrumbs(view) {
  crumbs.weeks.disabled = !state.monthKey;
  crumbs.lesson.disabled = !(state.monthKey && state.week && state.grade);

  crumbs.months.setAttribute("aria-current", view === "months" ? "page" : "false");
  crumbs.weeks.setAttribute("aria-current", view === "weeks" ? "page" : "false");
  crumbs.lesson.setAttribute("aria-current", view === "lesson" ? "page" : "false");
}

function monthLabel(month) {
  return `${month.year}년 ${month.month}월`;
}

function renderMonths() {
  setCrumbs("months");
  state.monthKey = null;
  state.week = null;
  state.grade = null;

  const months = Object.entries(state.data.months);
  app.innerHTML = `
    <section class="panel">
      <h2 class="section-title">월별 공과</h2>
      <p class="section-note">필요한 달을 선택하세요.</p>
      <div class="month-grid">
        ${months.map(([key, month]) => `
          <button class="card-button" type="button" data-month="${escapeHtml(key)}">
            <strong>${escapeHtml(monthLabel(month))}</strong>
            <span>${escapeHtml(month.title)}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;

  app.querySelectorAll("[data-month]").forEach((button) => {
    button.addEventListener("click", () => {
      state.monthKey = button.dataset.month;
      renderWeeks();
    });
  });
}

function renderWeeks() {
  setCrumbs("weeks");
  state.week = null;
  state.grade = null;

  const month = state.data.months[state.monthKey];
  app.innerHTML = `
    <section class="panel">
      <h2 class="section-title">${escapeHtml(monthLabel(month))}</h2>
      <p class="section-note">${escapeHtml(month.title)} · 주차를 고른 뒤 저학년 또는 고학년 자료를 여세요.</p>
      <div class="week-list">
        ${month.weeks.map((week) => `
          <article class="lesson-card">
            <p class="week-kicker">${escapeHtml(week.week)}주</p>
            <h3>${escapeHtml(week.story)}</h3>
            <div class="lesson-meta">
              <span>본문: ${escapeHtml(week.reference)}</span>
              <span>Bottom Line: ${escapeHtml(week.bottomLine)}</span>
            </div>
            <div class="grade-grid">
              ${Object.keys(gradeLabels).map((grade) => `
                <button class="card-button grade-button ${gradeClass[grade]}" type="button" data-week="${week.week}" data-grade="${grade}">
                  <strong>${gradeLabels[grade]} 공과 보기</strong>
                  <span>${escapeHtml(week.grades[grade].activity)}</span>
                </button>
              `).join("")}
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;

  app.querySelectorAll("[data-week][data-grade]").forEach((button) => {
    button.addEventListener("click", () => {
      state.week = Number(button.dataset.week);
      state.grade = button.dataset.grade;
      renderLesson();
    });
  });
}

function renderLesson() {
  setCrumbs("lesson");

  const month = state.data.months[state.monthKey];
  const week = month.weeks.find((item) => item.week === state.week);
  const grade = week.grades[state.grade];
  const pdfUrl = grade.pdf;
  const lessonUrl = `${pdfUrl}#page=${grade.lessonPage}`;
  const activityUrl = `${pdfUrl}#page=${grade.activityPage}`;

  app.innerHTML = `
    <section class="panel lesson-detail">
      <div>
        <p class="week-kicker">${escapeHtml(monthLabel(month))} · ${escapeHtml(week.week)}주 · ${escapeHtml(gradeLabels[state.grade])}</p>
        <h2 class="section-title">${escapeHtml(week.story)}</h2>
        <p class="section-note">${escapeHtml(month.title)}</p>
      </div>

      <dl class="detail-list">
        <div>
          <dt>Bible Story</dt>
          <dd>${escapeHtml(week.story)}</dd>
        </div>
        <div>
          <dt>Bible Reference</dt>
          <dd>${escapeHtml(week.reference)}</dd>
        </div>
        ${week.videoUrl ? `
        <div>
          <dt>Today's Bible Story</dt>
          <dd><a class="video-link" href="${escapeHtml(week.videoUrl)}" target="_blank" rel="noopener">영상</a></dd>
        </div>
        ` : ''}
        <div>
          <dt>Memory Verse</dt>
          <dd>${escapeHtml(week.memoryVerse)}</dd>
        </div>
        <div>
          <dt>Bottom Line</dt>
          <dd>${escapeHtml(week.bottomLine)}</dd>
        </div>
        <div>
          <dt>Virtue</dt>
          <dd>${escapeHtml(week.virtue)}</dd>
        </div>
        <div>
          <dt>Activity</dt>
          <dd>${escapeHtml(grade.activity)}</dd>
        </div>
      </dl>

      <div class="actions three">
        <a class="action-link primary" href="${escapeHtml(lessonUrl)}" target="_blank" rel="noopener">공과 PDF 보기</a>
        <a class="action-link secondary" href="${escapeHtml(activityUrl)}" target="_blank" rel="noopener">활동지 보기</a>
        <a class="action-link download" href="${escapeHtml(pdfUrl)}" download>전체 PDF 다운로드</a>
      </div>

      <p class="helper-text">브라우저에 따라 지정한 페이지 대신 PDF 첫 페이지가 열릴 수 있습니다. 그럴 때는 공과 ${grade.lessonPage}쪽, 활동지 ${grade.activityPage}쪽을 확인하세요.</p>
    </section>
  `;
}

crumbs.months.addEventListener("click", renderMonths);
crumbs.weeks.addEventListener("click", () => {
  if (state.monthKey) renderWeeks();
});
crumbs.lesson.addEventListener("click", () => {
  if (state.monthKey && state.week && state.grade) renderLesson();
});

fetch("data/lessons.json")
  .then((response) => {
    if (!response.ok) throw new Error("자료 파일을 불러오지 못했습니다.");
    return response.json();
  })
  .then((data) => {
    state.data = data;
    renderMonths();
  })
  .catch((error) => {
    app.innerHTML = `<div class="error">${escapeHtml(error.message)}</div>`;
  });
