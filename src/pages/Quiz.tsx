import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { QuizAnswers, QuizResult } from "../types";
import * as api from "../services/api";
import Button, { LinkButton } from "../components/ui/Button";
import {
  IconCheck,
  IconArrow,
  IconSparkle,
  IconHeart,
  IconChat,
  IconFlask,
} from "../components/art/Icons";
import "./Quiz.css";
import { useSeo } from "../lib/seo";

const TOTAL_STEPS = 6;

type Lang = "en" | "ar";

type Dict = Record<string, string>;
const STRINGS: Record<Lang, Dict> = {
  en: {
    langToggle: "العربية",
    progress: "{pct}%",
    back: "Back",
    continue: "Continue",
    submit: "Submit for review",

    s1_eyebrow: "Step 1 — Your goal",
    s1_h: "What is your primary goal?",
    s1_p: "This helps us recommend the right peptide for you.",
    g_lose: "Weight loss",
    g_recomp: "Body recomposition",
    g_appetite: "Appetite control",
    g_research: "Research purposes",

    s2_eyebrow: "Step 2 — Your measurements",
    s2_h: "Let's calculate your BMI",
    s2_p:
      "Your body mass index helps us confirm whether treatment is appropriate for you.",
    height: "Height (cm)",
    weight: "Weight (kg)",
    bmi_label: "BMI — calculated from your answers",

    s3_eyebrow: "Step 3 — Treatment history",
    s3_h: "Have you used a weight-loss treatment before?",
    s3_p:
      "This helps us tailor your titration plan and starting dose recommendation.",
    yes_used: "Yes — I have used one before",
    no_used: "No — this would be my first time",

    s4_eyebrow: "Step 4 — Health history",
    s4_h: "Do any of the following apply to you?",
    s4_p: "Select all that apply. This information is kept confidential.",

    s5_eyebrow: "Step 5 — Pregnancy",
    s5_h: "Are you pregnant or breastfeeding?",
    s5_p:
      "GLP-1 treatments are not suitable during pregnancy or breastfeeding. Your safety is our first priority.",
    yes: "Yes",
    no: "No",
    na: "Not applicable",

    s6_eyebrow: "Step 6 — Review & consent",
    s6_h: "Check your answers",
    s6_p:
      "Please review your responses below, then give your consent for a clinician to assess them.",
    consent_text:
      "I confirm that my answers are accurate to the best of my knowledge, and I understand that a clinician may contact me to discuss my eligibility before any treatment is dispensed.",

    err_goal: "Please choose a goal to continue.",
    err_height: "Please enter a valid height between 100 and 250 cm.",
    err_weight: "Please enter a valid weight between 30 and 400 kg.",
    err_tried: "Please select an option to continue.",
    err_conditions:
      "Please select at least one option, including 'None of these' if nothing applies.",
    err_pregnant: "Please select an option to continue.",
    err_consent: "Please tick the consent box to continue.",
  },
  ar: {
    langToggle: "English",
    progress: "%{pct}",
    back: "رجوع",
    continue: "متابعة",
    submit: "إرسال للمراجعة",

    s1_eyebrow: "الخطوة 1 — هدفك",
    s1_h: "ما هو هدفك الأساسي؟",
    s1_p: "يساعدنا ذلك على توصية البپتيد المناسب لك.",
    g_lose: "خسارة الوزن",
    g_recomp: "إعادة تركيب الجسم",
    g_appetite: "التحكم في الشهية",
    g_research: "أغراض البحث",

    s2_eyebrow: "الخطوة 2 — قياساتك",
    s2_h: "لنحسب مؤشر كتلة جسمك",
    s2_p: "يساعدنا مؤشر كتلة الجسم على تأكيد ملاءمة العلاج لك.",
    height: "الطول (سم)",
    weight: "الوزن (كجم)",
    bmi_label: "مؤشر كتلة الجسم — محسوب من إجاباتك",

    s3_eyebrow: "الخطوة 3 — تاريخ العلاج",
    s3_h: "هل استخدمت علاجًا لإنقاص الوزن من قبل؟",
    s3_p: "يساعدنا ذلك على تخصيص خطة الجرعات والجرعة الابتدائية.",
    yes_used: "نعم — استخدمته من قبل",
    no_used: "لا — هذه أول مرة",

    s4_eyebrow: "الخطوة 4 — التاريخ الصحي",
    s4_h: "هل ينطبق عليك أي مما يلي؟",
    s4_p: "اختر كل ما ينطبق. تبقى هذه المعلومات سرية.",

    s5_eyebrow: "الخطوة 5 — الحمل",
    s5_h: "هل أنتِ حامل أو مرضع؟",
    s5_p: "علاجات GLP-1 غير مناسبة أثناء الحمل أو الرضاعة. سلامتك أولويتنا.",
    yes: "نعم",
    no: "لا",
    na: "لا ينطبق",

    s6_eyebrow: "الخطوة 6 — المراجعة والموافقة",
    s6_h: "راجع إجاباتك",
    s6_p:
      "يرجى مراجعة إجاباتك أدناه ثم منح موافقتك على تقييمها من قِبل أخصائي.",
    consent_text:
      "أؤكد أن إجاباتي دقيقة حسب علمي، وأفهم أنه قد يتواصل معي أخصائي لمناقشة أهليتي قبل صرف أي علاج.",

    err_goal: "يرجى اختيار هدف للمتابعة.",
    err_height: "يرجى إدخال طول صحيح بين 100 و 250 سم.",
    err_weight: "يرجى إدخال وزن صحيح بين 30 و 400 كجم.",
    err_tried: "يرجى اختيار خيار للمتابعة.",
    err_conditions: "يرجى اختيار خيار واحد على الأقل، بما في ذلك 'لا شيء مما سبق' إن لم ينطبق شيء.",
    err_pregnant: "يرجى اختيار خيار للمتابعة.",
    err_consent: "يرجى تأكيد الموافقة للمتابعة.",
  },
};

function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("quiz-lang");
    return saved === "ar" ? "ar" : "en";
  });
  useEffect(() => {
    localStorage.setItem("quiz-lang", lang);
  }, [lang]);
  return [lang, setLang];
}

const GOAL_OPTIONS = (t: Dict) => [
  { key: "lose", label: t.g_lose, icon: <IconTarget size={18} /> },
  { key: "recomp", label: t.g_recomp, icon: <IconBox size={18} /> },
  { key: "appetite", label: t.g_appetite, icon: <IconUtensils size={18} /> },
  { key: "research", label: t.g_research, icon: <IconFlask size={18} /> },
];

function CONDITIONS_FOR(lang: Lang) {
  return lang === "ar"
    ? [
        "السكري من النوع 1",
        "تاريخ مع التهاب البنكرياس",
        "تاريخ شخصي/عائلي مع سرطان الغدة الدرقية",
        "اضطراب أكل حالي أو سابق",
        "مرض شديد في المرارة",
        "لا شيء مما سبق",
      ]
    : [
        "Type 1 diabetes",
        "History of pancreatitis",
        "Personal/family history of thyroid cancer",
        "Current or past eating disorder",
        "Severe gallbladder disease",
        "None of these",
      ];
}

const NONE_LABEL_BY_LANG: Record<Lang, string> = {
  en: "None of these",
  ar: "لا شيء مما سبق",
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

const initialAnswers: QuizAnswers = { conditions: [] };

function calcBmi(h?: number, w?: number): number | null {
  if (!h || !w || h <= 0 || w <= 0) return null;
  const m = h / 100;
  return Math.round((w / (m * m)) * 10) / 10;
}

/* ---- inline icons used by goal options ---- */
const IconTarget = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5.5" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const IconBox = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M3 11h18" />
  </svg>
);
const IconUtensils = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3v8a2 2 0 0 0 2 2v8" />
    <path d="M10 3v6" />
    <path d="M14 3v8a3 3 0 0 1-3 3" />
    <path d="M18 3v18" />
  </svg>
);

export default function Quiz() {
  useSeo({
    title: "2-minute eligibility quiz",
    description:
      "Check your eligibility for clinician-reviewed GLP-1 weight-loss treatment in 2 minutes — free, and with no commitment.",
    path: "/quiz",
  });
  const [lang, setLang] = useLang();
  const t = STRINGS[lang];
  const isRtl = lang === "ar";
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const [validationError, setValidationError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const pct = Math.round((step / TOTAL_STEPS) * 100);
  const bmi = calcBmi(answers.heightCm, answers.weightKg);

  function tr(key: string, vars?: Record<string, string | number>): string {
    let s = t[key] ?? key;
    if (vars) for (const k in vars) s = s.replace(`{${k}}`, String(vars[k]));
    return s;
  }

  function goNext() {
    const err = validate(step, answers, t);
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError("");
    setDir(1);
    setStep((s) => s + 1);
  }
  function goBack() {
    setValidationError("");
    setDir(-1);
    setStep((s) => s - 1);
  }
  function setGoal(goal: string) {
    setAnswers((a) => ({ ...a, goal }));
    setValidationError("");
  }
  function setTriedBefore(value: string) {
    setAnswers((a) => ({ ...a, triedBefore: value }));
    setValidationError("");
  }
  function setPregnant(value: string) {
    setAnswers((a) => ({ ...a, pregnant: value }));
    setValidationError("");
  }
  function toggleCondition(cond: string) {
    const noneLabel = NONE_LABEL_BY_LANG[lang];
    setAnswers((a) => {
      let next: string[];
      if (cond === noneLabel) {
        next = a.conditions.includes(noneLabel) ? [] : [noneLabel];
      } else {
        const without = a.conditions.filter(
          (c) => c !== noneLabel && c !== cond
        );
        next = a.conditions.includes(cond) ? without : [...without, cond];
      }
      return { ...a, conditions: next };
    });
    setValidationError("");
  }

  async function handleSubmit() {
    if (!answers.consent) {
      setValidationError(t.err_consent);
      return;
    }
    setValidationError("");
    setSubmitting(true);
    try {
      const res = await api.evaluateQuiz(answers);
      setResult(res);
    } finally {
      setSubmitting(false);
    }
  }

  function retake() {
    setAnswers(initialAnswers);
    setResult(null);
    setStep(1);
    setDir(1);
    setValidationError("");
  }

  if (submitting) {
    return (
      <div className="quiz" dir={isRtl ? "rtl" : "ltr"}>
        <motion.div
          className="quiz__loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="quiz__spinner" aria-hidden="true" />
          <p>{isRtl ? "جارٍ مراجعة إجاباتك…" : "Reviewing your answers…"}</p>
        </motion.div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="quiz" dir={isRtl ? "rtl" : "ltr"}>
        <div className="quiz__stage">
          <AnimatePresence mode="wait">
            <motion.div
              key="result"
              className="quiz__result"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {result.eligible ? (
                <div className="quiz__result-eligible">
                  <div className="quiz__result-icon">
                    <IconSparkle size={28} />
                  </div>
                  <h2>
                    {isRtl
                      ? "تبدو مناسبًا للعلاج"
                      : "You look suitable for treatment"}
                  </h2>
                  <p>{result.reason}</p>
                  {result.bmi !== null && (
                    <div className="quiz__result-bmi">
                      <strong>{result.bmi}</strong>
                      <span>BMI</span>
                    </div>
                  )}
                  {result.recommendedProductSlug && (
                    <div className="quiz__result-rec">
                      <p className="quiz__result-rec-label">
                        {isRtl ? "موصى به لك" : "Recommended for you"}
                      </p>
                      <h3>
                        {result.recommendedProductSlug === "tirzepatide"
                          ? "Tirzepatide"
                          : "Semaglutide"}
                      </h3>
                    </div>
                  )}
                  <div className="quiz__result-actions">
                    {result.recommendedProductSlug && (
                      <LinkButton
                        to="/#products"
                        variant="light"
                        size="lg"
                      >
                        {isRtl ? "عرض العلاج الموصى به" : "View recommended treatment"}{" "}
                        <IconArrow size={16} />
                      </LinkButton>
                    )}
                    <LinkButton to="/#products" variant="secondary" size="lg">
                      {isRtl ? "تصفح جميع العلاجات" : "Browse all treatments"}
                    </LinkButton>
                  </div>
                  <div className="quiz__retake">
                    <Button variant="ghost" size="sm" onClick={retake}>
                      {isRtl ? "إعادة الاختبار" : "Retake quiz"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="quiz__result-ineligible">
                  <div className="quiz__result-ineligible-icon">
                    <IconHeart size={28} />
                  </div>
                  <h2>
                    {isRtl
                      ? "قد لا يكون العلاج مناسبًا لك الآن"
                      : "Treatment may not be right for you right now"}
                  </h2>
                  <p>{result.reason}</p>
                  <div className="quiz__result-ineligible-actions">
                    <LinkButton to="/contact" size="lg">
                      <IconChat size={16} />{" "}
                      {isRtl ? "تواصل مع فريقنا" : "Talk to our team"}
                    </LinkButton>
                    <Button variant="secondary" size="lg" onClick={retake}>
                      {isRtl ? "إعادة الاختبار" : "Retake quiz"}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz" dir={isRtl ? "rtl" : "ltr"}>
      {/* Page-level heading — visually hidden so the step layout is unchanged,
          but screen readers and search engines get a single, clear H1. */}
      <h1 className="sr-only">Check your eligibility — 2-minute quiz</h1>
      {/* Progress bar */}
      <div
        className="quiz__progress"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="quiz__progress-track">
          <div className="quiz__progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="quiz__progress-label">{tr("progress", { pct })}</span>
        <button
          type="button"
          className="quiz__lang"
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
          aria-label="Change language"
        >
          {t.langToggle}
        </button>
      </div>

      {/* Step content */}
      <div className="quiz__stage">
        <div className="quiz__card">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {step === 1 && (
                <StepGoal
                  selected={answers.goal}
                  onSelect={setGoal}
                  error={validationError}
                  t={t}
                />
              )}
              {step === 2 && (
                <StepMeasurements
                  heightCm={answers.heightCm}
                  weightKg={answers.weightKg}
                  bmi={bmi}
                  onHeight={(v) => setAnswers((a) => ({ ...a, heightCm: v }))}
                  onWeight={(v) => setAnswers((a) => ({ ...a, weightKg: v }))}
                  error={validationError}
                  t={t}
                />
              )}
              {step === 3 && (
                <StepTriedBefore
                  selected={answers.triedBefore}
                  onSelect={setTriedBefore}
                  error={validationError}
                  t={t}
                />
              )}
              {step === 4 && (
                <StepConditions
                  selected={answers.conditions}
                  onToggle={toggleCondition}
                  error={validationError}
                  t={t}
                  lang={lang}
                />
              )}
              {step === 5 && (
                <StepPregnancy
                  selected={answers.pregnant}
                  onSelect={setPregnant}
                  error={validationError}
                  t={t}
                />
              )}
              {step === 6 && (
                <StepConsent
                  answers={answers}
                  bmi={bmi}
                  consent={answers.consent ?? false}
                  onConsent={(v) =>
                    setAnswers((a) => ({ ...a, consent: v }))
                  }
                  error={validationError}
                  t={t}
                  lang={lang}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="quiz__nav">
            {step > 1 ? (
              <button className="quiz__back" onClick={goBack} type="button">
                <IconArrow size={16} />
                {t.back}
              </button>
            ) : (
              <Link to="/" className="quiz__back">
                <IconArrow size={16} />
                {t.back}
              </Link>
            )}
            {step < TOTAL_STEPS ? (
              <Button onClick={goNext} size="md">
                {t.continue}
              </Button>
            ) : (
              <Button onClick={handleSubmit} size="md">
                {t.submit}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Individual step components ---- */

function StepGoal({
  selected,
  onSelect,
  error,
  t,
}: {
  selected?: string;
  onSelect: (v: string) => void;
  error: string;
  t: Dict;
}) {
  const options = GOAL_OPTIONS(t);
  return (
    <div>
      <div className="quiz__step-head">
        <span className="eyebrow">{t.s1_eyebrow}</span>
        <h2>{t.s1_h}</h2>
        <p>{t.s1_p}</p>
      </div>
      <div className="quiz__options">
        {options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={`quiz__option${selected === opt.label ? " quiz__option--selected" : ""}`}
            onClick={() => onSelect(opt.label)}
          >
            <span className="quiz__option-dot">
              {selected === opt.label && <IconCheck size={14} />}
            </span>
            <span className="quiz__option-content">
              <span className="quiz__option-label">{opt.label}</span>
              <span className="quiz__option-icon">{opt.icon}</span>
            </span>
          </button>
        ))}
      </div>
      {error && <p className="quiz__error">{error}</p>}
    </div>
  );
}

function StepMeasurements({
  heightCm,
  weightKg,
  bmi,
  onHeight,
  onWeight,
  error,
  t,
}: {
  heightCm?: number;
  weightKg?: number;
  bmi: number | null;
  onHeight: (v: number | undefined) => void;
  onWeight: (v: number | undefined) => void;
  error: string;
  t: Dict;
}) {
  return (
    <div>
      <div className="quiz__step-head">
        <span className="eyebrow">{t.s2_eyebrow}</span>
        <h2>{t.s2_h}</h2>
        <p>{t.s2_p}</p>
      </div>
      <div className="quiz__measurements">
        <div className="field">
          <label htmlFor="quiz-height">{t.height}</label>
          <input
            id="quiz-height"
            type="number"
            min={100}
            max={250}
            value={heightCm ?? ""}
            onChange={(e) =>
              onHeight(e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>
        <div className="field">
          <label htmlFor="quiz-weight">{t.weight}</label>
          <input
            id="quiz-weight"
            type="number"
            min={30}
            max={400}
            value={weightKg ?? ""}
            onChange={(e) =>
              onWeight(e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>
      </div>
      {bmi !== null && (
        <motion.div
          className="quiz__bmi-readout"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="quiz__bmi-value">{bmi}</span>
          <span className="quiz__bmi-label">{t.bmi_label}</span>
        </motion.div>
      )}
      {error && <p className="quiz__error">{error}</p>}
    </div>
  );
}

function StepTriedBefore({
  selected,
  onSelect,
  error,
  t,
}: {
  selected?: string;
  onSelect: (v: string) => void;
  error: string;
  t: Dict;
}) {
  return (
    <div>
      <div className="quiz__step-head">
        <span className="eyebrow">{t.s3_eyebrow}</span>
        <h2>{t.s3_h}</h2>
        <p>{t.s3_p}</p>
      </div>
      <div className="quiz__options">
        {[
          { value: "yes", label: t.yes_used },
          { value: "no", label: t.no_used },
        ].map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={`quiz__option${selected === value ? " quiz__option--selected" : ""}`}
            onClick={() => onSelect(value)}
          >
            <span className="quiz__option-dot">
              {selected === value && <IconCheck size={14} />}
            </span>
            <span className="quiz__option-content">
              <span className="quiz__option-label">{label}</span>
            </span>
          </button>
        ))}
      </div>
      {error && <p className="quiz__error">{error}</p>}
    </div>
  );
}

function StepConditions({
  selected,
  onToggle,
  error,
  t,
  lang,
}: {
  selected: string[];
  onToggle: (cond: string) => void;
  error: string;
  t: Dict;
  lang: Lang;
}) {
  const list = CONDITIONS_FOR(lang);
  return (
    <div>
      <div className="quiz__step-head">
        <span className="eyebrow">{t.s4_eyebrow}</span>
        <h2>{t.s4_h}</h2>
        <p>{t.s4_p}</p>
      </div>
      <div className="quiz__checks">
        {list.map((cond) => (
          <button
            key={cond}
            type="button"
            className={`quiz__check${selected.includes(cond) ? " quiz__check--selected" : ""}`}
            onClick={() => onToggle(cond)}
          >
            <span className="quiz__check-box">
              {selected.includes(cond) && <IconCheck size={14} />}
            </span>
            {cond}
          </button>
        ))}
      </div>
      {error && <p className="quiz__error">{error}</p>}
    </div>
  );
}

function StepPregnancy({
  selected,
  onSelect,
  error,
  t,
}: {
  selected?: string;
  onSelect: (v: string) => void;
  error: string;
  t: Dict;
}) {
  const options = [
    { value: "yes", label: t.yes },
    { value: "no", label: t.no },
    { value: "na", label: t.na },
  ];
  return (
    <div>
      <div className="quiz__step-head">
        <span className="eyebrow">{t.s5_eyebrow}</span>
        <h2>{t.s5_h}</h2>
        <p>{t.s5_p}</p>
      </div>
      <div className="quiz__options">
        {options.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={`quiz__option${selected === value ? " quiz__option--selected" : ""}`}
            onClick={() => onSelect(value)}
          >
            <span className="quiz__option-dot">
              {selected === value && <IconCheck size={14} />}
            </span>
            <span className="quiz__option-content">
              <span className="quiz__option-label">{label}</span>
            </span>
          </button>
        ))}
      </div>
      {error && <p className="quiz__error">{error}</p>}
    </div>
  );
}

function StepConsent({
  answers,
  bmi,
  consent,
  onConsent,
  error,
  t,
  lang,
}: {
  answers: QuizAnswers;
  bmi: number | null;
  consent: boolean;
  onConsent: (v: boolean) => void;
  error: string;
  t: Dict;
  lang: Lang;
}) {
  const conditionsSummary =
    answers.conditions.length === 0 ? "—" : answers.conditions.join(", ");

  const dashIfMissing = (v?: string) => v ?? "—";
  const yesNoNa = (v?: string) =>
    v === "yes" ? t.yes : v === "no" ? t.no : v === "na" ? t.na : "—";
  const yesNo = (v?: string) =>
    v === "yes" ? t.yes : v === "no" ? t.no : "—";

  const rows: { key: string; val: string }[] =
    lang === "ar"
      ? [
          { key: "الهدف", val: dashIfMissing(answers.goal) },
          {
            key: "الطول / الوزن",
            val:
              answers.heightCm && answers.weightKg
                ? `${answers.heightCm} سم / ${answers.weightKg} كجم`
                : "—",
          },
          { key: "مؤشر كتلة الجسم", val: bmi !== null ? String(bmi) : "—" },
          { key: "علاج سابق", val: yesNo(answers.triedBefore) },
          { key: "حالات صحية", val: conditionsSummary },
          { key: "حامل / مرضع", val: yesNoNa(answers.pregnant) },
        ]
      : [
          { key: "Goal", val: dashIfMissing(answers.goal) },
          {
            key: "Height / Weight",
            val:
              answers.heightCm && answers.weightKg
                ? `${answers.heightCm} cm / ${answers.weightKg} kg`
                : "—",
          },
          { key: "BMI", val: bmi !== null ? String(bmi) : "—" },
          { key: "Tried treatment before", val: yesNo(answers.triedBefore) },
          { key: "Health conditions", val: conditionsSummary },
          { key: "Pregnant / breastfeeding", val: yesNoNa(answers.pregnant) },
        ];

  return (
    <div>
      <div className="quiz__step-head">
        <span className="eyebrow">{t.s6_eyebrow}</span>
        <h2>{t.s6_h}</h2>
        <p>{t.s6_p}</p>
      </div>

      <div className="quiz__summary">
        {rows.map(({ key, val }) => (
          <div key={key} className="quiz__summary-row">
            <span className="quiz__summary-key">{key}</span>
            <span className="quiz__summary-val">{val}</span>
          </div>
        ))}
      </div>

      <label className="quiz__consent-row">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => onConsent(e.target.checked)}
        />
        <span className="quiz__consent-text">{t.consent_text}</span>
      </label>

      {error && <p className="quiz__error">{error}</p>}
    </div>
  );
}

/* ---- Validation ---- */

function validate(step: number, answers: QuizAnswers, t: Dict): string {
  if (step === 1 && !answers.goal) return t.err_goal;
  if (step === 2) {
    if (!answers.heightCm || answers.heightCm < 100 || answers.heightCm > 250) {
      return t.err_height;
    }
    if (!answers.weightKg || answers.weightKg < 30 || answers.weightKg > 400) {
      return t.err_weight;
    }
  }
  if (step === 3 && !answers.triedBefore) return t.err_tried;
  if (step === 4 && answers.conditions.length === 0) return t.err_conditions;
  if (step === 5 && !answers.pregnant) return t.err_pregnant;
  return "";
}
