# MODEL-STABILITY RULEBOOK V2.1
## GroupsGuru | Updated: March 6, 2026

---

## RULE SET (R1-R27 + New from Sprint 13)

### R1-R27 (from Architecture V2.1)
[Rules documented in Architecture_V2.md L231-L310]

### New Rules from Sprint 13 based on PYQ Analysis

**R28: Ca-Linked Exclusivity Weighting**
- Questions marked `ca_linked=true` get +15% to prediction confidence IF within 2 years of exam
- Older CA questions (3+ years) reduce weight to +5%
- Purpose: Recent affairs age-decay

**R29: Repeat Topic Pattern Recognition**
- `recurrence=repeat_topic`: appears 2-3 times across 6 exams = weight +10%
- `recurrence=repeat_exact`: same question restated = weight +5% (candidates memorize)
- `recurrence=first_time`: No bonus, baseline

**R30: Cognitive Level Matching**
- L4 questions predict easier to ask targets deep understanding => +10% confidence
- L1 questions = static knowledge => stable predictability
- L2-L3 = sweet spot (60% of PYQ) => baseline weight

---

## SCHEMA COMPLIANCE CHECKLIST

- [ ] All questions have valid `micro_topic_id` or `NO_REGISTRY_MATCH_*`
- [ ] `commission` is APPSC or UPSC  
- [ ] `question_type` matches enum: ANALYTICAL | STATIC | STMT | ELIM | GK | CA_STATIC | SCHEME | MATCH | AR
- [ ] `difficulty` in [easy, medium, hard, very_hard]
- [ ] `ca_linked` is boolean (true/false)

---

*Model-Stability Rulebook v2.1*  
*Project: GroupsGuru | Sprint 13*
