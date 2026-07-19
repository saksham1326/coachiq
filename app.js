// app.js — UI rendering and interaction logic

let analysisResult = null;

// === Tab switching ===
function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(`tab-${tabName}`).classList.remove('hidden');
}

// === Review handler ===
function handleReview(section, action) {
  const el = document.getElementById(`review-status-${section}`);
  const labels = { approve: 'Approved ✓', edit: 'Marked for Edit ✎', reject: 'Rejected ✕' };
  const classes = { approve: 'approved', edit: 'edited', reject: 'rejected' };
  el.textContent = labels[action];
  el.className = `review-status ${classes[action]}`;
}

// === Confidence tag ===
function confTag(level) {
  const labels = { confirmed: 'Confirmed', reported: 'Client-Reported', inferred: 'AI Inference', missing: 'Missing Data' };
  return `<span class="conf-tag ${level}">${labels[level] || level}</span>`;
}

// === Run Analysis ===
function runAnalysis() {
  const btn = document.getElementById('btn-analyze');
  btn.disabled = true;
  btn.innerHTML = '<div class="status-spinner" style="width:14px;height:14px;border-width:2px;"></div> Analysing...';

  const status = document.getElementById('analysis-status');
  const statusText = document.getElementById('status-text');
  status.classList.remove('hidden', 'success');
  statusText.textContent = 'Parsing conversation data...';

  // Simulate staged analysis
  const stages = [
    { text: 'Extracting health metrics...', delay: 600 },
    { text: 'Identifying patterns and risks...', delay: 1200 },
    { text: 'Building evidence map...', delay: 1800 },
    { text: 'Generating recommendations...', delay: 2400 },
    { text: 'Analysis complete ✓', delay: 3000 }
  ];

  stages.forEach(s => {
    setTimeout(() => { statusText.textContent = s.text; }, s.delay);
  });

  setTimeout(() => {
    analysisResult = analyseConversation(CONVERSATION);
    renderAll(analysisResult);
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('tab-nav').classList.remove('hidden');
    status.classList.add('success');
    btn.disabled = false;
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h4l2-4 2 6 2-2h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Re-Analyse';
    switchTab('overview');
  }, 3200);
}

// === Render all tabs ===
function renderAll(r) {
  renderOverview(r);
  renderMetrics(r);
  renderInsights(r);
  renderActions(r);
  renderEvidence(r);
  renderConversation();
}

// === Overview ===
function renderOverview(r) {
  const s = r.weeklySummary;
  const cards = [
    { icon: '📊', bg: 'var(--accent-bg)', title: 'Overall Progress', sub: 'Week 1 Summary', value: s.headline, detail: `Progress: <strong>${s.overallProgress}</strong> ${confTag(s.confidence)}` },
    { icon: '😊', bg: 'var(--cyan-bg)', title: 'Mood Trajectory', sub: 'Emotional Pattern', value: s.moodTrajectory, detail: confTag(s.moodConfidence) },
    { icon: '🍽️', bg: 'var(--amber-bg)', title: 'Nutrition', sub: 'Adherence Score', value: `${r.nutrition.adherenceScore}%`, detail: `Overall: ${r.nutrition.overallAdherence} ${confTag(r.nutrition.confidence)}` },
    { icon: '🏃', bg: 'var(--green-bg)', title: 'Exercise', sub: 'Adherence Score', value: `${r.exercise.adherenceScore}%`, detail: `Overall: ${r.exercise.overallAdherence} ${confTag(r.exercise.confidence)}` },
    { icon: '😴', bg: 'var(--purple-bg)', title: 'Sleep', sub: 'Quality Score', value: `${r.sleep.qualityScore}%`, detail: `Avg: ~${r.sleep.averageHours} hrs ${confTag(r.sleep.averageConfidence)}` },
    { icon: '💧', bg: 'var(--blue-bg)', title: 'Water', sub: 'Tracking Score', value: `${r.water.adherenceScore}%`, detail: `Overall: ${r.water.overallAdherence} ${confTag(r.water.confidence)}` },
    { icon: '⚡', bg: 'var(--green-bg)', title: 'Engagement', sub: 'Client Participation', value: `${r.engagement.engagementScore}%`, detail: `Level: ${r.engagement.overallLevel} ${confTag(r.engagement.confidence)}` },
    { icon: '⚠️', bg: 'var(--red-bg)', title: 'Risk Flags', sub: 'Attention Required', value: `${r.riskFlags.flags.length} flags`, detail: `High: ${r.riskFlags.flags.filter(f=>f.severity==='high').length} · Medium: ${r.riskFlags.flags.filter(f=>f.severity==='medium').length}` }
  ];

  let html = '';
  cards.forEach((c, i) => {
    html += `<div class="summary-card animate-in" style="animation-delay:${i*0.05}s">
      <div class="summary-card-header">
        <div class="card-icon" style="background:${c.bg}">${c.icon}</div>
        <div><div class="card-title">${c.title}</div><div class="card-subtitle">${c.sub}</div></div>
      </div>
      <div class="summary-value">${c.value}</div>
      <div class="summary-detail">${c.detail}</div>
    </div>`;
  });

  // Key positives and concerns
  html += `<div class="summary-card animate-in" style="grid-column: 1 / -1;">
    <div class="summary-card-header"><div class="card-icon" style="background:var(--green-bg)">✅</div><div><div class="card-title">Key Positives</div></div></div>
    <ul class="summary-detail" style="padding-left:18px;">${s.keyPositives.map(p => `<li>${p.text} ${confTag(p.confidence)}</li>`).join('')}</ul>
  </div>`;
  html += `<div class="summary-card animate-in" style="grid-column: 1 / -1;">
    <div class="summary-card-header"><div class="card-icon" style="background:var(--red-bg)">🔴</div><div><div class="card-title">Key Concerns</div></div></div>
    <ul class="summary-detail" style="padding-left:18px;">${s.keyConcerns.map(c => `<li>${c.text} ${confTag(c.confidence)}</li>`).join('')}</ul>
  </div>`;

  document.getElementById('summary-content').innerHTML = html;
}

// === Metrics ===
function renderMetrics(r) {
  let html = '<div class="metrics-grid">';

  // Sleep metric card
  html += buildMetricCard('Sleep', r.sleep.qualityScore, `~${r.sleep.averageHours} hrs avg`, r.sleep.overallQuality === 'poor' ? 'bad' : 'warn',
    r.sleep.dailyBreakdown.map(d => ({ label: `D${d.day}`, value: d.hours ? `${d.hours}h` : '—' })),
    r.sleep.patterns.map(p => `${p.finding} ${confTag(p.confidence)}`));

  // Nutrition
  html += buildMetricCard('Nutrition', r.nutrition.adherenceScore, `Protein: mostly low`, r.nutrition.overallAdherence === 'low' ? 'bad' : 'warn',
    r.nutrition.dailyBreakdown.map(d => ({ label: `D${d.day}`, value: d.protein === 'unknown' ? '?' : d.protein[0].toUpperCase() })),
    r.nutrition.patterns.map(p => `${p.finding} ${confTag(p.confidence)}`));

  // Exercise
  html += buildMetricCard('Exercise', r.exercise.adherenceScore, `Steps: 4.5K–8K`, r.exercise.overallAdherence === 'moderate' ? 'warn' : 'good',
    r.exercise.dailyBreakdown.map(d => ({ label: `D${d.day}`, value: d.steps ? `${(d.steps/1000).toFixed(1)}K` : '—' })),
    r.exercise.trends.map(p => `${p.finding} ${confTag(p.confidence)}`));

  // Water
  html += buildMetricCard('Water', r.water.adherenceScore, `Reported 2/8 days`, 'warn',
    r.water.dailyBreakdown.map(d => ({ label: `D${d.day}`, value: d.litres ? `${d.litres}L` : '—' })),
    r.water.patterns.map(p => `${p.finding} ${confTag(p.confidence)}`));

  html += '</div>';

  // Symptoms section
  html += '<h3 style="margin-bottom:12px;">Symptoms &amp; Stress</h3>';
  r.symptoms.activeSymptoms.forEach(s => {
    html += `<div class="insight-card animate-in" style="margin-bottom:10px;">
      <div class="insight-icon ${s.severity === 'high' ? 'risk' : s.trend === 'improved' ? 'positive' : 'barrier'}">
        ${s.severity === 'high' ? '🔴' : s.trend === 'improved' ? '🟢' : '🟡'}
      </div>
      <div class="insight-body">
        <div class="insight-title">${s.symptom} ${confTag(s.confidence)}</div>
        <div class="insight-desc">Frequency: ${s.frequency} · Severity: ${s.severity} · Trend: ${s.trend}</div>
        ${s.evidence.map(e => `<div class="insight-evidence">Day ${e.day}: "${e.quote}"</div>`).join('')}
      </div>
      <span class="insight-severity severity-${s.severity === 'high' ? 'high' : s.severity === 'moderate' ? 'medium' : 'low'}">${s.severity}</span>
    </div>`;
  });

  // Stress factors
  html += '<h3 style="margin:20px 0 12px;">Stress Factors</h3><div class="insight-list">';
  r.symptoms.stressFactors.forEach(f => {
    html += `<div class="insight-card"><div class="insight-icon barrier">😰</div>
      <div class="insight-body"><div class="insight-title">${f.factor} ${confTag(f.confidence)}</div><div class="insight-desc">Identified on Day ${f.day}</div></div></div>`;
  });
  html += '</div>';

  document.getElementById('metrics-content').innerHTML = html;
}

function buildMetricCard(label, score, sub, status, days, patterns) {
  let html = `<div class="metric-card ${status} animate-in">
    <div class="metric-label">${label}</div>
    <div class="metric-value">${score}<span style="font-size:16px;color:var(--text-muted)">%</span></div>
    <div class="metric-sub">${sub}</div>
    <div class="day-grid">${days.map(d => `<div class="day-cell"><span class="day-label">${d.label}</span><span class="day-val">${d.value}</span></div>`).join('')}</div>
    <div style="margin-top:12px;font-size:12px;color:var(--text-secondary);">${patterns.map(p => `<div style="margin-bottom:6px;">• ${p}</div>`).join('')}</div>
  </div>`;
  return html;
}

// === Insights ===
function renderInsights(r) {
  let html = '';

  // Risk flags
  html += '<div class="insight-section"><div class="insight-section-title">🚨 Risk & Attention Flags</div><div class="insight-list">';
  r.riskFlags.flags.forEach(f => {
    html += `<div class="insight-card animate-in">
      <div class="insight-icon risk">⚠️</div>
      <div class="insight-body">
        <div class="insight-title">${f.flag} ${confTag(f.confidence)}</div>
        <div class="insight-desc">${f.recommendation}</div>
        <div class="insight-evidence">Day ${f.day}: "${f.evidence}"</div>
      </div>
      <span class="insight-severity severity-${f.severity}">${f.severity}</span>
    </div>`;
  });
  html += '</div></div>';

  // Barriers
  html += '<div class="insight-section"><div class="insight-section-title">🧱 Key Barriers</div><div class="insight-list">';
  r.barriers.barriers.forEach(b => {
    html += `<div class="insight-card animate-in">
      <div class="insight-icon barrier">🚧</div>
      <div class="insight-body">
        <div class="insight-title">${b.barrier} ${confTag(b.confidence)}</div>
        <div class="insight-desc">Type: ${b.type} · Coach acknowledged: ${b.coachAcknowledged ? 'Yes' : 'No'}</div>
        ${b.coachResponse ? `<div class="insight-desc" style="color:var(--accent-light);margin-top:4px;">Coach: ${b.coachResponse}</div>` : ''}
        ${b.evidence.map(e => `<div class="insight-evidence">Day ${e.day}: "${e.quote}"</div>`).join('')}
      </div>
      <span class="insight-severity severity-${b.severity}">${b.severity}</span>
    </div>`;
  });
  html += '</div></div>';

  // Engagement
  html += '<div class="insight-section"><div class="insight-section-title">📈 Engagement Level</div>';
  html += `<div class="metric-card good animate-in" style="margin-bottom:12px;">
    <div class="metric-label">Engagement Score</div>
    <div class="metric-value">${r.engagement.engagementScore}%</div>
    <div class="metric-sub">${r.engagement.weeklyTrend}</div>
  </div>`;
  html += '<div class="insight-list">';
  r.engagement.indicators.forEach(ind => {
    html += `<div class="insight-card"><div class="insight-icon ${ind.score === 'high' ? 'positive' : ind.score === 'moderate' ? 'info' : 'barrier'}">
      ${ind.score === 'high' ? '🟢' : ind.score === 'moderate' ? '🔵' : '🟡'}</div>
      <div class="insight-body"><div class="insight-title">${ind.indicator} ${confTag(ind.confidence)}</div></div></div>`;
  });
  html += '</div></div>';

  document.getElementById('insights-content').innerHTML = html;
}

// === Actions ===
function renderActions(r) {
  let html = '';

  // Coach recommendations
  html += '<div class="insight-section"><div class="insight-section-title">🎯 Recommended Next Actions for Coach</div>';
  html += '<h4 style="color:var(--red);margin-bottom:8px;">Immediate (This Week)</h4>';
  r.coachRecommendations.immediate.forEach((a, i) => {
    html += `<div class="action-card animate-in">
      <button class="action-checkbox" onclick="this.classList.toggle('checked')" id="imm-${i}">${'✓'}</button>
      <div class="action-body"><div class="action-title">${a.action} ${confTag(a.confidence)}</div>
      <div class="action-desc">${a.reasoning}</div>
      <div class="action-meta"><span class="action-tag tag-coach">Coach Action</span></div></div></div>`;
  });
  html += '<h4 style="color:var(--amber);margin:16px 0 8px;">Short-Term (Next 2 Weeks)</h4>';
  r.coachRecommendations.shortTerm.forEach((a, i) => {
    html += `<div class="action-card animate-in">
      <button class="action-checkbox" onclick="this.classList.toggle('checked')" id="st-${i}">${'✓'}</button>
      <div class="action-body"><div class="action-title">${a.action} ${confTag(a.confidence)}</div>
      <div class="action-desc">${a.reasoning}</div></div></div>`;
  });
  html += '<h4 style="color:var(--text-muted);margin:16px 0 8px;">Watch Items</h4>';
  r.coachRecommendations.watchItems.forEach(a => {
    html += `<div class="action-card"><div class="insight-icon info">👁️</div>
      <div class="action-body"><div class="action-title">${a.item} ${confTag(a.confidence)}</div></div></div>`;
  });
  html += '</div>';

  // Pending actions
  html += '<div class="insight-section"><div class="insight-section-title">📋 Pending Client Actions</div>';
  r.pendingActions.clientActions.forEach(a => {
    const statusMap = { pending: 'tag-pending', 'partially-done': 'tag-coach', 'in-progress': 'tag-client', inconsistent: 'tag-pending' };
    html += `<div class="action-card animate-in">
      <button class="action-checkbox" onclick="this.classList.toggle('checked')">${'✓'}</button>
      <div class="action-body"><div class="action-title">${a.action} ${confTag(a.confidence)}</div>
      ${a.quote ? `<div class="insight-evidence">"${a.quote}"</div>` : ''}
      <div class="action-meta"><span class="action-tag ${statusMap[a.status]}">${a.status}</span><span class="action-tag tag-client">Client</span></div></div></div>`;
  });
  html += '</div>';

  // Pending coach actions
  html += '<div class="insight-section"><div class="insight-section-title">📋 Pending Coach Actions</div>';
  r.pendingActions.coachActions.forEach(a => {
    html += `<div class="action-card animate-in">
      <button class="action-checkbox" onclick="this.classList.toggle('checked')">${'✓'}</button>
      <div class="action-body"><div class="action-title">${a.action} ${confTag(a.confidence)}</div>
      ${a.quote ? `<div class="insight-evidence">"${a.quote}"</div>` : ''}
      <div class="action-meta"><span class="action-tag tag-coach">Priority: ${a.priority}</span></div></div></div>`;
  });
  html += '</div>';

  document.getElementById('actions-content').innerHTML = html;
}

// === Evidence ===
function renderEvidence(r) {
  let html = '';
  r.evidence.categories.forEach(cat => {
    html += `<div class="evidence-group animate-in">
      <div class="evidence-group-title"><span style="font-size:16px;">${catIcon(cat.category)}</span> ${cat.category}</div>`;
    cat.items.forEach(item => {
      html += `<div class="evidence-item">
        <div class="evidence-claim">${item.claim} ${confTag(item.confidence)}</div>
        ${item.quote ? `<div class="evidence-quote">"${item.quote}"</div>` : '<div class="evidence-quote" style="border-color:var(--text-muted);">No direct quote — AI inference</div>'}
        ${item.day ? `<div class="evidence-day">📅 Day ${item.day}</div>` : ''}
      </div>`;
    });
    html += '</div>';
  });
  document.getElementById('evidence-content').innerHTML = html;
}

function catIcon(cat) {
  const icons = { Sleep: '😴', Nutrition: '🍽️', 'Exercise & Movement': '🏃', 'Symptoms & Wellbeing': '🩺', 'Weight & Body': '⚖️' };
  return icons[cat] || '📋';
}

// === Conversation ===
function renderConversation() {
  let html = '';
  CONVERSATION.forEach(day => {
    html += `<div class="convo-day animate-in"><div class="convo-day-label">Day ${day.day}</div>`;
    day.messages.forEach(msg => {
      const role = msg.sender === 'client' ? 'client' : 'coach';
      const senderLabel = msg.sender === 'client' ? 'Client' : msg.sender === 'accountability' ? 'Accountability Coach' : 'Coach';
      html += `<div class="convo-msg ${role}"><div class="msg-sender">${senderLabel}</div>${msg.text}</div>`;
    });
    html += '</div>';
  });
  document.getElementById('conversation-content').innerHTML = html;
}


