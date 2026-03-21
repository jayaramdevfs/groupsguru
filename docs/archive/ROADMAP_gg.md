# GroupsGuru — Roadmap & Status
**Last updated:** 2026-03-20
**Written by:** Claude only. No Codex. No Gemini.

---

## What Is GroupsGuru

**Exam Intelligence & Predictive Preparation Engine**
- Live site: groupsguru.in (Moodle 4.5 LTS)
- Target: APPSC Group 1 + Group 2 (G3/G4 out of scope for now)
- Language: Bilingual English + Telugu
- Frontend: Not yet built (Next.js planned)

---

## What Is Live Right Now

| Item | Status |
|------|--------|
| Moodle 4.5 + SSL + Custom theme | Live |
| 28 categories, 44 courses | Created (paid = hidden, free = visible) |
| 150 clean bilingual questions | In Moodle (Sprint 9 batch) |
| Razorpay sandbox | Working (not live keys yet) |
| Language toggle JS | Written, not deployed |

---

## Completed Sprint History

| Sprint | What | Status |
|--------|------|--------|
| S1–S4 | Moodle install, DB, SSL, bilingual setup | Complete |
| S5–S6 | Roles, test accounts, Razorpay sandbox | Complete |
| S7–S8 | Language toggle JS, backup system | Complete |
| S9 | 150 clean MCQs — uploaded and verified in Moodle | Complete |
| S9.1 | Syllabus Registry — 1,021 micro-topics across 9 CSVs | Complete |
| S9.2 | G1 PYQ analysis (533 Qs mapped) + Rulebook R1-R30 | Complete |
| S9.3 | Cleanup — deleted all Codex/Gemini garbage, restructured repo | Complete |

> Everything after S9 by Codex/Gemini is erased. S9.1–S9.3 are the real Claude work that happened after S9.

---

## Micro-Sprint Plan (S10 onwards)

> **Rule:** Each micro-sprint = 1 Claude session. No sprint should hit context limits.
> **Rule:** Commit at end of every micro-sprint. Next session opens this file first.

---

### PHASE A — Prediction Engine (S10.1 – S10.2)

| Sprint | Task | Input | Output | Est. Size |
|--------|------|-------|--------|-----------|
| **S10.1** ✅ | Map G2 PYQs to micro-topic IDs | 3 readable G2 text files + `registry/g2-*.csv` | `intelligence/analysis/g2-pyq-analysis.csv` (225 Qs mapped) | Done |
| **S10.2** ✅ | Build prediction scores (G1+G2) + show top 20 | g1 + g2 analysis CSVs + registry | `intelligence/analysis/prediction-scores.csv` — 162 rows (101 G1 + 61 G2) | Done |

---

### PHASE B — Question Generation (S11.1 – S11.10)

> Each micro-sprint = 50 MCQs (5 topics × 10 questions). Bilingual. R1-R30.

| Sprint | Subject | Topics | Output |
|--------|---------|--------|--------|
| **S11.1** ✅ | History (Ancient + Medieval) | Buddhism, Ikshvakus, Post-Mauryan Art, Vijayanagar, Mughal Arch | `questions/group-1/s11.1-history-ancient-medieval.xml` — 50 MCQs DONE 2026-03-20 |
| **S11.2** | History (Modern + Freedom) | Next 5 | 50 MCQs |
| **S11.3** | Polity (Constitution + Parliament) | Top 5 | 50 MCQs |
| **S11.4** | Polity (Governance + Local Bodies) | Next 5 | 50 MCQs |
| **S11.5** | Economy (Indian + Banking + Trade) | Top 5 | 50 MCQs |
| **S11.6** | Geography (Indian + World + Physical) | Top 5 | 50 MCQs |
| **S11.7** | Science & Environment | Top 5 | 50 MCQs |
| **S11.8** | AP Specific (AP History + Culture) | Top 5 | 50 MCQs |
| **S11.9** | AP Specific (AP Geography + Polity) | Top 5 | 50 MCQs |
| **S11.10** | Gate 3 review — Jai checks 5 sample XMLs | All 450 MCQs | Approved or fix |

**Total after Phase B:** 450 new MCQs + 150 existing = **600 questions in Moodle**

---

### PHASE C — Moodle Upload + Live Features (S12.1 – S12.3)

| Sprint | Task | Output |
|--------|------|--------|
| **S12.1** | Upload all approved XMLs to Moodle (batch import) | Questions live on groupsguru.in |
| **S12.2** | Deploy language toggle JS to Moodle | EN/TE toggle working |
| **S12.3** | Razorpay KYC + live keys + test ₹1 payment | Payments live |

---

### PHASE D — More Questions (S13.1 – S13.5)

> Second round: 250 more MCQs from next-priority topics

| Sprint | Subject | Output |
|--------|---------|--------|
| **S13.1** | History (remaining topics) | 50 MCQs |
| **S13.2** | Polity + Economy (remaining) | 50 MCQs |
| **S13.3** | Geography + Science (remaining) | 50 MCQs |
| **S13.4** | AP Specific (remaining) | 50 MCQs |
| **S13.5** | Mixed — fill gaps in weak areas | 50 MCQs + upload |

**Total after Phase D:** 600 + 250 = **850 questions in Moodle**

---

### PHASE E — Frontend (S14.1 – S14.5)

> Design first. No code before Jai approves wireframes.

| Sprint | Task | Output |
|--------|------|--------|
| **S14.1** | Wireframe design (ASCII layouts, all pages) | Design doc approved by Jai |
| **S14.2** | Next.js project setup + landing page | Landing page live |
| **S14.3** | Test-taking page (timed MCQ interface) | Quiz interface working |
| **S14.4** | Results page (score + topic breakdown) | Results page working |
| **S14.5** | Student login + connect to Moodle | Auth working |

---

### PHASE F — G2 Content (S15.1 – S15.5)

| Sprint | Task | Output |
|--------|------|--------|
| **S15.1** | G2 top 5 topics — 50 MCQs | `questions/group-2/` |
| **S15.2** | G2 next 5 topics — 50 MCQs | 50 MCQs |
| **S15.3** | G2 next 5 topics — 50 MCQs | 50 MCQs |
| **S15.4** | G2 next 5 topics — 50 MCQs | 50 MCQs |
| **S15.5** | G2 upload + verify in Moodle | 200 G2 questions live |

---

## Summary — Total Micro-Sprints

| Phase | Sprints | What | Outcome |
|-------|---------|------|---------|
| A | S10.1 – S10.2 | Prediction engine | Ranked topic list |
| B | S11.1 – S11.10 | G1 questions (450) | 600 total in Moodle |
| C | S12.1 – S12.3 | Upload + toggle + payments | Site fully functional |
| D | S13.1 – S13.5 | G1 questions round 2 (250) | 850 total |
| E | S14.1 – S14.5 | Next.js frontend | Student-facing site |
| F | S15.1 – S15.5 | G2 questions (200) | 1,050 total |

**Total: 30 micro-sprints. Each = 1 session. No limits hit.**

---

## Permanent Rules

1. Claude or GPT-4o only. Codex = banned. Gemini = banned.
2. No blind Moodle imports. Every batch reviewed first.
3. Never mark a sprint Complete if it is only Partial.
4. All questions bilingual (EN + TE multilang span).
5. R1–R30 must be open before any question is generated.
6. If Claude context limit hits: stop, commit, new session opens this file first.
7. Each micro-sprint = 1 session. Commit before session ends.

---

## Key File Paths

```
docs/ARCHITECTURE.md                    ← Read this first
docs/ROADMAP.md                         ← THIS FILE — only tracking doc
registry/                               ← 9 CSVs, ~1,021 micro-topics
intelligence/analysis/                  ← PYQ analysis + prediction scores
intelligence/rulebook.md                ← R1-R30 question generation rules
intelligence/extracted/                 ← PYQ text from PDFs
syllabus/                               ← Official syllabus PDFs
pyqs/                                   ← All PYQ papers by group/year
questions/                              ← Moodle XML question bank
scripts/                                ← backup, moodle, content tools
```

---

## How Any Future Claude Session Resumes

1. Read this file
2. Find the first sprint marked "Pending" — that's where you start
3. Read `docs/ARCHITECTURE.md` if needed
4. Read `intelligence/rulebook.md` before generating questions
5. `git log --oneline -5` to see last commits
6. Do the sprint. Commit. Mark it Complete here.
