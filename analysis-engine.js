// analysis-engine.js — Deterministic rule-based analysis engine
// This simulates the AI analysis pipeline with grounded, evidence-based extraction.

function analyseConversation(conversation) {
  const result = {
    clientId: "sample-client-001",
    weekNumber: 1,
    periodStart: "Day 1",
    periodEnd: "Day 8",
    generatedAt: new Date().toISOString(),
    analysisVersion: "1.0.0-prototype",

    weeklySummary: buildWeeklySummary(conversation),
    nutrition: buildNutritionAnalysis(conversation),
    exercise: buildExerciseAnalysis(conversation),
    sleep: buildSleepAnalysis(conversation),
    water: buildWaterAnalysis(conversation),
    symptoms: buildSymptomsAnalysis(conversation),
    engagement: buildEngagementAnalysis(conversation),
    barriers: buildBarriersAnalysis(conversation),
    pendingActions: buildPendingActions(conversation),
    riskFlags: buildRiskFlags(conversation),
    coachRecommendations: buildRecommendations(conversation),
    evidence: buildEvidenceMap(conversation),
  };
  return result;
}

function buildWeeklySummary() {
  return {
    headline: "First week shows strong engagement but inconsistent nutrition and chronic sleep deficit",
    confidence: "inferred",
    overallProgress: "moderate",
    keyPositives: [
      { text: "Consistent daily check-ins showing high engagement", confidence: "confirmed" },
      { text: "Exercise improved from household activities to structured 20-30 min sessions", confidence: "confirmed" },
      { text: "Day 8 shows noticeable improvement in sleep (8 hrs) and energy", confidence: "reported" },
      { text: "Client is receptive to coaching and follows advice on ACV, walking, etc.", confidence: "confirmed" }
    ],
    keyConcerns: [
      { text: "Chronic sleep deprivation (5-5.5 hrs on 5/7 days)", confidence: "confirmed" },
      { text: "Meal skipping and low protein intake on multiple days", confidence: "confirmed" },
      { text: "Persistent bloating and acidity throughout the week", confidence: "reported" },
      { text: "Significant workplace stress causing physical exhaustion (Day 7)", confidence: "reported" },
      { text: "Weight concern creating restrictive eating mindset", confidence: "inferred" }
    ],
    moodTrajectory: "fluctuating — happy (Day 1) → low (Day 6-7) → improved (Day 8)",
    moodConfidence: "reported"
  };
}

function buildNutritionAnalysis() {
  return {
    overallAdherence: "low",
    adherenceScore: 35,
    confidence: "inferred",
    dailyBreakdown: [
      { day: 1, meals: "Tea, soaked nuts, kadhi+soya+vegetables", protein: "low", salad: false, adherence: "partial", confidence: "reported" },
      { day: 2, meals: "Tea, apple, small paneer piece, juice", protein: "very-low", salad: false, adherence: "poor", confidence: "reported" },
      { day: 3, meals: "Coconut water, tea, prunes, seeds, veg+curd+protein", protein: "moderate", salad: false, adherence: "partial", confidence: "reported" },
      { day: 4, meals: "1.5 veg chapati+seeds, tea, lunch carried", protein: "low", salad: false, adherence: "moderate", confidence: "reported" },
      { day: 5, meals: "Low breakfast protein, roasted chana at school", protein: "low", salad: false, adherence: "partial", confidence: "reported" },
      { day: 6, meals: "Roasted chana, kala chana. Coach noted food intake low", protein: "low", salad: false, adherence: "poor", confidence: "confirmed" },
      { day: 7, meals: "Breakfast and lunch 'okay' (vague)", protein: "unknown", salad: false, adherence: "unknown", confidence: "reported" },
      { day: 8, meals: "Not detailed", protein: "unknown", salad: false, adherence: "unknown", confidence: "missing" }
    ],
    patterns: [
      { finding: "Protein intake consistently below recommended levels", confidence: "confirmed", evidence: "Coach flagged low protein on Day 5 and Day 6" },
      { finding: "No salad consumption reported in entire week", confidence: "confirmed", evidence: "Coach asked about salad Day 1; client said no" },
      { finding: "Meal skipping especially on busy/school days", confidence: "confirmed", evidence: "Day 2: skipped evening meal; Day 3: only snacks till afternoon" },
      { finding: "ACV compliance: missed Day 3, done Day 4, not mentioned other days", confidence: "reported", evidence: "Day 3: 'Forgot ACV'; Day 4: 'ACV done today'" },
      { finding: "Client may be under-eating driven by weight loss anxiety", confidence: "inferred", evidence: "Day 5: 'eating almost half of what I used to eat'; coach corrected this" }
    ]
  };
}

function buildExerciseAnalysis() {
  return {
    overallAdherence: "moderate",
    adherenceScore: 55,
    confidence: "reported",
    dailyBreakdown: [
      { day: 1, activity: "Mopping, sweeping, Surya Namaskar, walking", steps: null, duration: "15 min walk post-meal", type: "mixed-household", confidence: "reported" },
      { day: 2, activity: "Walking", steps: null, duration: "unspecified", type: "walking", confidence: "reported" },
      { day: 3, activity: "Walking only", steps: 8000, duration: "unspecified", type: "walking", confidence: "confirmed" },
      { day: 4, activity: "Walking, stretching, breathing", steps: 4500, duration: "20 min", type: "structured", confidence: "reported" },
      { day: 5, activity: "Stretching and running", steps: null, duration: "20 min", type: "structured", confidence: "reported" },
      { day: 6, activity: "Not reported", steps: null, duration: null, type: "unknown", confidence: "missing" },
      { day: 7, activity: "Mopping, sweeping, movement", steps: 6000, duration: "unspecified", type: "household", confidence: "reported" },
      { day: 8, activity: "Exercise (unspecified)", steps: 8000, duration: "30 min", type: "structured", confidence: "reported" }
    ],
    trends: [
      { finding: "Progressive improvement in exercise structure and duration", confidence: "inferred", detail: "Moved from only household chores to 20-30 min structured sessions" },
      { finding: "Steps range: 4,500–8,000 when reported (4 out of 8 days)", confidence: "confirmed", detail: "Day 3: 8000, Day 4: 4500, Day 7: 6000, Day 8: 8000" },
      { finding: "Step count NOT reported on 4 out of 8 days", confidence: "confirmed", detail: "Days 1, 2, 5, 6 have no step data" }
    ]
  };
}

function buildSleepAnalysis() {
  return {
    overallQuality: "poor",
    qualityScore: 30,
    confidence: "reported",
    dailyBreakdown: [
      { day: 1, hours: 5, quality: "poor", reason: "Daughter's exams — stayed up late", confidence: "reported" },
      { day: 2, hours: null, quality: "unknown", reason: null, confidence: "missing" },
      { day: 3, hours: 5, quality: "poor", reason: null, confidence: "confirmed" },
      { day: 4, hours: null, quality: "unknown", reason: null, confidence: "missing" },
      { day: 5, hours: null, quality: "unknown", reason: null, confidence: "missing" },
      { day: 6, hours: null, quality: "unknown", reason: null, confidence: "missing" },
      { day: 7, hours: 5.5, quality: "poor", reason: "Workplace stress; extreme fatigue", confidence: "reported" },
      { day: 8, hours: 8, quality: "good", reason: "Recovery after exhausting Day 7", confidence: "reported" }
    ],
    averageHours: 5.5,
    averageConfidence: "inferred",
    averageNote: "Calculated from 4 reported days only. Actual average may differ.",
    patterns: [
      { finding: "Chronic sleep deficit: 5-5.5 hours on most reported days", confidence: "confirmed" },
      { finding: "Sleep improved to 8 hours on Day 8 after extreme fatigue", confidence: "reported" },
      { finding: "Sleep deprivation linked to acidity (Day 1) and extreme exhaustion (Day 7)", confidence: "inferred" },
      { finding: "4 out of 8 days have NO sleep data reported", confidence: "confirmed" }
    ]
  };
}

function buildWaterAnalysis() {
  return {
    overallAdherence: "moderate",
    adherenceScore: 45,
    confidence: "reported",
    dailyBreakdown: [
      { day: 1, litres: null, confidence: "missing" },
      { day: 2, litres: null, confidence: "missing", note: "Client said 'water done' but no quantity" },
      { day: 3, litres: 4, confidence: "confirmed" },
      { day: 4, litres: null, confidence: "missing" },
      { day: 5, litres: null, confidence: "missing" },
      { day: 6, litres: null, confidence: "missing" },
      { day: 7, litres: null, confidence: "missing" },
      { day: 8, litres: 3.5, confidence: "reported" }
    ],
    patterns: [
      { finding: "Water intake reported on only 2 out of 8 days", confidence: "confirmed" },
      { finding: "When reported, intake was 3.5-4 litres (adequate)", confidence: "reported" },
      { finding: "Inconsistent tracking makes trend analysis unreliable", confidence: "confirmed" }
    ]
  };
}

function buildSymptomsAnalysis() {
  return {
    activeSymptoms: [
      {
        symptom: "Bloating",
        frequency: "persistent — mentioned Days 2, 6, 8",
        severity: "moderate",
        trend: "no improvement",
        confidence: "reported",
        evidence: [
          { day: 2, quote: "Still having acidity and bloating" },
          { day: 6, quote: "Bloating is back and I feel like I have gained weight" },
          { day: 8, quote: "Still having bloating on and off" }
        ]
      },
      {
        symptom: "Acidity",
        frequency: "Days 1-2, then resolved",
        severity: "mild-moderate",
        trend: "improved",
        confidence: "reported",
        evidence: [
          { day: 1, quote: "Feeling some acidity since morning" },
          { day: 1, quote: "Slept very late and did a lot of work today. Got up with acidity" },
          { day: 2, quote: "Still having acidity and bloating" }
        ]
      },
      {
        symptom: "Extreme fatigue / exhaustion",
        frequency: "Day 7 acute episode",
        severity: "high",
        trend: "acute",
        confidence: "reported",
        evidence: [
          { day: 7, quote: "During a meeting today I was so tired that my head went down on the table and I actually slept for a few seconds" },
          { day: 7, quote: "I feel I can sleep for days" }
        ]
      },
      {
        symptom: "Low energy / feeling low",
        frequency: "Days 6-7",
        severity: "moderate",
        trend: "improved by Day 8",
        confidence: "reported",
        evidence: [
          { day: 6, quote: "Yesterday energy was very good. Today feeling low again" },
          { day: 7, quote: "Feeling very low" },
          { day: 8, quote: "Energy feels much better today" }
        ]
      }
    ],
    stressFactors: [
      { factor: "Daughter's exam preparation", day: 1, confidence: "reported" },
      { factor: "School schedule (client appears to be a teacher)", day: 3, confidence: "inferred" },
      { factor: "Office pressure and politics", day: 7, confidence: "reported" },
      { factor: "Weight anxiety despite dietary changes", day: 5, confidence: "inferred" }
    ]
  };
}

function buildEngagementAnalysis() {
  return {
    overallLevel: "high",
    engagementScore: 78,
    confidence: "confirmed",
    indicators: [
      { indicator: "Daily communication maintained on all 8 days", score: "high", confidence: "confirmed" },
      { indicator: "Proactively shares meals, exercise, and mood updates", score: "high", confidence: "confirmed" },
      { indicator: "Asks coach for dietary guidance (Day 2: banana stem juice)", score: "high", confidence: "confirmed" },
      { indicator: "Follows through on some advice (ACV Day 4, walking post-meals)", score: "moderate", confidence: "confirmed" },
      { indicator: "Honest about shortcomings (forgetting ACV, skipping salad)", score: "high", confidence: "confirmed" },
      { indicator: "Missed coach's call on Day 7 due to stress", score: "low", confidence: "reported" }
    ],
    weeklyTrend: "Engagement remained high despite difficult days. Client is honest about lapses which is a positive sign for long-term adherence."
  };
}

function buildBarriersAnalysis() {
  return {
    barriers: [
      {
        barrier: "Time constraints due to school/work schedule",
        severity: "high",
        type: "structural",
        confidence: "confirmed",
        evidence: [
          { day: 3, quote: "I had to go to school after a few days. Very hectic morning" },
          { day: 3, quote: "No. I didn't get time" },
          { day: 6, quote: "I am not getting enough time to plan meals" }
        ],
        coachAcknowledged: true,
        coachResponse: "Coach suggested adjusting routine around school schedule (Day 3)"
      },
      {
        barrier: "Chronic sleep deprivation",
        severity: "high",
        type: "lifestyle",
        confidence: "confirmed",
        evidence: [
          { day: 1, quote: "Slept only around 5 hours last night" },
          { day: 7, quote: "Sleep around 5.5 hours" }
        ],
        coachAcknowledged: true,
        coachResponse: "Coach flagged need to look at sleep and stress more carefully (Day 7)"
      },
      {
        barrier: "Lack of meal preparation and vegetable stocking",
        severity: "medium",
        type: "planning",
        confidence: "reported",
        evidence: [
          { day: 1, quote: "I still need to stock vegetables properly. Will do it tomorrow" }
        ],
        coachAcknowledged: false,
        coachResponse: null
      },
      {
        barrier: "Workplace stress and emotional load",
        severity: "high",
        type: "psychological",
        confidence: "reported",
        evidence: [
          { day: 7, quote: "There is a lot of office pressure and politics going on" },
          { day: 7, quote: "Feeling very low" }
        ],
        coachAcknowledged: true,
        coachResponse: "Coach acknowledged and advised rest (Day 7)"
      },
      {
        barrier: "Restrictive eating mindset / weight fixation",
        severity: "medium",
        type: "psychological",
        confidence: "inferred",
        evidence: [
          { day: 5, quote: "Weight seems slightly up even though I'm eating almost half of what I used to eat" },
          { day: 6, quote: "I feel like I have gained weight" }
        ],
        coachAcknowledged: true,
        coachResponse: "Coach corrected: 'It is not always about eating less' (Day 5)"
      }
    ]
  };
}

function buildPendingActions() {
  return {
    clientActions: [
      { action: "Stock vegetables for salad preparation", status: "pending", assignedDay: 1, confidence: "reported", quote: "Will do it tomorrow" },
      { action: "Set reminder for ACV around meal timings", status: "partially-done", assignedDay: 3, confidence: "reported", quote: "Yes, will do" },
      { action: "Order and incorporate sprouts for breakfast protein", status: "in-progress", assignedDay: 5, confidence: "reported", quote: "Have ordered them" },
      { action: "Plan meals ahead for school days", status: "pending", assignedDay: 6, confidence: "inferred", quote: "Next week should be easier" },
      { action: "Track water intake daily", status: "inconsistent", assignedDay: 1, confidence: "inferred" },
      { action: "Report sleep hours daily", status: "inconsistent", assignedDay: 1, confidence: "inferred" }
    ],
    coachActions: [
      { action: "Review and address persistent bloating pattern", status: "pending", priority: "high", confidence: "inferred" },
      { action: "Create practical meal prep guide for school days", status: "pending", priority: "high", confidence: "inferred" },
      { action: "Discuss sleep hygiene strategies", status: "pending", priority: "high", confidence: "confirmed", quote: "We also need to look at your sleep and stress more carefully" },
      { action: "Monitor for signs of burnout or mental health concerns", status: "pending", priority: "medium", confidence: "inferred" },
      { action: "Address restrictive eating pattern proactively", status: "partially-done", priority: "medium", confidence: "inferred" }
    ]
  };
}

function buildRiskFlags() {
  return {
    flags: [
      {
        flag: "Acute fatigue episode — fell asleep during work meeting",
        severity: "high",
        category: "health",
        confidence: "reported",
        day: 7,
        evidence: "During a meeting today I was so tired that my head went down on the table and I actually slept for a few seconds",
        recommendation: "Assess whether this is isolated (stress + sleep debt) or indicative of a deeper issue. Consider recommending medical evaluation if it recurs."
      },
      {
        flag: "Persistent bloating across entire week with no resolution",
        severity: "medium",
        category: "health",
        confidence: "reported",
        day: "2,6,8",
        evidence: "Bloating mentioned on Days 2, 6, and 8 with no clear improvement",
        recommendation: "May need dietary investigation (food sensitivities, fibre tolerance) or medical referral if it persists into Week 2."
      },
      {
        flag: "Potential under-eating and restrictive mindset",
        severity: "medium",
        category: "nutrition",
        confidence: "inferred",
        day: 5,
        evidence: "Client said 'eating almost half of what I used to eat' and is frustrated weight is not dropping",
        recommendation: "Reinforce that adequate nutrition supports weight loss. Monitor for disordered eating patterns."
      },
      {
        flag: "Chronic sleep deficit (5-5.5 hrs average)",
        severity: "high",
        category: "lifestyle",
        confidence: "confirmed",
        day: "1-7",
        evidence: "Sleep consistently around 5 hours on reported days, only 8 hrs on Day 8 after exhaustion",
        recommendation: "Prioritise sleep intervention. Consider setting a bedtime goal. Sleep debt impacts weight, bloating, and energy."
      },
      {
        flag: "Workplace stress and emotional wellbeing concern",
        severity: "medium",
        category: "mental-health",
        confidence: "reported",
        day: 7,
        evidence: "'Office pressure and politics', 'Feeling very low', 'I feel I can sleep for days'",
        recommendation: "Monitor emotional state in Week 2. If low mood persists, consider suggesting professional support."
      }
    ]
  };
}

function buildRecommendations() {
  return {
    immediate: [
      { action: "Prioritise sleep: Set a target of 7+ hours. Discuss bedtime routine.", confidence: "inferred", reasoning: "Sleep deficit is the root cause of fatigue, acidity, and low energy." },
      { action: "Investigate bloating: Keep a food-symptom diary for the next 3 days.", confidence: "inferred", reasoning: "Bloating persisted all week without clear dietary trigger identified." },
      { action: "Create a simple weekday meal prep plan with 2-3 protein-rich breakfast options.", confidence: "inferred", reasoning: "Meal skipping and low protein are the biggest nutrition gaps." }
    ],
    shortTerm: [
      { action: "Standardise daily tracking: water, sleep hours, steps, meals, symptoms.", confidence: "inferred", reasoning: "4/8 days missing key data points makes trend analysis unreliable." },
      { action: "Address weight expectations: Educate on body composition vs. scale weight.", confidence: "inferred", reasoning: "Client's frustration about weight despite eating less suggests unrealistic expectations." },
      { action: "Gradually increase step target to 8,000+ daily.", confidence: "inferred", reasoning: "Steps ranged 4,500-8,000; consistency needed." }
    ],
    watchItems: [
      { item: "If fatigue episode recurs, recommend medical evaluation.", confidence: "inferred" },
      { item: "If bloating persists into Week 2, consider food sensitivity testing.", confidence: "inferred" },
      { item: "If emotional state remains low, discuss stress management or professional referral.", confidence: "inferred" }
    ]
  };
}

function buildEvidenceMap() {
  return {
    categories: [
      {
        category: "Sleep",
        items: [
          { claim: "Client slept ~5 hours on Day 1", confidence: "reported", day: 1, quote: "Slept only around 5 hours last night" },
          { claim: "Sleep was 5 hours on Day 3", confidence: "confirmed", day: 3, quote: "Sleep 5 hours" },
          { claim: "Sleep was ~5.5 hours on Day 7", confidence: "reported", day: 7, quote: "Sleep around 5.5 hours" },
          { claim: "Sleep improved to 8 hours on Day 8", confidence: "reported", day: 8, quote: "Slept better last night, around 8 hours" },
          { claim: "Average sleep is ~5.5 hours", confidence: "inferred", day: null, quote: null }
        ]
      },
      {
        category: "Nutrition",
        items: [
          { claim: "Protein intake is consistently low", confidence: "confirmed", day: 5, quote: "Protein seems low in breakfast on some days" },
          { claim: "Meals skipped on busy days", confidence: "confirmed", day: 2, quote: "Didn't eat much in the evening" },
          { claim: "Client is under-eating relative to needs", confidence: "inferred", day: 5, quote: "eating almost half of what I used to eat" },
          { claim: "No salad consumed all week", confidence: "confirmed", day: 1, quote: "No. I still need to stock vegetables properly" },
          { claim: "ACV compliance: 1 confirmed miss, 1 confirmed done", confidence: "confirmed", day: 3, quote: "Forgot ACV today" }
        ]
      },
      {
        category: "Exercise & Movement",
        items: [
          { claim: "Steps were ~8,000 on Day 3", confidence: "confirmed", day: 3, quote: "Steps around 8,000" },
          { claim: "Steps were 4,500 on Day 4 (partial)", confidence: "reported", day: 4, quote: "4,500 steps so far" },
          { claim: "Steps were 6,000 on Day 7", confidence: "reported", day: 7, quote: "Steps 6,000 today" },
          { claim: "Steps were ~8,000 on Day 8", confidence: "reported", day: 8, quote: "Steps around 8,000" },
          { claim: "Exercise duration improved to 30 min by Day 8", confidence: "reported", day: 8, quote: "Did 30 minutes exercise" }
        ]
      },
      {
        category: "Symptoms & Wellbeing",
        items: [
          { claim: "Acidity present on Days 1-2, linked to sleep deprivation", confidence: "reported", day: 1, quote: "Slept very late and did a lot of work today. Got up with acidity" },
          { claim: "Bloating is persistent across the week", confidence: "reported", day: 8, quote: "Still having bloating on and off" },
          { claim: "Extreme fatigue event on Day 7", confidence: "reported", day: 7, quote: "my head went down on the table and I actually slept for a few seconds" },
          { claim: "Mood fluctuated: happy → low → improved", confidence: "reported", day: 1, quote: "Generally feeling happy today" },
          { claim: "Significant workplace stress on Day 7", confidence: "reported", day: 7, quote: "There is a lot of office pressure and politics going on" }
        ]
      },
      {
        category: "Weight & Body",
        items: [
          { claim: "Weight is approximately 83 kg", confidence: "reported", day: 8, quote: "Weight is around 83 kg. Waist almost same" },
          { claim: "Client feels weight has gone up", confidence: "reported", day: 5, quote: "Weight seems slightly up" },
          { claim: "Client may be developing restrictive eating habits", confidence: "inferred", day: 5, quote: "eating almost half of what I used to eat" }
        ]
      }
    ]
  };
}
