# GROUPSGURU -- MASTER ARCHITECTURE DOCUMENT VERSION 2.1
## Exam Intelligence & Predictive Preparation Engine
### Date: March 4, 2026 | Document Version: 2.1 | Status: EXECUTION-READY -- ARCHITECTURE LOCKED

---

## V2.1 CHANGE LOG (from V2.0)

| # | Change | Section | Why |
|---|--------|---------|-----|
| 1 | Added Commission Blending Rule | 5.6.1 (NEW) | UPSC 26-year data must not dominate AP-specific topic predictions. Subject-aware weighting prevents bias. |
| 2 | Added `data_confidence` field | 4.5 | Prediction scores must show whether they're grounded in APPSC data or UPSC-proxy. Transparency for review. |
| 3 | Added Prediction Validation Loop | 5.8 (NEW) | Without feedback, prediction is a one-time analysis that degrades. Loop makes the engine self-correcting. |
| 4 | Restructured Sprint Roadmap with Quality Gates | 12 (REWRITE) | V2.0 lacked explicit freeze points between phases. Risk of scaling broken patterns (Sprint 10 repeat). |
| 5 | Added per-section length caps R24-R26 | 9.2.E | R22 caps static content only. Other sections can bloat without per-section discipline. |
| 6 | Added terminology audit rule R27 | 9.2.D | No mechanism existed to verify Telugu term consistency against the dictionary. |
| 7 | Added `terminology_checker.py` to scripts | 10.1 | Script needed to enforce R27 at scale. |
| 8 | Clarified Principle 3: prediction controls priority/volume, not inclusion | 2 | V2.0 wording implied low-prediction topics could be skipped entirely. |
| 9 | Added Minimum Coverage Guarantee (MCG) | 4.7 (NEW) | Every micro-topic must receive baseline content + test coverage regardless of prediction score. Prevents gaps if commission rotates focus. |
| 10 | Clarified 15% FLT allocation as rotation buffer | 7.4 | Explicit rationale connecting rotation buffer to MCG for commission topic rotation scenarios. |

**Sections UNCHANGED:** 1, 3, 6, 8, 11 (Sections 2, 4, 7, 13 received targeted additions)

---

## CONTEXT

GroupsGuru V1 (Sprints 0-10) delivered a working Moodle backend, 900 bilingual MCQs, live domain, and payment integration. However, the V1 approach treated GroupsGuru as a "Mock Test Platform" -- generating questions without deep syllabus alignment or exam-pattern intelligence.

The owner's strategic insight (handwritten PDF, March 2026): **"We have 2 Sources of Truth -- Syllabus tells SCOPE, PYQs tell WHERE/HOW/WHY the board is actually focusing."** This redefines the platform's core identity.

V2 redefines GroupsGuru as an **Exam Intelligence & Predictive Preparation Engine** that reverse-engineers commission behavior to achieve near-100% exam pattern prediction through content and mock tests.

### CRITICAL CORRECTION FROM V1
The V1 architecture assumed 150Q/150min for APPSC G1 Prelims. The **official APPSC G1 Prelims syllabus (2018)** confirms:
- **Paper I (GS): 120 Questions / 120 Marks / 120 Minutes**
- **Paper II (Aptitude): 120 Questions / 120 Marks / 120 Minutes**

All FLT configurations, question counts, and time limits must use these corrected figures.

---

# SECTION 1: EXECUTIVE SUMMARY

GroupsGuru V2 is a fundamental reorientation from question generation to **exam intelligence**.

**V1 identity:** Mock Test Platform (generate questions, host quizzes, sell access)
**V2 identity:** Exam Intelligence & Predictive Preparation Engine (decode commission behavior, predict patterns, generate PYQ-aligned content and tests)

**The V2 pipeline:**
```
Official Syllabus --> Micro-topic Decomposition --> PYQ Pattern Analysis
        |                                                    |
        v                                                    v
   Syllabus Registry                              PYQ Intelligence Engine
   (SCOPE: what can be asked)                     (BEHAVIOR: what IS asked)
        |                                                    |
        +--------------------+-------------------------------+
                             |
                             v
                   Prediction Confidence Score
                   (per micro-topic)
                             |
               +-------------+-------------+
               |                           |
               v                           v
        Content Notes                Test Series
        (PYQ-aligned,               (Topic -> Section ->
         bilingual,                  Subject -> FLT ->
         10Q mini-mock)              Grand Mock)
               |                           |
               +-------------+-------------+
                             |
                             v
                    Paid Courses & Subscriptions
```

**What carries forward from V1:**
- Moodle 4.5 LTS backend, domain, Razorpay integration
- 3-layer language model (System EN / Course EN+TE / Exam EN<->TE toggle)
- Hybrid Model (Master Question Bank + Syllabus Registry + Tag-filtered quizzes)
- Tier system (G4 -> G3 -> G2 -> G1)
- 4-dimensional CA classification
- Bilingual multilang XML structure (already correct)
- Question Writing Standard v1.0

**What is NEW in V2:**
- Syllabus Intelligence System (5-level hierarchy with 7 metadata fields per micro-topic)
- PYQ Intelligence Engine (behavioral analysis + prediction formula)
- Mandatory Content Note Format (10-field structure tied to PYQ data)
- Course vs Test Series as independent SKUs
- Model-Stability Rulebook (LLM-agnostic generation rules)
- Clean Reset + Migration Strategy

**What is NEW in V2.1:**
- Commission Blending Rule (subject-aware cross-commission weighting)
- Prediction Validation Loop (post-FLT + post-exam feedback mechanism)
- Quality-Gated Sprint Roadmap (freeze points between phases)
- Per-section content length caps (R24-R27)
- Minimum Coverage Guarantee (every micro-topic gets baseline coverage regardless of prediction score)

---

# SECTION 2: VERSION 2 PHILOSOPHY

### Core Principles

1. **Syllabus is the boundary.** Nothing outside syllabus scope gets generated. Every micro-topic must trace to an exact syllabus line.

2. **PYQs are the intelligence.** They reveal the commission's mindset -- which topics they prioritize, how they frame questions, what cognitive level they test. PYQs are the "outcome of the Exam Board Mindset."

3. **Prediction drives priority, not inclusion.** Content notes, mock tests, and test series are all downstream of the prediction model. High-prediction topics get generated first, get more questions, and appear more frequently in tests. But every syllabus micro-topic receives baseline coverage regardless of prediction score (see Section 4.7). Prediction determines **how much emphasis** a topic gets -- never **whether** it gets covered.

4. **Model-agnostic stability.** Whether Claude, Codex, GPT, Gemini, or any future LLM generates content, the output must follow identical structural rules. No model-specific pattern deviation.

5. **Bilingual by default.** Every content note and every question exists in English + Telugu. Language is a presentation layer, not a data layer.

6. **No noise.** Content must be crisp, structured, and exam-relevant. Lengthy, unfocused content creates laziness and deviation for students.

7. **Independent SKUs.** Courses (content + mini-mock) and Test Series (topic/section/subject/FLT/grand mock) are separate products, separately purchasable.

### The 5-Step Strategic Flow (from owner's handwritten plan)

```
STEP 1: UNDERSTAND INPUTS
  Syllabus --> Scope (where they WILL focus)
  PYQs     --> Behavior (where they ARE focusing)
           --> "Outcome of the Exam Board Mindset"

STEP 2: CONSOLIDATE
  Cross-reference Syllabus + PYQs
  Achieve ~100% exam pattern prediction

STEP 3: COURSE PREPARATION + MOCKS
  Content (crispy, structured, noise-free)
  + Mini-Mock per topic (from same content)
  Resources: NCERT 6-12, Standard books (Laxmikanth, GC Leong, RS Sharma),
             Government reports, PIB, Ministry websites

STEP 4: TEST SERIES (Prediction Rate must reach 100%)
  Topic-wise --> Section-wise --> Subject-wise --> FLT Series + Grand Mock
  Strictly follow Syllabus & PYQs to predict

STEP 5: PAID COURSES & SUBSCRIPTIONS
  Distribute and monetize
```

---

# SECTION 3: LANGUAGE SYSTEM DESIGN

### 3.1 Three-Layer Architecture (Carried from V1, Enhanced for V2)

| Layer | Scope | Default | Switching | V2 Enhancement |
|-------|-------|---------|-----------|----------------|
| Layer 1: System UI | Moodle menus, buttons, navigation | English always | Never | No change |
| Layer 2: Course Content | Study notes, content pages | English | EN/TE toggle per page (no reload) | **NEW: Every content note must have both EN and TE versions** |
| Layer 3: Exam/Quiz | Questions + options during quiz | Student choice | Large visible toggle during exam | No change |

### 3.2 Layer 2 Enhancement (NEW in V2)

V1 only required bilingual at quiz level. V2 requires bilingual at **content note level** too:
- Every content note page must have EN and TE versions
- Toggle button inside content page (visible, prominent)
- Switching must NOT reload the page -- JS toggle on multilang spans
- Terminology must follow official government exam standards

### 3.3 Technical Recommendation

**Immediate (Moodle-only phase):**
- Content notes stored as Moodle Page resources with `<span lang="en" class="multilang">` / `<span lang="te" class="multilang">` tags (same structure as questions)
- JS injection adds toggle button on both content pages AND quiz pages
- Moodle's multilang filter renders the correct language
- State stored in `localStorage`

**Permanent (Next.js frontend phase, Sprint F8+):**
- Content notes served via Moodle REST API
- Next.js parses multilang structure and renders natively
- React language toggle component (no Moodle dependency)

**Verdict:** Moodle multilang filter + JS toggle handles BOTH content and quiz layers. No separate JS + structured storage needed. No deferral required. The existing multilang architecture extends naturally to content notes.

### 3.4 Terminology Standard

- Use official APPSC/TSPSC exam terminology (not Wikipedia/textbook terminology)
- Maintain a **Terminology Dictionary** (EN-TE mapping of ~500 key exam terms)
- Examples: "Fundamental Rights" = "ప్రాథమిక హక్కులు", "Directive Principles" = "ఆదేశిక సూత్రాలు"
- This dictionary is shared across all LLM generation prompts to ensure consistency

---

# SECTION 4: SYLLABUS INTELLIGENCE ARCHITECTURE

### 4.1 The Hierarchy (5 Levels)

```
Level 0: EXAM
  e.g., APPSC Group 1 Prelims Paper I

Level 1: SUBJECT (Section in syllabus)
  e.g., (A) History & Culture

Level 2: SECTION (Numbered item in syllabus)
  e.g., A.1 -- Ancient India (IVC, Vedic, Mauryas, Guptas...)

Level 3: TOPIC
  e.g., The Mauryan Empire

Level 4: MICRO-TOPIC (atomic unit -- the smallest testable concept)
  e.g., Administration of Ashoka
  e.g., Ashokan Edicts and their significance
  e.g., Kalinga War and its impact
  e.g., Decline of the Mauryan Empire
```

### 4.2 Micro-Topic Metadata (7 Fields per Micro-Topic)

Every micro-topic in the Syllabus Registry carries:

| # | Field | Description | Example |
|---|-------|-------------|---------|
| 1 | `syllabus_ref` | Exact line from official syllabus PDF | "G1P-P1-A.1: The Mauryan, Foreign invasions..." |
| 2 | `group_applicability` | Which groups include this topic | `G1,G2,G3,G4` or `G1,G2` or `G1_ONLY` |
| 3 | `depth_level` | Expected depth of testing | `awareness` / `understanding` / `analytical` |
| 4 | `content_type` | Nature of content | `static` / `dynamic` / `static+dynamic` |
| 5 | `pyq_frequency` | How often this appeared in PYQs (0-10 scale) | `8` (Mauryas appear frequently) |
| 6 | `difficulty_trend` | Observed difficulty trajectory | `stable_medium` / `increasing` / `decreasing` |
| 7 | `prediction_priority` | Computed score (see Section 5) | `0.85` |

### 4.3 Syllabus Decomposition -- APPSC G1 Prelims Paper I (Verified from Official PDF)

**Exam: APPSC Group 1 Prelims | Paper I: General Studies | 120Q / 120 Marks / 120 Min**

```
(A) HISTORY & CULTURE (~20-25Q estimated)
  A.1  Ancient India
       - Indus Valley Civilization (features, sites, society, culture, art, religion)
       - Vedic Age
       - Mahajanapadas
       - Jainism and Buddhism
       - The Magadhas
       - The Mauryan Empire (administration, Ashoka, edicts, decline)
       - Foreign invasions (Greeks, Sakas, Parthians) and impact
       - The Kushans
       - The Satavahanas
       - The Sangam Age
       - The Sungas
       - The Gupta Empire (admin, social, religious, economic, art, architecture, literature, science)
  A.2  South Indian Dynasties & Kanauj
       - The Kanauj and contributions
       - Badami Chalukyas
       - Eastern Chalukyas
       - Rashtrakutas
       - Kalyani Chalukyas
       - Cholas
       - Hoysalas
       - Yadavas
       - Kakatiyas
       - Reddis
  A.3  Medieval India
       - Delhi Sultanate (administration, economy, society, religion, literature, art, architecture)
       - Vijayanagar Empire
       - Mughal Empire
       - Bhakti Movement
       - Sufism
  A.4  European Arrival
       - European trading companies (struggle for supremacy)
       - Special reference: Bengal, Bombay, Madras, Mysore, Andhra, Nizam
       - Governor-Generals and Viceroys
  A.5  Modern India
       - 1857 Revolt (origin, nature, causes, consequences, significance)
       - Religious and Social Reform Movements (19th century)
       - Freedom Movement
       - Revolutionaries (India and abroad)
  A.6  Gandhi Era & Post-Independence
       - Mahatma Gandhi (thoughts, principles, philosophy, satyagrahas)
       - Sardar Patel, Subhash Chandra Bose
       - Post-independence consolidation
       - B.R. Ambedkar (life, contribution to Constitution)
       - Reorganization of States

(B) POLITY, CONSTITUTION, SOCIAL JUSTICE & IR (~20-25Q)
  B.1  Indian Constitution (evolution, features, preamble, FR, FD, DPSP, amendments, basic structure)
  B.2  Union & States (functions, responsibilities, parliament, state legislatures, federal structure, devolution)
  B.3  Constitutional Authorities (powers, functions, Panchayati Raj, public policy, governance)
  B.4  LPG impact on governance, statutory/regulatory/quasi-judicial bodies
  B.5  Rights Issues (human, women, SC/ST, child)
  B.6  Foreign Policy, International Relations, important institutions, central/state govt programmes

(C) ECONOMY & AP ECONOMY (~20-25Q)
  C.1  Indian Economy basics (developing economy, planning, NITI Aayog, HDI, sustainable development)
  C.2  National Income, demographics, poverty, unemployment, rural/urban development
  C.3  Agriculture, industry, trade (irrigation, MSP, food security, Make-in-India, SEZs, WTO)
  C.4  Financial institutions (RBI, banking reforms, NPAs, markets, GST, fiscal policy, budget)
  C.5  AP Economy (post-bifurcation, natural resources, infrastructure, IT, social welfare)

(D) GEOGRAPHY (~15-20Q)
  D.1  General Geography (earth, atmosphere, oceans, climate)
  D.2  Physical (India + AP: landforms, drainage, climate, vegetation, soils, minerals)
  D.3  Social (population, density, literacy, urbanization, migration)
  D.4  Economic (agriculture, industry, services, transport, trade)

(Paper II: General Aptitude -- 120Q / 120 Marks / 120 Min)
  Logical Reasoning, Number Series, Coding, Relations, Venn Diagrams,
  Clocks/Calendar/Age, Ratio/Proportion, Statistics, Geometry, DI,
  Emotional Intelligence, Social Intelligence, Science & Tech,
  ICT, Space & Defence, Energy, Environment, Current Events
```

### 4.4 Group Applicability Mapping

| Tier | Who sees it | Example topics |
|------|------------|----------------|
| `ALL_GROUPS` (G4 tier) | G1, G2, G3, G4 | Fundamental Rights basics, India's physical geography, basic economy |
| `G3_PLUS` | G1, G2, G3 | Constitutional amendments, parliamentary procedures, international organizations |
| `G2_PLUS` | G1, G2 | Judicial activism, fiscal federalism, environmental treaties, advanced AP history |
| `G1_ONLY` | G1 only | Philosophy of Constitution, comparative governance, advanced economic theory |

**Rule: Not even a single topic must be left behind.**

### 4.5 Syllabus Registry Format (CSV) -- [UPDATED in V2.1]

```
micro_topic_id, subject, section, topic, micro_topic, syllabus_ref,
group_applicability, depth_level, content_type, pyq_frequency,
difficulty_trend, prediction_priority, data_confidence,
prelims_or_mains, paper
```

**`data_confidence` field (NEW in V2.1):**

| Value | Meaning | When |
|-------|---------|------|
| `high` | Prediction grounded in 5+ APPSC data points | Reliable -- act on this score |
| `medium` | 2-4 APPSC data points available | Usable -- but verify with exam intuition |
| `low` | 0-1 APPSC data points, primarily UPSC-proxy | Flag for review -- may not reflect APPSC behavior |

**Example row:**
```
MT-HIST-A1-004, History, A.1, Mauryan Empire, Ashokan Edicts,
"G1P-P1-A.1: The Mauryan...Art Architecture Literature Science",
ALL_GROUPS, understanding, static, 7, stable_medium, 0.82, medium,
prelims, paper1
```

### 4.6 Existing Asset to Reuse

The HTML files at `G1+G2_MASTER PLAN HTML FILES/PART1_HISTORY.html` through `PART4_EXCLUSIVE_AP_HISTORY.html` already contain a working-draft syllabus registry with group badges (G1P, G2P, G1M, G2M, All). These serve as the starting template -- verify against the official syllabus PDFs in `APPSC_Syllabus/` and convert to CSV format.

### 4.7 Minimum Coverage Guarantee -- [NEW in V2.1]

**Problem solved:** The prediction engine (Section 5.6) assigns scores from 0 to 1. Without a coverage floor, low-prediction topics risk receiving no content note, no test coverage, and no student exposure. If the commission rotates to a previously low-frequency topic, students are caught unprepared.

**Rule: Prediction controls VOLUME and PRIORITY. It cannot eliminate BASELINE COVERAGE.**

```
MINIMUM COVERAGE GUARANTEE (MCG)

For EVERY micro-topic in the Syllabus Registry — regardless of prediction score:

  (a) ONE complete content note (all 10 fields, per Section 6.1)
  (b) ONE mini-mock (10 questions, embedded in the content note)
  (c) AT LEAST ONE appearance in a section-level or subject-level test
  (d) Content depth must match or exceed the syllabus-defined depth_level

No micro-topic may be skipped, deferred indefinitely, or given a
placeholder note. If it is in the syllabus, it gets full baseline treatment.
```

**What prediction DOES control (above the baseline):**

| Dimension | Low Prediction (< 0.4) | Medium (0.4-0.7) | High (> 0.7) |
|-----------|----------------------|-------------------|---------------|
| Content note | 1 (baseline) | 1 | 1 |
| Mini-mock questions | 10 (baseline) | 10 | 10 |
| Additional standalone topic tests | 0 | 1 | 2-3 |
| Appearances in section tests | 1-2 questions | 3-5 questions | 5-8 questions |
| Appearances in FLTs | Via 15% rotation buffer | Via 25% mid-tier | Via 60% high-tier |
| Content note generation order | Last batch | Middle batch | First batch |

**Depth Floor Rule:**

```
The depth_level field in the Syllabus Registry (awareness / understanding / analytical)
is set based on the OFFICIAL SYLLABUS — how prominently and deeply the topic is mentioned.

Prediction score CANNOT reduce depth below this floor:
  - If syllabus says depth_level = "analytical" and prediction = 0.15,
    the content note MUST still cover analytical depth.
  - Prediction may INCREASE depth (e.g., a topic the commission is
    suddenly emphasizing), but never DECREASE it.

depth_level is a SYLLABUS property.
prediction_priority is a PYQ-BEHAVIORAL property.
They are independent dimensions. Neither overrides the other.
```

**Why this matters for exam success:**
Commissions rotate. UPSC spent years ignoring Art & Culture, then it became 8-10 questions in a single year. APPSC can do the same. The 15% FLT rotation buffer (Section 7.4) provides test exposure, but the MCG ensures every topic has study material ready BEFORE the exam surprises you.

---

# SECTION 5: PYQ INTELLIGENCE ENGINE

### 5.1 Core Philosophy

From the owner's handwritten notes:
- **(i) Which topics** the board is picking
- **(ii) How** they are picking (question framing pattern)
- **(iii) Why** they are picking (exam board mindset)

PYQs are the **outcome of the Exam Board Mindset**. Analyzing them reveals predictable patterns.

### 5.2 Data Sources

| Source | Coverage | Purpose |
|--------|----------|---------|
| Disha UPSC 26 Years Solved Papers | 1997-2022 UPSC Prelims | Master behavioral dataset (largest sample) |
| APPSC Group 1 PYQs (2020 Prelims + others) | Limited years | Direct pattern for target exam |
| APPSC Group 2 PYQs (2017, 2019, 2025) | Multiple years | Cross-reference for shared topics |
| APPSC Group 3 PYQs (2018) | Limited | Lower-tier pattern validation |

**Strategy:** Use UPSC 26-year data as the master behavioral model (largest dataset, highest question quality). APPSC patterns largely mirror UPSC for GS topics. APPSC-specific patterns (AP History, AP Economy) are analyzed from APPSC PYQs directly.

### 5.3 PYQ Analysis Schema (Per Question)

For each PYQ question extracted:

| Field | Values | Purpose |
|-------|--------|---------|
| `pyq_id` | `UPSC-2022-P1-042` | Unique identifier |
| `commission` | `UPSC` / `APPSC` / `TSPSC` | Source commission |
| `year` | `2022` | Year of exam |
| `paper` | `paper1` / `paper2` | Which paper |
| `subject` | `history` / `polity` / `economy` / `geography` / `science` / `ca` | Subject area |
| `micro_topic_id` | `MT-HIST-A1-004` | Maps to Syllabus Registry |
| `question_type` | See below | How it's framed |
| `cognitive_level` | See below | What it tests |
| `difficulty` | `easy` / `medium` / `hard` / `very_hard` | Difficulty |
| `recurrence` | `first_time` / `repeat_topic` / `repeat_exact` | Has this been asked before? |
| `ca_linked` | `true` / `false` | Is it connected to current affairs? |

### 5.4 Question Type Classification

From PYQ analysis and owner's handwritten notes:

| Type | Code | Description | Example Pattern |
|------|------|-------------|-----------------|
| Static Factual | `STATIC` | Direct recall of facts | "Who founded...?" "When was...?" |
| Statement-based | `STMT` | "Consider: (i), (ii), (iii). Which are correct?" | Classic UPSC pattern |
| Analytical | `ANALYTICAL` | Requires reasoning beyond facts | "Which of the following best explains...?" |
| Elimination | `ELIM` | Designed to test by ruling out wrong options | "Which is NOT correct?" |
| CA-linked Static | `CA_STATIC` | Current event + static concept combined | "Recently X happened. This relates to which Article?" |
| General Knowledge | `GK` | Broad awareness questions | Awards, schemes, rankings |
| Government Schemes | `SCHEME` | Specific govt programme knowledge | "Under which scheme...?" |
| Match-the-following | `MATCH` | Column A to Column B matching | "Match List I with List II" |
| Assertion-Reason | `AR` | "Assertion (A)... Reason (R)..." | Classic for Polity/Science |

### 5.5 Cognitive Level Classification

| Level | Code | Description | Bloom's Mapping |
|-------|------|-------------|-----------------|
| Recall | `L1` | Direct fact retrieval | Remember |
| Conceptual | `L2` | Understanding of concept, not just fact | Understand |
| Applied | `L3` | Apply concept to new situation | Apply/Analyze |
| Interlinking | `L4` | Connect 2+ topics/subjects | Analyze/Evaluate |

### 5.6 Prediction Confidence Model

```
Prediction_Confidence(micro_topic) =
    w1 * Frequency_Score
  + w2 * Depth_Score
  + w3 * Recurrence_Score
  + w4 * Syllabus_Priority
  + w5 * Trend_Momentum

Where:
  Frequency_Score    = (times_asked / total_questions_in_subject) normalized 0-1
  Depth_Score        = depth_level mapped to numeric (awareness=0.3, understanding=0.6, analytical=1.0)
  Recurrence_Score   = pattern of re-appearance (0 = never asked, 1 = asked every year)
  Syllabus_Priority  = position weight in syllabus + explicit mention weight (0-1)
  Trend_Momentum     = recent 5-year trend vs older trend (+1 = increasing, 0 = stable, -1 = declining)

Default weights: w1=0.30, w2=0.15, w3=0.25, w4=0.15, w5=0.15
```

**Output:** Every micro-topic gets a prediction score from 0 to 1. This drives:
- Content note priority (high-prediction topics get detailed notes first)
- Question generation volume (more questions for high-prediction topics)
- Test series composition (weighted toward high-prediction areas)

### 5.6.1 Commission Blending Rule -- [NEW in V2.1]

**Problem:** The prediction formula (5.6) computes scores from PYQ data, but APPSC has only 5-7 papers while UPSC has 26 years. Without explicit blending rules, UPSC patterns will dominate ALL predictions — including AP-specific topics that UPSC never tests.

**Rule: Subject-aware commission weighting**

```
When computing Frequency_Score and Recurrence_Score for a micro-topic:

CASE 1: AP-SPECIFIC TOPIC
  (AP History, AP Economy, AP Geography, AP Social Welfare)
  APPSC_weight = 1.0
  UPSC_weight  = 0.0
  Rationale: UPSC never tests these. Only APPSC data is relevant.

CASE 2: SHARED GS TOPIC with sufficient APPSC data (5+ questions across papers)
  APPSC_weight = 0.6
  UPSC_weight  = 0.4
  Rationale: Enough local data to lead. UPSC supplements.

CASE 3: SHARED GS TOPIC with sparse APPSC data (0-4 questions)
  APPSC_weight = 0.3
  UPSC_weight  = 0.7
  Flag: data_confidence = "low"
  Rationale: Insufficient local data. UPSC proxy is more reliable
  than guessing from 1-2 questions. Flag for manual review.
```

**Auto-adjustment:** As new APPSC papers become available (see Section 5.8, Trigger 3), topics may shift from Case 3 to Case 2. The `data_confidence` field in PREDICTION_SCORES.csv updates automatically.

**Implementation:** The `prediction_calculator.py` script must accept a `topic_category` field (`ap_specific` or `shared_gs`) from the Syllabus Registry to determine which case applies.

### 5.7 Cross-Commission Application

| Commission | PYQ Data Available | Strategy |
|------------|-------------------|----------|
| APPSC | Limited (5-7 papers) | Primary target. Use UPSC patterns as proxy for GS (per blending rule 5.6.1). Use APPSC-only data for AP topics. |
| TSPSC | Similar to APPSC | Mirror architecture. Replace AP-specific with TS-specific. Shared GS intelligence. |
| UPSC | 26 years (Disha book) | Master behavioral dataset. Highest statistical reliability. |

### 5.8 Prediction Validation Loop -- [NEW in V2.1]

**Purpose:** The prediction model must not be static. Without feedback, the "Exam Intelligence Engine" is a one-time analysis that degrades with each passing exam cycle. This section defines three validation triggers that make the engine self-correcting.

```
PREDICTION ENGINE (Section 5.6)
        |
        v
  Generates scores --> Drives content & tests
        |                       |
        |                       v
        |               FLTs administered to students
        |                       |
        +<--- TRIGGER 1 -------+  (Post-FLT internal review)
        |
        |               Actual APPSC/TSPSC exam occurs
        |                       |
        +<--- TRIGGER 2 -------+  (Post-exam external review)
        |
        |               New PYQ paper obtained
        |                       |
        +<--- TRIGGER 3 -------+  (New data recalculation)
```

**TRIGGER 1: Post-FLT Internal Review**

After each Full Length Test is administered to students:

| Metric | What to Track | Target |
|--------|--------------|--------|
| Prediction coverage | % of FLT questions from micro-topics with prediction > 0.7 | 60% (+/- 5%) |
| Question type distribution | Actual % vs PYQ target (Section 7.4) | Within 5% of each target |
| Difficulty distribution | Actual % vs target (30/40/25/5) | Within 5% of each band |
| Student performance | Average score, pass rate, time utilization | Track trend across FLTs |
| Subject balance | Questions per subject vs expected weight | Within 2 questions of target |

**Output:** `FLT_VALIDATION_REPORT.md` stored in `ARCHITECTURE_V2/PYQ_INTELLIGENCE/`
**Action:** If any metric deviates >10% from target, flag for review before next FLT.

**TRIGGER 2: Post-Exam External Review**

After each actual APPSC or TSPSC exam:

```
Step 1: Obtain the actual exam question paper
Step 2: Map every exam question to our micro-topic registry
Step 3: Calculate Prediction Hit Rate:

  Hit_Rate = (exam Qs from micro-topics where our prediction > 0.5)
             / (total exam Qs)

  Target:  Year 1 (first exam cycle):  Hit Rate > 70%
           Year 2 (second exam cycle): Hit Rate > 80%
           Year 3+:                    Hit Rate > 85%

Step 4: Identify MISSES:
  - Topics we MISSED: appeared in exam, our prediction < 0.4
    Action: Investigate why. Increase Syllabus_Priority weight.
  - Topics we OVER-PREDICTED: prediction > 0.7 but not in exam
    Action: Check if one-exam anomaly or systematic over-weighting.

Step 5: Adjust formula weights (w1-w5) if systematic bias detected
  - Only adjust after 2+ exam cycles show consistent pattern
  - Never adjust more than +/- 0.05 per weight per cycle
  - Document every adjustment in WEIGHT_ADJUSTMENT_LOG.csv
```

**Output:** `EXAM_VALIDATION_REPORT.md` stored in `ARCHITECTURE_V2/PYQ_INTELLIGENCE/`

**TRIGGER 3: New PYQ Data Available**

When a new APPSC/TSPSC paper is obtained:

```
1. Add all questions to the relevant PYQ analysis CSV
2. Recalculate all prediction scores (run prediction_calculator.py)
3. Commission blending auto-adjusts:
   - Topics that were Case 3 (sparse) may become Case 2 (sufficient)
   - data_confidence upgrades from "low" to "medium" or "high"
4. Generate diff report: which micro-topics changed by > 0.1?
5. Flag changed topics for content review (may need note updates)
```

**Output:** `PYQ_UPDATE_REPORT.md` stored in `ARCHITECTURE_V2/PYQ_INTELLIGENCE/`

---

# SECTION 6: CONTENT NOTE MODEL

### 6.1 Mandatory 10-Field Structure

Every content note (the atomic unit of study material) MUST contain:

```
CONTENT NOTE: [Micro-Topic Title]
===================================

1. MICRO-TOPIC TITLE
   [Clear, specific title]

2. SYLLABUS REFERENCE
   [Exact line from official APPSC syllabus with code]
   Example: "G1P-P1-A.1: The Mauryan...their Administration"

3. PYQ REFERENCES
   | Year | Commission | Question Type | Difficulty | Framing Pattern |
   | 2020 | APPSC G1   | STATIC        | Medium     | "Who founded...?" |
   | 2019 | UPSC       | STMT          | Hard       | "Consider (i),(ii),(iii)" |

4. WEIGHTAGE TREND ANALYSIS
   [How often this appears, is it increasing/decreasing,
    expected weight in upcoming exam]

5. EXPECTED DIFFICULTY
   [Based on PYQ trends: Easy/Medium/Hard]

6. POSSIBLE FUTURE FRAMING PATTERNS
   [Based on PYQ intelligence: how the commission might frame
    questions on this topic next time]
   Example: "Likely as statement-based (i,ii,iii) combining Ashokan
            edicts with Kalinga War impact"

7. STATIC CORE CONTENT
   [Crisp, structured, noise-free factual content]
   [Bullet points preferred over paragraphs]
   [Must cover ALL testable facts for this micro-topic]

8. DYNAMIC INTEGRATION
   [Current affairs angles connecting to this static topic]
   [Recent events, government actions, policy changes]

9. COMMON TRAPS
   [Frequently confused facts, common mistakes,
    tricky options that appear in PYQs]

10. MINI-MOCK (10 Questions)
    [10 MCQs generated from THIS content note only]
    [Mix: 4 easy, 4 medium, 2 hard]
    [Must follow Question Writing Standard v1.0]
    [Bilingual: EN + TE]
```

### 6.2 Content Quality Rules

- If content is not PYQ-aligned, it must NOT be generated
- Content must be crisp -- no lengthy paragraphs that create laziness/boredom
- All information must be captured -- no gaps
- Noisy/irrelevant content must be eliminated
- Must follow official exam terminology (not casual/textbook language)
- Bilingual: every field available in English + Telugu

### 6.3 Content Sources (from owner's notes)

| Priority | Source | Use |
|----------|--------|-----|
| 1 | Official APPSC Syllabus PDFs | Scope definition |
| 2 | PYQ papers (APPSC + UPSC) | Pattern intelligence |
| 3 | NCERT textbooks (6th-12th) | Foundation facts |
| 4 | Standard books (Laxmikanth, GC Leong, RS Sharma, etc.) | Deep content |
| 5 | Government reports, PIB, Ministry websites | Dynamic/CA content |

---

# SECTION 7: TEST SERIES MODEL

### 7.1 Product Definition (Separate SKU from Courses)

Test Series = standalone assessment products. They do NOT include study content.

### 7.2 Test Hierarchy (from owner's handwritten notes)

```
Level 1: TOPIC-WISE (Micro-topic)
  Example: "Mauryan Empire" -- 10-20Q per test, multiple tests per topic
  Purpose: Drill specific knowledge

Level 2: SECTION-WISE (Section)
  Example: "Ancient Indian History" -- 30-50Q
  Purpose: Test breadth within a section

Level 3: SUBJECT-WISE (Subject)
  Example: "History & Culture" -- 50-80Q
  Purpose: Subject-level readiness assessment

Level 4: COURSE-WISE (Full Length Test Series)
  Example: FLT-01 through FLT-05
  APPSC G1 Prelims Paper I: 120Q / 120 min / -0.33 negative marking
  Purpose: Real exam simulation

Level 5: GRAND MOCK
  Example: Grand Mock 1, Grand Mock 2
  Full syllabus, full time, full difficulty
  Purpose: Final readiness assessment
```

### 7.3 Corrected FLT Configuration (from verified syllabus)

| Exam | Questions | Time | Negative Marking | Papers |
|------|-----------|------|------------------|--------|
| APPSC G1 Prelims Paper I (GS) | **120** | **120 min** | -0.33 | 1 |
| APPSC G1 Prelims Paper II (Aptitude) | **120** | **120 min** | -0.33 | 1 |
| APPSC G2 Screening | 150 | 150 min | -0.33 | 1 |
| APPSC G3 | 150 | 150 min | TBD | 1 |
| APPSC G4 | 150 | 150 min | TBD | 1 |

**Note:** G1 FLT configuration was 150Q in V1. This is WRONG. Must be corrected to 120Q.

### 7.4 Test Series Question Selection Rule

**All test questions must be weighted by Prediction Confidence:**
- 60% of questions from micro-topics with prediction score > 0.7
- 25% from prediction score 0.4-0.7
- 15% from prediction score < 0.4 (rotation buffer for surprise/emerging topics)

**15% Rotation Buffer rationale:** Commissions rotate focus areas. A topic ignored for 5 years can suddenly appear with 3-5 questions. This 15% allocation (= 18 questions in a 120Q G1 FLT) ensures students encounter low-prediction topics in exam conditions. Combined with the Minimum Coverage Guarantee (Section 4.7), which ensures every micro-topic has study material, this buffer provides both content readiness AND test exposure for topic rotation scenarios.

**Question type distribution (mimicking PYQ patterns):**
- ~30% Static Factual
- ~25% Statement-based (i, ii, iii)
- ~15% Analytical
- ~10% CA-linked
- ~10% Match/Assertion-Reason
- ~10% Government Schemes / GK

### 7.5 Current Affairs Test Products

| Product | Questions | Frequency | Coverage |
|---------|-----------|-----------|----------|
| Daily CA Practice | 10-15Q | Daily | That day's events |
| Weekly CA FLT | 30Q | Weekly | 7 days |
| Monthly CA FLT | 50Q | Monthly | 4 weeks |
| 6-Month CA Mega FLT | 100Q | Pre-exam | 6-month window |
| CA Grand FLT | 120Q | Pre-exam | 8-month window, group-filtered |

---

# SECTION 8: CURRENT AFFAIRS MODEL

### 8.1 Five Dimensions (Enhanced from V1)

```
DIMENSION 1: COVERAGE
  National | International | AP-Specific | TS-Specific

DIMENSION 2: SUBJECT MAPPING
  History | Polity | Economy | Geography | Science & Tech | Environment

DIMENSION 3: TIME LAYER
  Daily | Weekly | Monthly | 6-Month | 8-Month

DIMENSION 4: GROUP FILTERING
  G1_ONLY | G1_G2 | ALL_GROUPS | AP_ONLY | TS_ONLY

DIMENSION 5: STATIC INTEGRATION (NEW in V2)
  Which static micro-topic does this CA event connect to?
  This enables CA+Static combined questions (per PYQ pattern analysis)
```

### 8.2 CA QID Format
```
CA-{COVERAGE}-{SUBJECT}-{YYYYMM}-{SEQ}
Example: CA-NAT-POLT-202603-0001
```

### 8.3 Daily-to-Grand Flow
```
Daily (10-15Q) --> Weekly best 30Q --> Monthly best 50Q
--> 6-Month best 100Q --> Grand CA 120Q (group-filtered)
```

### 8.4 CA + Static Integration Rule

For every CA event, identify the static micro-topic it connects to. Tag the CA question with both `ca_topic` and `static_micro_topic_id`. This enables generation of CA+Static hybrid questions -- the most common type in recent APPSC/UPSC papers.

### 8.5 CA Prediction Mechanism

CA topics that align with high-prediction static micro-topics get elevated priority:
```
CA_Priority = Base_CA_Importance * (1 + 0.3 * linked_static_prediction_score)
```

### 8.6 Filtering Rules (Carried from V1 -- Unbreakable)

- APPSC exams: NEVER include TS-specific CA
- TSPSC exams: NEVER include AP-specific CA
- G4 exams: only ALL_GROUPS tier CA
- Volatile facts (prices, rankings): tagged `REVIEW_BEFORE_EXAM`

---

# SECTION 9: MODEL-STABILITY RULEBOOK

### 9.1 Purpose

When V1 Sprint 9 used Claude with a good prompt, questions were professional. When Sprint 10 used a different prompt structure, 750 questions came out broken. This proves: **the LLM is not the problem -- the prompt contract is.**

The Model-Stability Rulebook ensures ANY LLM (Claude, Codex, GPT, Gemini, open-source) produces structurally identical output.

### 9.2 Universal Rules (MUST remain constant regardless of model)

**A. Question Stem Rules**
```
R1.  Every question MUST end with "?"
R2.  No subject/category prefix in question text
R3.  No "Choose the correct answer" or "Select the correct option"
R4.  Question must be a complete grammatical sentence
R5.  Minimum 8 words, maximum 40 words per question
R6.  Use approved stems: Who, Which, What, When, Where, How, Under which Article,
     Which of the following, The [subject] is
R7.  Statement-based format: "Consider the following statements:
     (i) ... (ii) ... (iii) ... Which of the above is/are correct?"
```

**B. Option Rules**
```
R8.  Exactly 4 options (A, B, C, D) per question
R9.  Options must be roughly equal length (no obvious long/short answer)
R10. No "All of the above" or "None of the above" (max 5% usage)
R11. Options must be mutually exclusive and collectively exhaustive
R12. Distractors must be plausible (not obviously wrong)
```

**C. Tagging Rules**
```
R13. Every question tagged with: subject, micro_topic_id, difficulty, tier, question_type, cognitive_level
R14. Difficulty distribution per batch: 30% easy, 40% medium, 25% hard, 5% very_hard
R15. Question type distribution must match PYQ patterns (see Section 7.4)
```

**D. Language Rules**
```
R16. Bilingual: English + Telugu for every field
R17. Telugu must use official government exam terminology (not casual translation)
R18. Proper nouns: transliterate, do not translate (e.g., "Ashoka" = "అశోకుడు")
R19. Telugu sentence structure must be natural (not literal English-to-Telugu word mapping)
R27. Every bilingual content note and question must pass terminology dictionary
     compliance check: all EN terms listed in TERMINOLOGY_DICTIONARY.csv must use
     their exact TE counterpart. Run terminology_checker.py before finalizing any batch.
```

**E. Content Note Rules**
```
R20. All 10 fields mandatory (no field can be empty or placeholder)
R21. Bullet points over paragraphs
R22. Maximum 500 words for static core content (field 7) in EN
R23. Mini-mock must test content from THAT note only (no external knowledge)
R24. Weightage Trend + Expected Difficulty + Framing Patterns (fields 4+5+6)
     combined maximum: 150 words in EN
R25. Dynamic Integration (field 8) maximum: 100 words in EN
R26. Common Traps (field 9) maximum: 100 words in EN
```

**Per-section caps rationale (R24-R26, NEW in V2.1):**
R22 caps the largest section (static content) at 500 words. But without per-section caps, supporting fields (4-6, 8, 9) can bloat unchecked. These caps enforce crisp, exam-focused content across ALL fields. Mini-mock (field 10) is a test product and has no word cap -- it follows question structure rules R1-R12 instead.

**Total EN content note length (fields 1-9): naturally stays under ~900 words.**
Telugu follows EN structure. No separate TE cap needed.

### 9.3 Prompt Contract Template

Every LLM generation session MUST include this preamble:
```
You are generating content for GroupsGuru, an exam preparation platform.
You MUST follow the GroupsGuru Model-Stability Rulebook v2.1.

QUESTION WRITING STANDARD: [paste rules R1-R12]
TAGGING STANDARD: [paste rules R13-R15]
LANGUAGE STANDARD: [paste rules R16-R19, R27]
CONTENT LENGTH CAPS: [paste rules R20-R26]
TERMINOLOGY DICTIONARY: [paste relevant terms]

Micro-topic: [from Syllabus Registry]
PYQ Intelligence: [from PYQ Engine -- types, cognitive levels, framing patterns]
Prediction Confidence: [score]
Data Confidence: [high/medium/low -- from commission blending]

Generate: [specific output request]
```

This contract prevents the Sprint 10 pattern mismatch from ever recurring.

---

# SECTION 10: FOLDER + DB + WEBSITE ALIGNMENT

### 10.1 Local Folder Structure (V2)

```
C:\Users\jayar\OneDrive\Desktop\groupsguru\
├── ARCHITECTURE_V2/
│   ├── MASTER_ARCHITECTURE_V2.md          <-- V2.0 (historical)
│   ├── MASTER_ARCHITECTURE_V2.1.md        <-- This document (ACTIVE)
│   ├── SYLLABUS_REGISTRY/                     <-- Sprint 12 COMPLETE (1,021 rows)
│   │   ├── APPSC_G1_PRELIMS_REGISTRY.csv       (243 rows)
│   │   ├── APPSC_G1_MAINS_PAPER2_REGISTRY.csv  (157 rows - History/Culture/Geography)
│   │   ├── APPSC_G1_MAINS_PAPER3_REGISTRY.csv  (89 rows - Polity/Admin/Ethics)
│   │   ├── APPSC_G1_MAINS_PAPER4_REGISTRY.csv  (116 rows - Economy/Development)
│   │   ├── APPSC_G1_MAINS_PAPER5_REGISTRY.csv  (67 rows - Science/Technology)
│   │   ├── APPSC_G2_SCREENING_REGISTRY.csv      (31 rows)
│   │   ├── APPSC_G2_PAPER1_REGISTRY.csv         (72 rows)
│   │   ├── APPSC_G2_PAPER2_REGISTRY.csv         (62 rows)
│   │   ├── APPSC_G2_PAPER3_REGISTRY.csv         (29 rows)
│   │   ├── APPSC_G3_PAPER1_REGISTRY.csv         (28 rows)
│   │   ├── APPSC_G3_PAPER2_REGISTRY.csv         (37 rows)
│   │   ├── APPSC_G4_PAPER1_REGISTRY.csv         (90 rows)
│   │   └── TSPSC_G1_REGISTRY.csv               (future)
│   ├── PYQ_INTELLIGENCE/
│   │   ├── UPSC_26YR_ANALYSIS.csv
│   │   ├── APPSC_G1_PYQ_ANALYSIS.csv
│   │   ├── APPSC_G2_PYQ_ANALYSIS.csv
│   │   ├── PREDICTION_SCORES.csv
│   │   ├── WEIGHT_ADJUSTMENT_LOG.csv       (NEW in V2.1)
│   │   ├── FLT_VALIDATION_REPORT.md        (NEW in V2.1 -- generated per FLT)
│   │   ├── EXAM_VALIDATION_REPORT.md       (NEW in V2.1 -- generated per actual exam)
│   │   └── PYQ_UPDATE_REPORT.md            (NEW in V2.1 -- generated per new paper)
│   ├── MODEL_STABILITY_RULEBOOK.md
│   └── TERMINOLOGY_DICTIONARY.csv
│
├── COURSES/                                <-- Content Notes (NEW SKU)
│   ├── APPSC_G1/
│   │   ├── HISTORY/
│   │   │   ├── A1_ANCIENT/
│   │   │   │   ├── MT-HIST-A1-001_IVC.md
│   │   │   │   ├── MT-HIST-A1-002_VEDIC.md
│   │   │   │   ├── MT-HIST-A1-003_MAURYAS.md
│   │   │   │   └── ... (one file per micro-topic)
│   │   │   ├── A2_SOUTH_INDIAN/
│   │   │   ├── A3_MEDIEVAL/
│   │   │   └── ...
│   │   ├── POLITY/
│   │   ├── ECONOMY/
│   │   ├── GEOGRAPHY/
│   │   └── SCIENCE_ENV/
│   ├── APPSC_G2/ (shared content where tier allows, G2-specific additions)
│   ├── APPSC_G3/
│   └── APPSC_G4/
│
├── TEST_SERIES/                            <-- Test Products (SEPARATE SKU)
│   ├── APPSC_G1/
│   │   ├── TOPIC_TESTS/
│   │   ├── SECTION_TESTS/
│   │   ├── SUBJECT_TESTS/
│   │   ├── FLT_SERIES/
│   │   │   ├── FLT-01/ (120Q, Paper I format)
│   │   │   ├── FLT-02/
│   │   │   └── ...
│   │   ├── GRAND_MOCK/
│   │   └── CA_TESTS/
│   │       ├── DAILY/
│   │       ├── WEEKLY/
│   │       ├── MONTHLY/
│   │       └── MEGA/
│   ├── APPSC_G2/
│   ├── APPSC_G3/
│   └── APPSC_G4/
│
├── APPSC_TEST_SERIES/                      <-- V1 ARCHIVE (read-only)
│   └── (existing 900 questions, scripts, registry)
│
├── APPSC+UPSC_PYQS/                        <-- Source PYQ papers
├── APPSC_Syllabus/                         <-- Official syllabi
└── _SCRIPTS/                               <-- Python tools
    ├── csv_to_moodle_xml.py                (V1 -- still useful)
    ├── parse_html_registry.py              (Sprint 12 -- HTML parser + 12 CSV generator)
    ├── pyq_analyzer.py                     (Sprint 13 -- planned)
    ├── prediction_calculator.py            (Sprint 13 -- implements commission blending 5.6.1)
    ├── content_note_generator.py           (Sprint 14 -- planned)
    ├── question_validator.py               (planned)
    ├── model_stability_checker.py          (planned)
    └── terminology_checker.py              (planned -- enforces R27)
```

### 10.2 Moodle Category Structure (V2)

```
APPSC (Top Category)
├── GROUP 1 -- Civil Services
│   ├── COURSES (Content + Mini-Mock)
│   │   ├── History Course
│   │   ├── Polity Course
│   │   ├── Economy Course
│   │   ├── Geography Course
│   │   └── Science & Environment Course
│   ├── TEST SERIES
│   │   ├── Topic Tests
│   │   ├── Section Tests
│   │   ├── Subject Tests
│   │   ├── FLT Series (FLT-01 through FLT-05)
│   │   ├── Grand Mock
│   │   └── Current Affairs Tests
│   └── FREE DEMO
├── GROUP 2
├── GROUP 3
├── GROUP 4
└── QUESTION BANK (Hidden)
    ├── qb_gs_history (tiered sub-categories)
    ├── qb_gs_polity
    ├── qb_gs_economy
    ├── qb_gs_geography
    ├── qb_gs_science
    ├── qb_aps (AP-specific)
    └── qb_ca (Current Affairs)
```

### 10.3 Website Display Structure

```
groupsguru.in/
├── /courses/appsc-g1/history         (Content + embedded mini-mock)
├── /courses/appsc-g1/polity
├── /tests/appsc-g1/topic/            (Topic-wise tests)
├── /tests/appsc-g1/section/          (Section-wise tests)
├── /tests/appsc-g1/flt/              (Full Length Tests)
├── /tests/appsc-g1/grand-mock/       (Grand Mock)
├── /tests/appsc-g1/current-affairs/  (CA tests)
├── /free/                            (Free demo content)
└── /subscribe/                       (Pricing plans)
```

---

# SECTION 11: MIGRATION PLAN

### 11.1 Assessment: Clean Reset vs Incremental Fix

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **A: Clean Reset** (delete all, rebuild) | Fresh start, no legacy debt | Loses 150 clean Sprint 9 Qs, wastes Sprint 1-8 setup | NOT recommended |
| **B: Archive + Rebuild** | Preserves work, clean V2 structure | More complex migration | **RECOMMENDED** |
| **C: Patch in place** | Fastest | Accumulates technical debt | NOT recommended |

### 11.2 Recommended Migration Plan (Option B)

**Phase 1: Archive V1 (Day 1)**
```
1. Export all Moodle question banks as XML (backup)
2. Export all Moodle course list (backup)
3. Copy APPSC_TEST_SERIES/ folder to APPSC_TEST_SERIES_V1_ARCHIVE/
4. Do NOT delete anything from Moodle yet
```

**Phase 2: Create V2 Structure (Day 1-2)**
```
1. Create ARCHITECTURE_V2/ folder with Syllabus Registry CSVs
2. Create COURSES/ folder structure
3. Create TEST_SERIES/ folder structure
4. Create _SCRIPTS/ folder with new Python tools
```

**Phase 3: Salvage Sprint 9 Questions (Day 2-3)**
```
1. Sprint 9 questions (150 total, files *.01 variants) are CLEAN
2. Extract from V1 XML, re-tag with V2 micro-topic IDs
3. Place into V2 TEST_SERIES folder structure
4. These become seed questions for V2 test series
```

**Phase 4: Repair Sprint 10 Questions (Day 3-5)**
```
1. Run audit script on Sprint 10 XMLs (750 questions)
2. Regenerate broken question stems (AI-assisted, using Model-Stability Rulebook)
3. Re-tag with V2 micro-topic IDs + all required metadata
4. Validate against Question Writing Standard v1.0
5. Place into V2 TEST_SERIES folder structure
```

**Phase 5: Rebuild Moodle Courses (Day 5-7)**
```
1. Hide all V1 courses (do NOT delete -- students may have attempts)
2. Create V2 Moodle categories (per Section 10.2)
3. Import V2 question banks
4. Configure V2 quizzes (120Q/120min for G1, corrected)
5. Create V2 course shells for content
6. Test end-to-end
```

**Phase 6: Go Live on V2 (Day 7)**
```
1. Make V2 courses visible
2. Hide or archive V1 courses
3. Update any payment links / product pages
```

### 11.3 What Gets Preserved
- 150 Sprint 9 clean questions (re-tagged for V2)
- 750 Sprint 10 questions (repaired stems + re-tagged)
- Moodle infrastructure (database, users, settings, Razorpay config)
- Domain, SSL, Cloudflare tunnel
- All PYQ PDFs and syllabus PDFs
- Python scripts (csv_to_moodle_xml.py, add_negative_marking.py)

### 11.4 What Gets Rebuilt
- Moodle category hierarchy (V2 structure)
- Quiz configurations (corrected 120Q/120min for G1)
- Question tagging (V2 metadata schema)
- Folder structure (separate COURSES/ and TEST_SERIES/)

---

# SECTION 12: SPRINT ROADMAP -- [REWRITTEN in V2.1 with Quality Gates]

### Why this changed from V2.0

V2.0 had the right sequence (foundation → intelligence → content) but lacked explicit **quality gates** between phases. Without gates, there is risk of scaling broken patterns — the exact failure that caused Sprint 10's 750 broken questions. V2.1 adds three mandatory freeze points where the owner reviews and approves output before the next phase begins.

### PHASE 1: FOUNDATION LOCK (Weeks 1-2)

| Sprint | Task | Output |
|--------|------|--------|
| S11 | Repair Sprint 10 broken questions (surgical XML patch) | 750 questions fixed (extraction prep complete) |
| S11 | JS language toggle for Moodle quiz + content pages | Bilingual toggle live (script built) |
| S11 | Razorpay KYC completion (parallel, administrative) | Live payments (pending owner) |
| S12 | Decompose APPSC G1 Prelims syllabus to micro-topics | APPSC_G1_PRELIMS_REGISTRY.csv (complete) |
| S12 | Decompose APPSC G2 syllabus | APPSC_G2_REGISTRY.csv (complete) |
| S12 | Tag all 900 existing questions with V2 micro-topic IDs | Questions mapped to registry (892 matched) |
| S12 | Rebuild Moodle categories (V2 structure) | V2 Moodle live (XML generated) |

```
>>> GATE 1: REGISTRY FREEZE <<<

Owner reviews APPSC_G1_PRELIMS_REGISTRY.csv before proceeding.

Checklist:
[ ] Every official syllabus line has at least one micro-topic?
[ ] No micro-topic exists outside official syllabus scope?
[ ] Group applicability (G1/G2/G3/G4) correct for each micro-topic?
[ ] topic_category (ap_specific / shared_gs) assigned for commission blending?
[ ] Depth levels (awareness/understanding/analytical) reasonable?
[ ] No duplicate micro-topics?

FREEZE: Registry CSV is locked. No structural changes after this point.
        Individual field updates (pyq_frequency, prediction_priority) continue.
```

### PHASE 2: INTELLIGENCE LOCK (Weeks 2-3)

| Sprint | Task | Output |
|--------|------|--------|
| S13 | Analyze Disha UPSC 26-year book (subject/type/difficulty mapping) | UPSC_26YR_ANALYSIS.csv (complete) |
| S13 | Analyze available APPSC PYQ papers | APPSC_G1_PYQ_ANALYSIS.csv (complete) |
| S13 | Calculate Prediction Confidence scores (with commission blending) | PREDICTION_SCORES.csv (complete) |
| S13 | Build Model-Stability Rulebook v2.1 + Terminology Dictionary | Rulebook + Dictionary ready (200 terms complete) |

```
>>> GATE 2: PREDICTION FREEZE <<<

Owner reviews prediction output before content generation begins.

Checklist:
[ ] Review top-20 prediction scores: do they match exam intuition?
[ ] Review bottom-20 prediction scores: any important topics undervalued?
[ ] AP-specific topics use APPSC-only data (Case 1 blending)?
[ ] data_confidence = "low" topics flagged and reviewed?
[ ] Question type distribution derived from PYQ analysis looks realistic?
[ ] Terminology Dictionary has core ~200 terms (enough for first batch)?

FREEZE: Prediction model is locked for content generation.
        Weights only change via Validation Loop (Section 5.8) after exam data.
```

### PHASE 3: CONTROLLED GENERATION (Weeks 3-4)

| Sprint | Task | Output |
|--------|------|--------|
| S14 | Generate content notes for **TOP 5** prediction micro-topics only | 5 content notes + 50 mini-mock Qs (complete) |
| S14 | Generate 1 topic test + 1 section test from these 5 topics | 2 test products (deferred to S15/Moodle setup) |
| S14 | Run terminology_checker.py on all 5 notes | Terminology compliance verified (PASS) |

```
>>> GATE 3: CONTENT VALIDATION <<<

Owner manually reviews the 5 content notes + test products.

Checklist:
[ ] All 10 fields present and non-empty in each note?
[ ] Static core content crisp, exam-focused, within 500 words?
[ ] Per-section caps (R24-R26) respected?
[ ] PYQ references accurate (cross-check with actual PYQ papers)?
[ ] Framing pattern predictions plausible?
[ ] Telugu translation quality acceptable (terminology, sentence structure)?
[ ] Mini-mock questions follow Writing Standard v1.0?
[ ] Mini-mock tests only content from THAT note (R23)?
[ ] Topic test and section test feel exam-realistic?

IF ISSUES FOUND:
  - Identify pattern (is it a structural issue or one-off mistake?)
  - Fix the template/prompt contract BEFORE scaling
  - Re-generate the 5 notes with corrected contract
  - Re-validate

IF ALL CLEAR:
  - Proceed to Phase 4 (Scale Generation)
  - The validated format becomes the locked template
```

**Why Top 5, not Top 30?** If the prediction model, content format, or prompt contract has issues, you discover them on 5 notes (fixable in hours) instead of 30 notes (days of rework). This is the lesson from Sprint 10.

### PHASE 4: SCALE GENERATION (Weeks 4-6)

| Sprint | Task | Output |
|--------|------|--------|
| S15 | Generate content notes for next 25 high-prediction micro-topics (G1 History + Polity) | ~25 content notes + 250 mini-mock Qs |
| S15 | Generate content notes for Economy + Geography + Science | ~40 content notes + 400 Qs |
| S15 | Generate G2-specific content (shared + G2-only topics) | G2 ready |
| S16 | Build FLT-01 through FLT-03 for G1 (120Q each, V2 structure) | 3 full-length tests |
| S16 | Build Grand Mock for G1 | 1 grand mock |
| S16 | Run FLT Validation (Trigger 1, Section 5.8) on FLT-01 | FLT_VALIDATION_REPORT.md |
| S17 | G3 and G4 content (filtered from master bank) | G3 + G4 test series |
| S18 | CA pipeline: first month of current affairs processing | CA tests live |

### PHASE 5: FRONTEND (Parallel from Week 3)

| Sprint | Task | Output |
|--------|------|--------|
| F0-F3 | Next.js scaffolding, landing page, auth, course catalog | Frontend foundation |
| F4-F6 | Quiz interface, study planner, dashboard | Core product |
| F7 | Payment integration, subscription system | Revenue flow |
| F8 | **Native language toggle in quiz player** (permanent solution) | Bilingual frontend |
| F9-F12 | Analytics, mobile PWA, polish, launch | Production ready |

### PHASE 6: SCALE (Weeks 7+)

| Sprint | Task |
|--------|------|
| S19 | TSPSC mirror architecture |
| S20 | Mains content (descriptive format) |
| S21+ | Scale to 5000+ questions, daily CA automation |
| Ongoing | Prediction Validation Loop (Section 5.8) after each FLT and actual exam |

---

# SECTION 13: IMMEDIATE ACTIONS (What You Must Provide/Do First)

### Before ANY execution can begin:

**ALREADY PROVIDED (confirmed available in project):**
1. Official APPSC G1 Prelims syllabus PDF -- `APPSC_Syllabus/APPSC_GROUP-1/Group-I Preilms Syllabus .pdf`
2. Official APPSC G1 Mains syllabus PDF -- `APPSC_Syllabus/APPSC_GROUP-1/Group-I Main Syllabus final.pdf`
3. Official APPSC G2 syllabus PDF -- `APPSC_Syllabus/APPSC_GROUP -2/GROUP-II_Syllabus.pdf`
4. Official APPSC G3 syllabus PDF -- `APPSC_Syllabus/APPSC_GROUP-3/GROUP_3 SYLLABUS.pdf`
5. Official APPSC G4 syllabus PDF -- `APPSC_Syllabus/APPSC_GROUP-4/APPSC Group 4 SYLLABUS.pdf`
6. UPSC Disha 26-year book -- `APPSC+UPSC_PYQS/UPSC MRUNAL PYQS/Disha UPSC 26 years Solved Papers 1 & 2.pdf`
7. 13 APPSC PYQ papers -- `APPSC+UPSC_PYQS/`

**EXECUTION ORDER (V2.1 -- with gates):**
```
Step 1: Architecture V2.1 LOCKED (this document)
Step 2: Sprint 11 -- repair 750 questions + JS toggle + KYC
Step 3: Sprint 12 -- syllabus decomposition to micro-topics
        >>> GATE 1: Registry Freeze (owner review) <<<
Step 4: Sprint 13 -- PYQ intelligence analysis + prediction scores
        >>> GATE 2: Prediction Freeze (owner review) <<<
Step 5: Sprint 14 -- Top 5 content notes (validation batch)
        >>> GATE 3: Content Validation (owner review) <<<
Step 6: Sprints 15-18 -- Scale generation (validated format)
```

**OWNER DECISIONS NEEDED:**
1. Confirm priority exam: APPSC G1 Prelims Paper I (GS) first?
2. Confirm: proceed with Archive + Rebuild migration (Option B)?
3. Confirm: correction to 120Q/120min for G1 FLTs?

---

*GroupsGuru Master Architecture Document v2.1*
*Created: March 4, 2026*
*Status: EXECUTION-READY -- ARCHITECTURE LOCKED*
*V2.0 preserved at: ARCHITECTURE_V2/MASTER_ARCHITECTURE_V2.md*
*Next: Owner confirms 3 decisions above --> Sprint 11 begins*
