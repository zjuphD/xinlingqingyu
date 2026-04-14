
// State
let state = {
  step: 'intro',
  answers: Array(16).fill(null),
  impairment: null,
  answeredCount: 0,
  result: null,
  history: []
};

function loadHistory() {
  try {
    state.history = JSON.parse(localStorage.getItem('phq_demo_history') || '[]');
  } catch { state.history = []; }
}

function saveHistory(entry) {
  const h = state.history.slice();
  h.unshift(entry);
  localStorage.setItem('phq_demo_history', JSON.stringify(h.slice(0, 10)));
  state.history = h;
}

function $(s) { return document.querySelector(s); }
function $$(s) { return document.querySelectorAll(s); }

function clearApp() {
  const scrollTop = window.scrollY;
  $('#app').innerHTML = '';
  window.scrollTo(0, scrollTop);
}

// ---- INTRO ----
function buildIntro() {
  return `
    <div class="intro-brand animate-in">
      <div class="intro-logo">
        <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <!-- 太阳圆心 -->
          <circle cx="24" cy="24" r="9" fill="white" opacity="0.95"/>
          <!-- 太阳光芒 -->
          <g stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.7">
            <line x1="24" y1="4" x2="24" y2="11"/>
            <line x1="24" y1="37" x2="24" y2="44"/>
            <line x1="4" y1="24" x2="11" y2="24"/>
            <line x1="37" y1="24" x2="44" y2="24"/>
            <line x1="9.5" y1="9.5" x2="14.5" y2="14.5"/>
            <line x1="33.5" y1="33.5" x2="38.5" y2="38.5"/>
            <line x1="38.5" y1="9.5" x2="33.5" y2="14.5"/>
            <line x1="14.5" y1="33.5" x2="9.5" y2="38.5"/>
          </g>
        </svg>
      </div>
      <h1>心灵晴雨表</h1>
      <p>科学心理筛查 · 隐私完全保护</p>
    </div>

    <div class="stats-bar animate-in" style="animation-delay:0.1s">
      <div class="stat-item">
        <div class="stat-num">16</div>
        <div class="stat-label">测评题</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-num">~5</div>
        <div class="stat-label">分钟</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-num">100%</div>
        <div class="stat-label">隐私保护</div>
      </div>
    </div>

    <div class="info-card animate-in" style="animation-delay:0.15s">
      <div class="info-card-header">
        <div class="info-card-icon green">
          <svg viewBox="0 0 24 24" fill="#5A8F7B" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>
          </svg>
        </div>
        <div class="info-card-title">测评内容</div>
      </div>
      <div class="info-card-body">
        <ul class="info-list">
          <li>PHQ-9 抑郁筛查量表（9题）</li>
          <li>GAD-7 焦虑筛查量表（7题）</li>
          <li>功能受影响评估（1题）</li>
        </ul>
      </div>
    </div>

    <div class="info-card animate-in" style="animation-delay:0.2s">
      <div class="info-card-header">
        <div class="info-card-icon coral">
          <svg viewBox="0 0 24 24" fill="#E8896B" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
          </svg>
        </div>
        <div class="info-card-title">隐私说明</div>
      </div>
      <div class="info-card-body">
        <ul class="info-list">
          <li>所有作答在本地浏览器完成</li>
          <li>数据不会上传至任何服务器</li>
          <li>结果仅保存在本设备中</li>
        </ul>
      </div>
    </div>

    <div class="safety-notice animate-in" style="animation-delay:0.25s">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
      <p>如果你已有明显自伤或轻生想法，请立即拨打心理援助热线<strong>12356</strong>，或联系身边可信任的人，或直接前往最近急诊。</p>
    </div>

    <button class="cta-btn animate-in" style="animation-delay:0.3s" onclick="goToTest()">
      开始专业筛查
    </button>

    <div class="intro-footer animate-in" style="animation-delay:0.35s">
      PHQ-9 / GAD-7 为公共领域量表，免费使用<br>
      心灵晴雨表 · 筛查结果仅供参考，不构成医学诊断
    </div>
  `;
}

// ---- TEST ----
function buildTest() {
  const pct = (state.answeredCount / 16 * 100).toFixed(1);

  let html = `
    <div class="test-header">
      <div class="container">
        <div class="test-header-inner">
          <div class="test-brand">
            <div class="test-brand-dot"></div>
            心灵晴雨表
          </div>
          <div class="test-progress-info">${state.answeredCount}/16 题</div>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${pct}%"></div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- PHQ-9 section -->
      <div class="section-label animate-in">
        <span class="section-badge badge-phq9">PHQ-9</span>
        <span class="section-label-text">抑郁筛查 · 评估过去两周的症状频率</span>
      </div>
      ${PHQ9_QUESTIONS.map((q, i) => buildQuestion(i, q)).join('')}
    `;

  // GAD-7 section
  html += `
      <div class="section-label animate-in">
        <span class="section-badge badge-gad7">GAD-7</span>
        <span class="section-label-text">焦虑筛查 · 评估过去两周的焦虑体验</span>
      </div>
      ${GAD7_QUESTIONS.map((q, i) => buildQuestion(i + 9, q)).join('')}
  `;

  // Function impairment
  const impDone = state.impairment !== null;
  html += `
      <div class="section-label animate-in">
        <span class="section-badge badge-func">附加</span>
        <span class="section-label-text">功能受影响评估 · 症状对日常生活的干扰程度</span>
      </div>

      <div class="question-card animate-in">
        <div class="question-meta">
          <span class="question-num">附加题</span>
          <div class="question-done-check ${impDone ? 'show' : ''}">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </div>
        </div>
        <div class="question-text">以上问题对你的工作、处理家中事务或与人相处时，造成了多大困难？</div>
        <div class="option-list">
          ${IMPAIRMENT_OPTIONS.map(opt => `
            <div class="option-item ${state.impairment === opt.value ? 'selected' : ''}" data-value="${opt.value}" onclick="selectImpairment(${opt.value})">
              <div class="option-radio"></div>
              <span>${opt.label}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="submit-section animate-in">
        <div class="submit-hint">全部 16 题完成后可提交</div>
        <button class="submit-btn" onclick="submitTest()">查看我的测评报告</button>
      </div>
    </div>
  `;

  return html;
}

function buildQuestion(index, text) {
  const num = index + 1;
  const done = state.answers[index] !== null;
  return `
    <div class="question-card animate-in" id="qcard-${index}">
      <div class="question-meta">
        <span class="question-num">第 ${num} 题</span>
        <div class="question-done-check ${done ? 'show' : ''}">
          <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </div>
      </div>
      <div class="question-text">${text}</div>
      <div class="option-list">
        ${SCORE_OPTIONS.map((opt, oi) => `
          <div class="option-item ${state.answers[index] === opt.value ? 'selected' : ''}" data-value="${opt.value}" onclick="selectAnswer(${index}, ${opt.value})">
              <div class="option-radio"></div>
              <span>${opt.label}</span>
            </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ---- RESULT ----
function buildResult() {
  const r = state.result;
  const phqPct = (r.phq9Score / r.phq9Total * 100);
  const gadPct = (r.gad7Score / r.gad7Total * 100);
  const phqCirc = 2 * Math.PI * 37;
  const gadCirc = 2 * Math.PI * 37;
  const phqDash = (phqPct / 100) * phqCirc;
  const gadDash = (gadPct / 100) * gadCirc;
  const sevColor = (sev) => {
    if (sev === 'none' || sev === 'mild') return 'severity-green';
    if (sev === 'moderate' || sev === 'moderatelysevere') return 'severity-yellow';
    if (sev === 'severe') return 'severity-red';
    return 'severity-green';
  };

  const noticeClass = r.riskNotice.level === 'danger' ? 'danger-notice' : 'info-notice';
  const circleColor = r.riskNotice.level === 'danger' ? '#C95F5F' : (r.riskNotice.level === 'warn' ? '#D4915E' : '#5A8F7B');

  return `
    <div class="result-header animate-in">
      <div class="result-avatar">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <h2>测评完成</h2>
      <p>感谢你的作答，以下是专业解读</p>
    </div>

    <div class="container">
      <div class="score-cards">
        <div class="score-card">
          <div class="score-ring">
            <svg viewBox="0 0 80 80">
              <circle class="score-ring-bg" cx="40" cy="40" r="37"/>
              <circle class="score-ring-fill" cx="40" cy="40" r="37"
                stroke="#5A8F7B"
                stroke-dasharray="${phqDash.toFixed(1)} ${phqCirc.toFixed(1)}"
                stroke-dashoffset="0"/>
            </svg>
            <div class="score-ring-value">${r.phq9Score}<span class="score-ring-total">/${r.phq9Total}</span></div>
          </div>
          <div class="score-card-label">PHQ-9 抑郁</div>
          <div class="score-card-severity ${sevColor(r.phq9Severity.short)}">${r.phq9Severity.label}</div>
        </div>

        <div class="score-card">
          <div class="score-ring">
            <svg viewBox="0 0 80 80">
              <circle class="score-ring-bg" cx="40" cy="40" r="37"/>
              <circle class="score-ring-fill" cx="40" cy="40" r="37"
                stroke="#E8896B"
                stroke-dasharray="${gadDash.toFixed(1)} ${gadCirc.toFixed(1)}"
                stroke-dashoffset="0"/>
            </svg>
            <div class="score-ring-value">${r.gad7Score}<span class="score-ring-total">/${r.gad7Total}</span></div>
          </div>
          <div class="score-card-label">GAD-7 焦虑</div>
          <div class="score-card-severity ${sevColor(r.gad7Severity.short)}">${r.gad7Severity.label}</div>
        </div>
      </div>

      <div class="result-notice ${noticeClass} animate-in">
        <div class="result-notice-icon">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        </div>
        <div class="result-notice-body">
          <h4>${r.riskNotice.title}</h4>
          <p>${r.riskNotice.body}</p>
        </div>
      </div>

      <div class="advice-card animate-in">
        <div class="advice-card-title">
          <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          建议下一步
        </div>
        <ul class="advice-list">
          ${r.advice.map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>

      ${state.history.length > 1 ? `
      <div class="history-section animate-in">
        <div class="history-title">历史测评记录</div>
        ${state.history.slice(1, 6).map(item => `
          <div class="history-item">
            <div>
              <div class="history-info">${item.type} · ${item.label}</div>
              <div class="history-time">${item.time}</div>
            </div>
            <div class="history-scores">抑${item.phq9Score} 焦${item.gad7Score}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <div class="action-buttons animate-in">
        <button class="action-btn-primary" onclick="restart()">重新测评</button>
        <button class="action-btn-ghost" onclick="copySummary()">复制摘要</button>
      </div>
      <button class="danger-btn" onclick="clearHistory()">清空历史记录</button>

      <div class="report-cta-section animate-in">
        <div class="report-cta-text">保存完整报告</div>
        <div class="report-cta-desc">生成带时间戳的专属报告图片，长按即可保存至相册</div>
        <button class="report-generate-btn" onclick="generateReport()">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
          生成报告图片
        </button>
      </div>

      <div id="report-overlay" class="report-overlay hidden" onclick="closeReport()">
        <div class="report-container" onclick="event.stopPropagation()">
          <div class="report-actions-top">
            <button class="report-close-btn" onclick="closeReport()">×</button>
          </div>
          <div id="report-canvas-wrap">
            <!-- report image renders here -->
          </div>
          <div class="report-save-hint">长按图片即可保存至相册</div>
        </div>
      </div>

      <div class="intro-footer">本测评结果仅供参考，不构成医学诊断</div>
    </div>
  `;
}

// ---- Events ----
function goToTest() {
  state.step = 'test';
  state.answers = Array(16).fill(null);
  state.impairment = null;
  state.answeredCount = 0;
  state.result = null;
  render();
}

function selectAnswer(index, value) {
  state.answers[index] = value;
  state.answeredCount = state.answers.filter(v => v !== null).length;

  // 只更新当前题目的选项状态，不重渲染整个页面
  const card = document.getElementById('qcard-' + index);
  if (card) {
    const opts = card.querySelectorAll('.option-item');
    opts.forEach(opt => {
      opt.classList.toggle('selected', parseInt(opt.dataset.value) === value);
    });
    const check = card.querySelector('.question-done-check');
    if (check) check.classList.add('show');
  }

  // 更新进度
  const pct = (state.answeredCount / 16 * 100).toFixed(1);
  const fill = document.querySelector('.progress-fill');
  const info = document.querySelector('.test-progress-info');
  if (fill) fill.style.width = pct + '%';
  if (info) info.textContent = state.answeredCount + '/16 题';
}

function selectImpairment(value) {
  state.impairment = value;
  const cards = document.querySelectorAll('#app .question-card');
  const lastCard = cards[cards.length - 1];
  if (!lastCard) return;
  lastCard.querySelectorAll('.option-item').forEach(opt => {
    opt.classList.toggle('selected', parseInt(opt.dataset.value) === value);
  });
  const check = lastCard.querySelector('.question-done-check');
  if (check) check.classList.add('show');
}

function submitTest() {
  for (let i = 0; i < 9; i++) {
    if (state.answers[i] === null) {
      alert('请完成第 ' + (i+1) + ' 题');
      document.getElementById('qcard-' + i)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  }
  for (let i = 9; i < 16; i++) {
    if (state.answers[i] === null) {
      alert('请完成第 ' + (i+1) + ' 题');
      document.getElementById('qcard-' + i)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  }
  if (state.impairment === null) {
    alert('请填写功能受影响情况');
    return;
  }

  const phq9Score = state.answers.slice(0, 9).reduce((s, v) => s + v, 0);
  const gad7Score = state.answers.slice(9, 16).reduce((s, v) => s + v, 0);
  const q9 = state.answers[8];

  const result = buildTestResult(phq9Score, gad7Score, q9, state.impairment);
  saveHistory({
    type: 'PHQ-9+GAD-7',
    phq9Score: phq9Score,
    gad7Score: gad7Score,
    label: result.phq9Severity.short + '抑郁 + ' + result.gad7Severity.short + '焦虑',
    time: formatDate(),
    timestamp: Date.now()
  });

  state.result = result;
  state.step = 'result';
  render();
}

function copySummary() {
  const r = state.result;
  if (!r) return;
  const text = [
    '心灵晴雨表 · 心理筛查报告',
    '---------------------------',
    '抑郁筛查（PHQ-9）：' + r.phq9Score + '/' + r.phq9Total + ' · ' + r.phq9Severity.label,
    '焦虑筛查（GAD-7）：' + r.gad7Score + '/' + r.gad7Total + ' · ' + r.gad7Severity.label,
    '---------------------------',
    r.highlight,
    '（本结果仅供参考，不构成医学诊断）'
  ].join('\n');
  navigator.clipboard.writeText(text).then(() => alert('报告已复制到剪贴板')).catch(() => alert('复制失败，请手动复制'));
}

function restart() {
  state.step = 'intro';
  state.answers = Array(16).fill(null);
  state.impairment = null;
  state.answeredCount = 0;
  state.result = null;
  render();
}

function clearHistory() {
  if (confirm('确定要清空所有历史记录吗？')) {
    localStorage.removeItem('phq_demo_history');
    state.history = [];
    render();
    alert('已清空');
  }
}

// ---- Render ----
function render() {
  clearApp();
  const app = $('#app');
  if (state.step === 'intro') {
    app.innerHTML = buildIntro();
  } else if (state.step === 'test') {
    app.innerHTML = buildTest();
  } else if (state.step === 'result') {
    app.innerHTML = buildResult();
  }
}

// ---- Report Generation ----
function generateReport() {
  const r = state.result;
  const now = new Date();
  const dateStr = now.getFullYear() + '年' + pad(now.getMonth()+1) + '月' + pad(now.getDate()) + '日 ' + pad(now.getHours()) + ':' + pad(now.getMinutes());

  // 各维度得分映射
  const phq9Items = [
    '做事毫无兴趣', '情绪低落', '睡眠问题', '疲倦乏力', '饮食问题',
    '自我否定', '注意力难集中', '行动迟缓/坐立不安', '自伤/自杀念头'
  ];
  const gad7Items = [
    '紧张焦虑感', '无法控制担忧', '过度担忧', '难以放松', '坐立不安',
    '易怒烦躁', '害怕感'
  ];

  const phq9Bars = r.answers.slice(0, 9).map((v, i) => {
    const labels = ['完全没有', '有几天', '一半以上', '几乎每天'];
    const label = v !== null ? labels[v] : '未作答';
    const pct = v !== null ? (v / 3 * 100) : 0;
    return `<div class="r-bar-item">
      <div class="r-bar-label">${i+1}. ${phq9Items[i]}</div>
      <div class="r-bar-track"><div class="r-bar-fill r-bar-phq9" style="width:${pct}%"></div></div>
      <div class="r-bar-val">${v !== null ? labels[v] : '—'}</div>
    </div>`;
  }).join('');

  const gad7Bars = r.answers.slice(9, 16).map((v, i) => {
    const labels = ['完全没有', '有几天', '一半以上', '几乎每天'];
    return `<div class="r-bar-item">
      <div class="r-bar-label">${i+1}. ${gad7Items[i]}</div>
      <div class="r-bar-track"><div class="r-bar-fill r-bar-gad7" style="width:${v !== null ? (v/3*100) : 0}%"></div></div>
      <div class="r-bar-val">${v !== null ? labels[v] : '—'}</div>
    </div>`;
  }).join('');

  // 历史对比
  const historyRows = state.history.slice(0, 4).map((item, idx) => {
    const d = new Date(item.timestamp);
    const dstr = d.getMonth()+1 + '/' + d.getDate() + ' ' + d.getHours() + ':' + pad(d.getMinutes());
    return `<div class="r-history-row">
      <div class="r-history-date">${idx === 0 ? '本次' : dstr}</div>
      <div class="r-history-score"><span style="color:#5A8F7B;font-weight:700">抑${item.phq9Score}</span> / <span style="color:#E8896B;font-weight:700">焦${item.gad7Score}</span></div>
      <div class="r-history-sev">${item.label}</div>
    </div>`;
  }).join('');

  const adviceHtml = r.advice.map(a => `<div class="r-advice-item">→ ${a}</div>`).join('');

  // 严重度等级说明
  const sevExplain = (label, min, max, desc) =>
    `<div class="r-sev-card r-sev-${label}">
      <div class="r-sev-card-score">${min}${max ? '–'+max : '+'}分</div>
      <div class="r-sev-card-label">${sevLabel(label)}</div>
      <div class="r-sev-card-desc">${desc}</div>
    </div>`;

  const sevLabel = (l) => ({none:'几乎无', mild:'轻度', moderate:'中度', moderatelysevere:'中重度', severe:'重度'}[l] || l);

  const reportHTML = `
    <div class="r-page">
      <div class="r-header">
        <div class="r-logo-wrap">
          <div class="r-logo">
            <svg viewBox="0 0 48 48" width="40" height="40">
              <circle cx="24" cy="24" r="9" fill="white" opacity="0.95"/>
              <g stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.7">
                <line x1="24" y1="4" x2="24" y2="11"/><line x1="24" y1="37" x2="24" y2="44"/>
                <line x1="4" y1="24" x2="11" y2="24"/><line x1="37" y1="24" x2="44" y2="24"/>
                <line x1="9.5" y1="9.5" x2="14.5" y2="14.5"/><line x1="33.5" y1="33.5" x2="38.5" y2="38.5"/>
                <line x1="38.5" y1="9.5" x2="33.5" y2="14.5"/><line x1="14.5" y1="33.5" x2="9.5" y2="38.5"/>
              </g>
            </svg>
          </div>
          <div>
            <div class="r-brand-text">心灵晴雨表</div>
            <div class="r-subtitle">心理健康筛查报告</div>
          </div>
        </div>
        <div class="r-meta">
          <div class="r-meta-row">
            <div class="r-meta-chip">PHQ-9 + GAD-7 联合筛查</div>
            <div class="r-meta-chip">${dateStr}</div>
          </div>
          <div class="r-meta-row">
            <div class="r-meta-chip">报告编号 MW-${Math.random().toString(36).slice(2,8).toUpperCase()}</div>
          </div>
        </div>
      </div>

      <!-- 总分仪表 -->
      <div class="r-gauge-row">
        <div class="r-gauge-card">
          <div class="r-gauge-title">抑郁筛查 PHQ-9</div>
          <div class="r-gauge-num" style="color:#5A8F7B">${r.phq9Score}<span class="r-gauge-total">/${r.phq9Total}</span></div>
          <div class="r-gauge-bar">
            <div class="r-gauge-track">
              <div class="r-gauge-fill" style="width:${r.phq9Score/r.phq9Total*100}%;background:linear-gradient(90deg,#5A8F7B,#E8896B)"></div>
              <div class="r-gauge-marker" style="left:${Math.min(100, r.phq9Score/r.phq9Total*100)}%"></div>
            </div>
            <div class="r-gauge-range"><span>0</span><span>27</span></div>
          </div>
          <div class="r-gauge-sev-badge r-badge-${r.phq9Severity.short}">${r.phq9Severity.label}</div>
          <div class="r-gauge-desc">${r.phq9Severity.desc}</div>
        </div>

        <div class="r-gauge-card">
          <div class="r-gauge-title">焦虑筛查 GAD-7</div>
          <div class="r-gauge-num" style="color:#E8896B">${r.gad7Score}<span class="r-gauge-total">/${r.gad7Total}</span></div>
          <div class="r-gauge-bar">
            <div class="r-gauge-track">
              <div class="r-gauge-fill" style="width:${r.gad7Score/r.gad7Total*100}%;background:linear-gradient(90deg,#E8896B,#D4915E)"></div>
              <div class="r-gauge-marker" style="left:${Math.min(100, r.gad7Score/r.gad7Total*100)}%"></div>
            </div>
            <div class="r-gauge-range"><span>0</span><span>21</span></div>
          </div>
          <div class="r-gauge-sev-badge r-badge-${r.gad7Severity.short}">${r.gad7Severity.label}</div>
          <div class="r-gauge-desc">${r.gad7Severity.desc}</div>
        </div>
      </div>

      <!-- 严重度等级参考 -->
      <div class="r-section-title">PHQ-9 分数含义</div>
      <div class="r-sev-grid">
        <div class="r-sev-item"><div class="r-sev-dot" style="background:#8BC9A6"></div><div><div class="r-sev-range">0–4 分</div><div class="r-sev-name">几乎无抑郁</div></div></div>
        <div class="r-sev-item"><div class="r-sev-dot" style="background:#F5D76E"></div><div><div class="r-sev-range">5–9 分</div><div class="r-sev-name">轻度抑郁</div></div></div>
        <div class="r-sev-item"><div class="r-sev-dot" style="background:#F0A050"></div><div><div class="r-sev-range">10–14 分</div><div class="r-sev-name">中度抑郁</div></div></div>
        <div class="r-sev-item"><div class="r-sev-dot" style="background:#E07858"></div><div><div class="r-sev-range">15–19 分</div><div class="r-sev-name">中重度抑郁</div></div></div>
        <div class="r-sev-item"><div class="r-sev-dot" style="background:#C95F5F"></div><div><div class="r-sev-range">20–27 分</div><div class="r-sev-name">重度抑郁</div></div></div>
      </div>

      <div class="r-section-title">GAD-7 分数含义</div>
      <div class="r-sev-grid">
        <div class="r-sev-item"><div class="r-sev-dot" style="background:#8BC9A6"></div><div><div class="r-sev-range">0–4 分</div><div class="r-sev-name">几乎无焦虑</div></div></div>
        <div class="r-sev-item"><div class="r-sev-dot" style="background:#F5D76E"></div><div><div class="r-sev-range">5–9 分</div><div class="r-sev-name">轻度焦虑</div></div></div>
        <div class="r-sev-item"><div class="r-sev-dot" style="background:#F0A050"></div><div><div class="r-sev-range">10–14 分</div><div class="r-sev-name">中度焦虑</div></div></div>
        <div class="r-sev-item"><div class="r-sev-dot" style="background:#E07858"></div><div><div class="r-sev-range">15–21 分</div><div class="r-sev-name">重度焦虑</div></div></div>
      </div>

      <!-- 各题得分 -->
      <div class="r-section-title">PHQ-9 各题详情</div>
      <div class="r-bar-list">${phq9Bars}</div>

      <div class="r-section-title">GAD-7 各题详情</div>
      <div class="r-bar-list">${gad7Bars}</div>

      <!-- 综合解读 -->
      <div class="r-section-title">综合解读</div>
      <div class="r-highlight">${r.highlight}</div>
      ${r.gad7Highlight ? `<div class="r-highlight" style="margin-top:8px;color:#7A9185;font-size:12px">${r.gad7Highlight}</div>` : ''}

      <!-- 功能受损 -->
      <div class="r-section-title">日常功能影响</div>
      <div class="r-impair-card">
        <div class="r-impair-label">${['', '完全没有困难', '有一些困难', '非常困难', '极度困难'][r.impairment] || '未填写'}</div>
        <div class="r-impair-bar">
          <div class="r-impair-track">
            <div class="r-impair-fill" style="width:${r.impairment ? (r.impairment/4*100) : 0}%;background:#D4915E"></div>
          </div>
          <div class="r-impair-range"><span>无影响</span><span>严重影响</span></div>
        </div>
      </div>

      ${r.hasSafetyConcern ? `
      <div class="r-danger-box">
        <div class="r-danger-title">⚠️ 安全提示</div>
        <div class="r-danger-body">你在第9题（"想到自己最好去死或者自残"）选择了非"从来没有"。这不代表一定存在迫切危险，但属于必须认真对待的信号。</div>
        <div class="r-danger-action">建议尽快联系专业心理评估。若感到无法保证自身安全，请立即拨打 <strong>12356</strong>、<strong>120</strong>、<strong>110</strong>，或前往最近急诊。</div>
      </div>` : ''}

      <!-- 历史对比 -->
      ${state.history.length > 1 ? `
      <div class="r-section-title">历史对比</div>
      <div class="r-history-list">${historyRows}</div>` : ''}

      <!-- 建议 -->
      <div class="r-section-title">建议下一步</div>
      <div class="r-advice-list">${adviceHtml}</div>

      <!-- 免责声明 -->
      <div class="r-disclaimer">
        本报告由 PHQ-9 / GAD-7 量表筛查结果生成，仅供参考，不构成医学诊断。如有需要，请咨询专业心理或精神科医生。
      </div>

      <div class="r-footer">
        <div class="r-footer-brand">心灵晴雨表 · 专业心理健康筛查</div>
        <div class="r-footer-url">xinlingqingyu.com</div>
      </div>
    </div>
  `;

  const wrap = document.getElementById('report-canvas-wrap');
  wrap.innerHTML = '<div id="report-el">' + reportHTML + '</div>';
  const overlay = document.getElementById('report-overlay');
  overlay.classList.remove('hidden');

  if (typeof html2canvas === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    script.onload = () => renderReportImg();
    script.onerror = () => alert('加载报告生成器失败，请检查网络后重试');
    document.head.appendChild(script);
  } else {
    renderReportImg();
  }
}

function renderReportImg() {
  const el = document.getElementById('report-el');
  html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#F6F8F5',
    width: el.offsetWidth,
    height: el.offsetHeight
  }).then(canvas => {
    canvas.id = 'report-img';
    const wrap = document.getElementById('report-canvas-wrap');
    wrap.innerHTML = '';

    // 保存按钮
    const btnWrap = document.createElement('div');
    btnWrap.style.cssText = 'padding:16px 20px 8px;display:flex;gap:12px;';

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '下载图片';
    downloadBtn.style.cssText = 'flex:1;background:#5A8F7B;color:white;border:none;border-radius:12px;padding:14px;font-size:15px;font-weight:700;font-family:"PingFang SC","Microsoft YaHei",sans-serif;cursor:pointer;';

    const shareBtn = document.createElement('button');
    shareBtn.textContent = '分享';
    shareBtn.style.cssText = 'flex:1;background:#E8896B;color:white;border:none;border-radius:12px;padding:14px;font-size:15px;font-weight:700;font-family:"PingFang SC","Microsoft YaHei",sans-serif;cursor:pointer;';

    btnWrap.appendChild(downloadBtn);
    btnWrap.appendChild(shareBtn);

    // 下载
    downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = '心灵晴雨表报告_' + new Date().toISOString().slice(0,10) + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });

    // 分享（支持分享API的平台）
    shareBtn.addEventListener('click', () => {
      canvas.toBlob(blob => {
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'report.png', { type: 'image/png' })] })) {
          navigator.share({ files: [new File([blob], 'report.png', { type: 'image/png' })], title: '心灵晴雨表报告', text: '我的心理健康筛查报告' });
        } else {
          // 不支持分享就复制到剪贴板
          const item = new ClipboardItem({ 'image/png': blob });
          navigator.clipboard.write([item]).then(() => alert('已复制到剪贴板')).catch(() => alert('分享不可用，请长按图片保存'));
        }
      }, 'image/png');
    });

    wrap.appendChild(btnWrap);
    wrap.appendChild(canvas);

    // 更新底部提示
    const hint = document.querySelector('.report-save-hint');
    if (hint) hint.textContent = '或长按图片直接保存';
  }).catch(() => {
    alert('报告生成失败，请稍后重试');
  });
}

function closeReport() {
  document.getElementById('report-overlay').classList.add('hidden');
}

// ---- Boot ----
loadHistory();
render();
