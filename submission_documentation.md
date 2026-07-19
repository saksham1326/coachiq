# CoachIQ — Client Intelligence Engine

## Submission Documentation

---

## 1. What I Built

**CoachIQ** is a browser-based prototype that analyses health coaching conversations and generates structured client intelligence for coaches. It processes an 8-day WhatsApp-style conversation between a client and their wellness coach, extracting actionable insights across health, nutrition, exercise, sleep, and emotional wellbeing.

### Core Features
- **Weekly Summary Dashboard** — 8 metric cards (nutrition, exercise, sleep, water, engagement, mood, risk flags, overall progress)
- **Health Metrics Tracking** — Day-by-day breakdown with visual grids and trend analysis
- **Insights & Risks** — Risk flags, key barriers, and engagement indicators with severity ratings
- **Actions & Recommendations** — Immediate, short-term, and watch-list actions for the coach, plus pending client/coach actions
- **Evidence Tab** — Every claim linked to its source quote, day, and confidence level
- **Conversation View** — Original conversation rendered for cross-referencing
- **JSON Schema** — Structured output schema viewable in-app
- **Human Review** — Approve / Edit / Reject buttons on every section

### Confidence Classification
Every data point is tagged with one of four confidence levels:
| Tag | Meaning | Example |
|-----|---------|---------|
| 🟢 **Confirmed** | Verified by coach or accountability log | "Steps around 8,000" from accountability coach |
| 🔵 **Client-Reported** | Stated by client, not independently verified | "Slept only around 5 hours" |
| 🟣 **AI Inference** | Derived by the system from patterns | "Client may be developing restrictive eating habits" |
| ⚪ **Missing Data** | Not mentioned or trackable | Sleep data on Days 2, 4, 5, 6 |

---

## 2. Prompt / Workflow Used to Analyse the Conversation

### Analysis Pipeline (Simulated in Prototype)

In a production system, the conversation would be processed through this LLM prompt pipeline:

```
SYSTEM PROMPT:
You are a health coaching intelligence analyst. Your task is to extract 
structured insights from a coaching conversation between a health/wellness 
coach and their client.

RULES:
1. ONLY extract information explicitly stated in the conversation.
2. For every finding, classify its confidence:
   - "confirmed": Verified by coach or third-party (accountability coach)
   - "reported": Stated by the client (self-reported, not verified)  
   - "inferred": Pattern you deduced from multiple data points
   - "missing": Information that was expected but not provided
3. For inferences, ALWAYS provide the evidence chain that led to the conclusion.
4. NEVER fabricate specific numbers not mentioned in the conversation.
5. When data is ambiguous, report it as ambiguous rather than choosing a value.
6. Flag any information gaps that could lead to incorrect conclusions.

EXTRACT THE FOLLOWING:
1. Weekly summary (headline, progress level, key positives, key concerns)
2. Nutrition (daily meals, protein levels, salad, adherence, patterns)
3. Exercise (daily activity, steps, duration, type, trends)
4. Sleep (daily hours, quality, reasons, patterns)
5. Water intake (daily litres, tracking consistency)
6. Symptoms (active symptoms with frequency, severity, trend, evidence)
7. Stress factors (identified stressors with source day)
8. Engagement level (indicators, score, trend)
9. Barriers (structural, lifestyle, psychological — with coach response)
10. Pending actions (client and coach, with status)
11. Risk flags (with severity, evidence, recommendation)
12. Coach recommendations (immediate, short-term, watch items)
13. Evidence map (every claim linked to source quote and day)

OUTPUT FORMAT: JSON conforming to the WeeklyClientIntelligenceReport schema.
```

### Extraction Steps (What the Prototype Simulates)

1. **Parse** — Split conversation into day-wise message arrays with sender roles
2. **Extract Metrics** — Regex + NLP for numbers (sleep hours, steps, water litres, weight)
3. **Classify Meals** — Map food mentions to protein/vegetable categories
4. **Track Symptoms** — Identify symptom keywords (bloating, acidity, fatigue, stress)
5. **Assess Engagement** — Count daily messages, proactive updates, questions asked
6. **Identify Barriers** — Extract structural/psychological blockers from context
7. **Build Evidence Map** — Link every claim to its source quote and day number
8. **Generate Recommendations** — Based on identified gaps and risk patterns
9. **Classify Confidence** — Tag each finding with its evidence basis

---

## 3. Structured Output — JSON Schema

The complete JSON Schema is viewable in the app's "JSON Schema" tab. Key top-level structure:

```json
{
  "clientId": "string",
  "weekNumber": "integer",
  "periodStart": "string",
  "periodEnd": "string",
  "generatedAt": "datetime",
  "weeklySummary": {
    "headline": "string",
    "confidence": "confirmed | reported | inferred | missing",
    "overallProgress": "strong | moderate | weak | declining",
    "keyPositives": [{ "text": "string", "confidence": "enum" }],
    "keyConcerns": [{ "text": "string", "confidence": "enum" }],
    "moodTrajectory": "string"
  },
  "nutrition": {
    "adherenceScore": "0-100",
    "dailyBreakdown": [{ "day": "int", "meals": "string", "protein": "string", "confidence": "enum" }],
    "patterns": [{ "finding": "string", "confidence": "enum", "evidence": "string" }]
  },
  "sleep": { "qualityScore": "0-100", "averageHours": "number", "dailyBreakdown": [...], "patterns": [...] },
  "exercise": { "adherenceScore": "0-100", "dailyBreakdown": [...], "trends": [...] },
  "water": { "adherenceScore": "0-100", "dailyBreakdown": [...] },
  "symptoms": { "activeSymptoms": [...], "stressFactors": [...] },
  "engagement": { "engagementScore": "0-100", "indicators": [...] },
  "barriers": [{ "barrier": "string", "severity": "high|medium|low", "type": "string", "confidence": "enum", "evidence": [...] }],
  "pendingActions": { "clientActions": [...], "coachActions": [...] },
  "riskFlags": [{ "flag": "string", "severity": "string", "evidence": "string", "recommendation": "string" }],
  "coachRecommendations": { "immediate": [...], "shortTerm": [...], "watchItems": [...] },
  "evidence": { "categories": [{ "category": "string", "items": [{ "claim": "string", "confidence": "enum", "quote": "string", "day": "int" }] }] }
}
```

---

## 4. Three Hallucination / Failure Scenarios

### Scenario 1: Fabricating Specific Numbers from Vague Statements

> **Risk:** On Day 7, the client says "Breakfast and lunch were okay." An LLM might generate specific calorie counts (e.g., "Breakfast: ~300 calories, Lunch: ~450 calories") despite having no basis for those numbers.

**Why it matters:** Coaches might adjust meal plans based on fabricated calorie data, leading to over- or under-prescription.

**Mitigation in CoachIQ:** The system marks Day 7 nutrition as `confidence: "reported"` with protein as `"unknown"` and adherence as `"unknown"`. The word "okay" is preserved as-is rather than interpreted.

---

### Scenario 2: Conflating Correlation with Causation in Symptom Analysis

> **Risk:** The system observes that bloating appears on days with lower food intake and might conclude "Bloating is caused by meal skipping." However, the conversation never establishes this causal link — both could be independent effects of a busy schedule, or the bloating could be caused by specific foods eaten.

**Why it matters:** A false causal claim could lead the coach to recommend "eat more to reduce bloating" when the actual trigger might be a specific food sensitivity.

**Mitigation in CoachIQ:** Bloating is tagged as `confidence: "reported"` and presented as a persistent symptom with no causal attribution. The recommendation says "investigate" (food-symptom diary) rather than prescribing a solution.

---

### Scenario 3: Over-Interpreting Emotional State as Clinical Concern

> **Risk:** On Day 7, the client says "Feeling very low" and "I feel I can sleep for days." An LLM might flag this as potential clinical depression or burnout, recommending immediate professional mental health intervention.

**Why it matters:** Over-escalation could alarm the coach unnecessarily, damage the coach-client relationship, or cause the client to disengage. The statements are more consistent with a bad day at work + sleep deprivation than clinical depression.

**Mitigation in CoachIQ:** The system flags this as a `"medium"` severity risk with `confidence: "reported"`. The recommendation is to "monitor" in Week 2 and "consider suggesting professional support **if low mood persists**" — not an immediate escalation. The Day 8 recovery (8 hrs sleep, "energy feels much better") is included as counter-evidence.

---

## 5. Short Note

### What I Built
A static HTML/CSS/JS prototype that demonstrates how an AI-powered client intelligence engine would work. The analysis engine is deterministic (hard-coded rules extracting from the specific conversation) to simulate what an LLM pipeline would produce. Every finding is grounded in evidence from the original conversation and tagged with a confidence classification.

### Key Assumptions
1. **Single conversation thread** — The prototype assumes a WhatsApp-style linear conversation. Production would need to handle multi-channel inputs (calls, forms, wearable data).
2. **Honest self-reporting** — Client-reported data (sleep hours, meals eaten) is taken at face value and tagged as "reported" rather than "confirmed."
3. **No baseline data** — Week 1 analysis has no historical context. Adherence scores are calibrated against general coaching program expectations, not the client's personalised plan.
4. **Coach review is mandatory** — The system is designed as decision-support, not decision-making. All outputs require human review (Approve/Edit/Reject) before being acted upon.
5. **Indian dietary context** — Food items like kadhi, chapati, chana, and ACV (apple cider vinegar) are interpreted in the context of Indian vegetarian/semi-vegetarian nutrition programs.

### What Could Go Wrong
1. **LLM hallucination at scale** — With longer conversations, the risk of fabricating details increases. Sentence-level evidence linking becomes harder.
2. **Quantification bias** — Assigning numeric scores (e.g., "35% nutrition adherence") to qualitative data creates false precision. Coaches may anchor on the numbers.
3. **Context loss across weeks** — Without multi-week memory, the system might flag resolved issues repeatedly or miss slow-developing trends.
4. **Cultural/language misinterpretation** — Indian food items, exercise forms (Surya Namaskar), and communication patterns require culturally-aware NLP.
5. **Client gaming** — If clients know their messages are analysed, they may report more favourably, reducing data accuracy.

### What I Would Improve Next
1. **LLM integration** — Replace the deterministic engine with an actual GPT-4/Claude pipeline using the designed prompt and JSON schema, with structured output enforcement.
2. **Multi-week tracking** — Trend analysis across weeks with visual charts (weight, sleep, adherence trajectories).
3. **Editable outputs** — Allow coaches to inline-edit any finding before saving, not just approve/reject at the section level.
4. **Wearable data integration** — Cross-reference self-reported steps/sleep with Fitbit/Apple Watch data to validate `reported` → `confirmed`.
5. **Conversation highlighting** — Click any evidence quote to jump to and highlight it in the conversation view.
6. **Batch processing** — Upload multiple client conversations for weekly review sessions.
7. **Alert system** — Push notifications for high-severity risk flags that need immediate attention.

---

## File Structure

```
genai/
├── index.html              # Main application shell
├── style.css               # Complete design system
├── conversation-data.js    # Structured conversation (8 days)
├── analysis-engine.js      # Deterministic analysis engine
└── app.js                  # UI rendering and interaction
```

> [!NOTE]
> To run the prototype, simply open `index.html` in any modern browser. No build step, no dependencies, no server required.
