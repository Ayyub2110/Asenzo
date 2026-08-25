import React, { useState } from "react";

// Basic common UI components for forms
const InputField = ({ label, hint, value, onChange, required = false }: any) => (
  <div className="flex flex-col gap-1.5 mb-4">
    <label className="text-[13px] font-bold text-foreground">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    {hint && <p className="text-[12px] text-muted-foreground leading-snug mb-1">{hint}</p>}
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 bg-background border border-border rounded-[8px] text-[13px] focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary" 
      placeholder="Type here..."
    />
  </div>
);

const TextAreaField = ({ label, hint, value, onChange, required = false }: any) => (
  <div className="flex flex-col gap-1.5 mb-4">
    <label className="text-[13px] font-bold text-foreground">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    {hint && <p className="text-[12px] text-muted-foreground leading-snug mb-1">{hint}</p>}
    <textarea 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 bg-background border border-border rounded-[8px] text-[13px] min-h-[100px] focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary" 
      placeholder="Type here..."
    />
  </div>
);

const FormStep = ({ children, title, description, step, totalSteps, onNext, onPrev, onSave }: any) => (
  <div className="flex flex-col h-full mt-2">
    <div className="p-4 bg-muted border border-border rounded-lg mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[14px] font-bold text-foreground">{title}</h3>
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Step {step} of {totalSteps}</span>
      </div>
      <p className="text-[12.5px] text-muted-foreground leading-relaxed">{description}</p>
    </div>
    
    <div className="flex-1 overflow-y-auto pr-2 pb-8">
      {children}
    </div>

    <div className="pt-4 border-t border-border flex items-center justify-between mt-auto bg-card sticky bottom-0 z-10">
      <button 
        className="px-5 py-2.5 border border-border text-foreground font-semibold text-[13px] rounded-[8px] hover:bg-muted transition-colors disabled:opacity-50"
        onClick={onPrev}
        disabled={step === 1}
      >
        Back
      </button>
      <div className="flex items-center gap-3">
        <button 
          className="px-5 py-2.5 border border-border text-muted-foreground font-semibold text-[13px] rounded-[8px] hover:text-foreground transition-colors"
          onClick={onSave}
        >
          Save Draft
        </button>
        <button 
          className="px-5 py-2.5 bg-foreground text-background font-semibold text-[13px] rounded-[8px] hover:bg-foreground/90 transition-colors"
          onClick={onNext}
        >
          {step === totalSteps ? "Finish & Save" : "Continue"}
        </button>
      </div>
    </div>
  </div>
);

export function BusinessForm({ data, onSave, onCancel }: { data: any, onSave: (d: any) => void, onCancel: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(data || {});

  const update = (key: string, val: any) => setFormData({ ...formData, [key]: val });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else onSave(formData);
  };

  return (
    <>
      {step === 1 && (
        <FormStep step={1} totalSteps={4} title="Business Identity" description="What is this business, what does it do, how does it make money, and where is it today?" onNext={handleNext} onPrev={() => {}} onSave={() => onSave(formData)}>
          <InputField label="1. What is your business name?" required value={formData.name || ""} onChange={(v: string) => update("name", v)} />
          <TextAreaField label="2. What does your business do?" hint="Explain what your business actually does in simple language. Imagine you are explaining it to someone intelligent who has never heard of your company." required value={formData.description || ""} onChange={(v: string) => update("description", v)} />
          <InputField label="3. What category or industry does your business operate in?" value={formData.category || ""} onChange={(v: string) => update("category", v)} />
          <InputField label="4. What type of business is this?" hint="Examples: Agency, Consultancy, SaaS, Creator business..." value={formData.type || ""} onChange={(v: string) => update("type", v)} />
          <InputField label="5. How long has the business existed?" value={formData.age || ""} onChange={(v: string) => update("age", v)} />
          <InputField label="6. What is your current business model?" hint="Examples: Retainer, Project-based, Subscription..." value={formData.model || ""} onChange={(v: string) => update("model", v)} />
        </FormStep>
      )}
      {step === 2 && (
        <FormStep step={2} totalSteps={4} title="Business Stage" description="Understanding the current scale and operational bottlenecks of the business." onNext={handleNext} onPrev={() => setStep(step - 1)} onSave={() => onSave(formData)}>
          <InputField label="7. What stage is the business currently in?" hint="Examples: Pre-revenue, Early revenue, Growth, Established..." value={formData.stage || ""} onChange={(v: string) => update("stage", v)} />
          <InputField label="8. What is the approximate current revenue range?" value={formData.revenueRange || ""} onChange={(v: string) => update("revenueRange", v)} />
          <InputField label="9. What is the current team size?" value={formData.teamSize || ""} onChange={(v: string) => update("teamSize", v)} />
          <TextAreaField label="10. What are the primary ways the business currently generates revenue?" value={formData.primaryRevenue || ""} onChange={(v: string) => update("primaryRevenue", v)} />
          <TextAreaField label="11. What are the biggest operational constraints right now?" value={formData.constraints || ""} onChange={(v: string) => update("constraints", v)} />
          <TextAreaField label="12. What is currently consuming too much of the founder's time?" value={formData.founderTimeDrag || ""} onChange={(v: string) => update("founderTimeDrag", v)} />
        </FormStep>
      )}
      {step === 3 && (
        <FormStep step={3} totalSteps={4} title="Business Goals" description="Where does the business need to go in the next year?" onNext={handleNext} onPrev={() => setStep(step - 1)} onSave={() => onSave(formData)}>
          <TextAreaField label="13. What are the most important business goals for the next 12 months?" value={formData.goals12Months || ""} onChange={(v: string) => update("goals12Months", v)} />
          <TextAreaField label="14. What would make the next 12 months a successful year?" value={formData.successDefinition || ""} onChange={(v: string) => update("successDefinition", v)} />
          <TextAreaField label="15. What is the single most important business outcome you want ASENZO to help improve?" value={formData.primaryOutcomeTarget || ""} onChange={(v: string) => update("primaryOutcomeTarget", v)} />
          <TextAreaField label="16. What should NOT change about the business as it grows?" value={formData.unchangeableCore || ""} onChange={(v: string) => update("unchangeableCore", v)} />
        </FormStep>
      )}
      {step === 4 && (
        <FormStep step={4} totalSteps={4} title="Business Reality" description="What is truly working, what's failing, and what assumptions remain." onNext={handleNext} onPrev={() => setStep(step - 1)} onSave={() => onSave(formData)}>
          <TextAreaField label="17. What is working particularly well today?" value={formData.workingWell || ""} onChange={(v: string) => update("workingWell", v)} />
          <TextAreaField label="18. What is currently not working?" value={formData.notWorking || ""} onChange={(v: string) => update("notWorking", v)} />
          <TextAreaField label="19. What assumptions about the business are you least certain about?" value={formData.uncertainAssumptions || ""} onChange={(v: string) => update("uncertainAssumptions", v)} />
          <TextAreaField label="20. What would you like ASENZO to understand about your business that cannot be captured by basic fields?" value={formData.extraContext || ""} onChange={(v: string) => update("extraContext", v)} />
        </FormStep>
      )}
    </>
  );
}

export function CustomerForm({ data, onSave, onCancel }: { data: any, onSave: (d: any) => void, onCancel: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(data || {});
  const update = (key: string, val: any) => setFormData({ ...formData, [key]: val });
  const handleNext = () => { if (step < 5) setStep(step + 1); else onSave(formData); };
  
  return (
    <>
      {step === 1 && (
        <FormStep step={1} totalSteps={5} title="Ideal Customer" description="Who exactly the business is built to serve." onNext={handleNext} onPrev={() => {}} onSave={() => onSave(formData)}>
          <InputField label="1. Who is your ideal customer?" required value={formData.idealCustomer || ""} onChange={(v: string) => update("idealCustomer", v)} />
          <InputField label="2. What type of company/person are they?" value={formData.companyType || ""} onChange={(v: string) => update("companyType", v)} />
          <div className="flex gap-4">
             <div className="flex-1">
               <InputField label="3. Company size?" value={formData.companySize || ""} onChange={(v: string) => update("companySize", v)} />
             </div>
             <div className="flex-1">
               <InputField label="4. Revenue range?" value={formData.revenueRange || ""} onChange={(v: string) => update("revenueRange", v)} />
             </div>
          </div>
          <InputField label="5. Industry?" value={formData.industry || ""} onChange={(v: string) => update("industry", v)} />
          <InputField label="6. Geography?" value={formData.geography || ""} onChange={(v: string) => update("geography", v)} />
          <InputField label="7. Role/title of the buyer?" value={formData.buyerRole || ""} onChange={(v: string) => update("buyerRole", v)} />
          <InputField label="8. Who is the decision maker?" value={formData.decisionMaker || ""} onChange={(v: string) => update("decisionMaker", v)} />
          <InputField label="9. Who influences the buying decision?" value={formData.influencers || ""} onChange={(v: string) => update("influencers", v)} />
        </FormStep>
      )}
      {step === 2 && (
        <FormStep step={2} totalSteps={5} title="Customer Problem" description="What symptoms they experience and what it costs them." onNext={handleNext} onPrev={() => setStep(step - 1)} onSave={() => onSave(formData)}>
          <TextAreaField label="10. What problem causes them to look for a solution?" value={formData.problemTrigger || ""} onChange={(v: string) => update("problemTrigger", v)} />
          <TextAreaField label="11. What symptoms do they experience?" value={formData.symptoms || ""} onChange={(v: string) => update("symptoms", v)} />
          <TextAreaField label="12. What is the deeper problem behind those symptoms?" value={formData.deeperProblem || ""} onChange={(v: string) => update("deeperProblem", v)} />
          <TextAreaField label="13. What happens if they do nothing?" value={formData.costOfInaction || ""} onChange={(v: string) => update("costOfInaction", v)} />
          <TextAreaField label="14. What does this problem cost them? (Financial, time, opportunity)" value={formData.costDetails || ""} onChange={(v: string) => update("costDetails", v)} />
        </FormStep>
      )}
      {step === 3 && (
        <FormStep step={3} totalSteps={5} title="Desired Result" description="What they ultimately want." onNext={handleNext} onPrev={() => setStep(step - 1)} onSave={() => onSave(formData)}>
          <TextAreaField label="15. What outcome does the customer actually want?" value={formData.desiredOutcome || ""} onChange={(v: string) => update("desiredOutcome", v)} />
          <TextAreaField label="16. What does success look like to them?" value={formData.successVision || ""} onChange={(v: string) => update("successVision", v)} />
          <TextAreaField label="17. What would change in their business/life if the problem disappeared?" value={formData.lifeChange || ""} onChange={(v: string) => update("lifeChange", v)} />
          <TextAreaField label="18. What are they ultimately trying to become or achieve?" value={formData.ultimateGoal || ""} onChange={(v: string) => update("ultimateGoal", v)} />
        </FormStep>
      )}
      {step === 4 && (
        <FormStep step={4} totalSteps={5} title="Buying Behavior" description="How they shop and what holds them back." onNext={handleNext} onPrev={() => setStep(step - 1)} onSave={() => onSave(formData)}>
          <TextAreaField label="19. What causes them to start looking for a solution?" value={formData.buyingTrigger || ""} onChange={(v: string) => update("buyingTrigger", v)} />
          <TextAreaField label="20. What alternatives do they consider?" value={formData.alternatives || ""} onChange={(v: string) => update("alternatives", v)} />
          <TextAreaField label="21. What have they already tried?" value={formData.failedAttempts || ""} onChange={(v: string) => update("failedAttempts", v)} />
          <TextAreaField label="22. Why didn't those solutions work?" value={formData.failureReasons || ""} onChange={(v: string) => update("failureReasons", v)} />
          <InputField label="23. What objections stop them from buying?" value={formData.objections || ""} onChange={(v: string) => update("objections", v)} />
          <InputField label="24. What makes them trust a provider?" value={formData.trustFactors || ""} onChange={(v: string) => update("trustFactors", v)} />
          <InputField label="25. What makes them skeptical?" value={formData.skepticismTriggers || ""} onChange={(v: string) => update("skepticismTriggers", v)} />
        </FormStep>
      )}
      {step === 5 && (
        <FormStep step={5} totalSteps={5} title="Customer Language" description="The exact wording your customers use." onNext={handleNext} onPrev={() => setStep(step - 1)} onSave={() => onSave(formData)}>
          <TextAreaField label="26. What exact phrases do customers use to describe their problem?" value={formData.customerPhrases || ""} onChange={(v: string) => update("customerPhrases", v)} />
          <TextAreaField label="27. What questions do customers repeatedly ask?" value={formData.repeatedQuestions || ""} onChange={(v: string) => update("repeatedQuestions", v)} />
          <TextAreaField label="28. What misconceptions do customers have?" value={formData.misconceptions || ""} onChange={(v: string) => update("misconceptions", v)} />
          <TextAreaField label="29. What beliefs need to change before they will buy?" value={formData.requiredBeliefs || ""} onChange={(v: string) => update("requiredBeliefs", v)} />
        </FormStep>
      )}
    </>
  );
}

// I will mock the rest of the forms similarly, using progressively simpler generic layouts, to complete the 7 forms fully per prompt.
export function PositioningForm({ data, onSave, onCancel }: { data: any, onSave: (d: any) => void, onCancel: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(data || {});
  const update = (key: string, val: any) => setFormData({ ...formData, [key]: val });
  const handleNext = () => { if (step < 4) setStep(step + 1); else onSave(formData); };
  
  return (
    <>
      {step === 1 && (
        <FormStep step={1} totalSteps={4} title="Category" description="Where do you play?" onNext={handleNext} onPrev={() => {}} onSave={() => onSave(formData)}>
          <InputField label="1. What category do you currently compete in?" value={formData.currentCategory || ""} onChange={(v: string) => update("currentCategory", v)} />
          <InputField label="2. What category do you want customers to associate you with?" value={formData.desiredCategory || ""} onChange={(v: string) => update("desiredCategory", v)} />
          <InputField label="3. What do customers typically compare you against?" value={formData.comparisons || ""} onChange={(v: string) => update("comparisons", v)} />
        </FormStep>
      )}
      {step === 2 && (
        <FormStep step={2} totalSteps={4} title="Differentiation" description="How you separate yourself from interchangeably." onNext={handleNext} onPrev={() => setStep(step - 1)} onSave={() => onSave(formData)}>
          <TextAreaField label="4. What do you do differently?" required value={formData.differentiation || ""} onChange={(v: string) => update("differentiation", v)} />
          <TextAreaField label="5. What do competitors typically do?" value={formData.competitorApproaches || ""} onChange={(v: string) => update("competitorApproaches", v)} />
          <TextAreaField label="6. What do you believe competitors get wrong?" value={formData.competitorFailures || ""} onChange={(v: string) => update("competitorFailures", v)} />
          <TextAreaField label="7. What approach do you reject?" value={formData.rejectedApproach || ""} onChange={(v: string) => update("rejectedApproach", v)} />
          <TextAreaField label="8. What is your contrarian belief?" value={formData.contrarianBelief || ""} onChange={(v: string) => update("contrarianBelief", v)} />
        </FormStep>
      )}
      {step === 3 && (
        <FormStep step={3} totalSteps={4} title="Mechanism" description="The specific way your solution produces the desired result." onNext={handleNext} onPrev={() => setStep(step - 1)} onSave={() => onSave(formData)}>
          <InputField label="9. What is your unique mechanism?" required value={formData.mechanism || ""} onChange={(v: string) => update("mechanism", v)} />
          <TextAreaField label="10. Why does your mechanism work?" value={formData.mechanismWhy || ""} onChange={(v: string) => update("mechanismWhy", v)} />
          <TextAreaField label="11. Why do conventional approaches fail?" value={formData.conventionalFailures || ""} onChange={(v: string) => update("conventionalFailures", v)} />
        </FormStep>
      )}
      {step === 4 && (
        <FormStep step={4} totalSteps={4} title="Positioning Statement" description="The finalized statement generated from your inputs." onNext={handleNext} onPrev={() => setStep(step - 1)} onSave={() => onSave(formData)}>
          <TextAreaField label="Positioning Statement" hint="AI-generated positioning from your inputs. Feel free to refine and approve." value={formData.statement || ""} onChange={(v: string) => update("statement", v)} />
        </FormStep>
      )}
    </>
  );
}

export function OfferForm({ data, onSave, onCancel }: { data: any, onSave: (d: any) => void, onCancel: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(data || {});
  const update = (key: string, val: any) => setFormData({ ...formData, [key]: val });
  const handleNext = () => { if (step < 4) setStep(step + 1); else onSave(formData); };

  return (
    <>
      {step === 1 && (
        <FormStep step={1} totalSteps={4} title="Offer Identity" description="What the company sells." onNext={handleNext} onPrev={() => {}} onSave={() => onSave(formData)}>
          <InputField label="1. Offer name" required value={formData.name || ""} onChange={(v: string) => update("name", v)} />
          <InputField label="2. What does the customer receive?" required value={formData.received || ""} onChange={(v: string) => update("received", v)} />
          <InputField label="3. Who is this offer for?" value={formData.forWhom || ""} onChange={(v: string) => update("forWhom", v)} />
          <InputField label="4. Who is this offer NOT for?" value={formData.notForWhom || ""} onChange={(v: string) => update("notForWhom", v)} />
          <InputField label="5. What problem does it solve?" value={formData.problemSolved || ""} onChange={(v: string) => update("problemSolved", v)} />
          <InputField label="6. What result does it promise?" value={formData.promise || ""} onChange={(v: string) => update("promise", v)} />
        </FormStep>
      )}
      {step === 2 && (
        <FormStep step={2} totalSteps={4} title="Delivery" description="How the offer is fulfilled." onNext={handleNext} onPrev={() => setStep(step-1)} onSave={() => onSave(formData)}>
          <TextAreaField label="7. What is included?" value={formData.included || ""} onChange={(v: string) => update("included", v)} />
          <TextAreaField label="8. What is not included?" value={formData.notIncluded || ""} onChange={(v: string) => update("notIncluded", v)} />
          <InputField label="9. Delivery format?" value={formData.format || ""} onChange={(v: string) => update("format", v)} />
          <InputField label="10. Duration?" value={formData.duration || ""} onChange={(v: string) => update("duration", v)} />
          <TextAreaField label="11. Client responsibilities?" value={formData.clientResp || ""} onChange={(v: string) => update("clientResp", v)} />
          <TextAreaField label="12. Your responsibilities?" value={formData.ourResp || ""} onChange={(v: string) => update("ourResp", v)} />
        </FormStep>
      )}
      {step === 3 && (
        <FormStep step={3} totalSteps={4} title="Commercials" description="The pricing and terms." onNext={handleNext} onPrev={() => setStep(step-1)} onSave={() => onSave(formData)}>
          <InputField label="13. Price/range" required value={formData.price || ""} onChange={(v: string) => update("price", v)} />
          <InputField label="14. Payment structure" value={formData.paymentStruct || ""} onChange={(v: string) => update("paymentStruct", v)} />
          <InputField label="15. Contract/commitment period" value={formData.commitment || ""} onChange={(v: string) => update("commitment", v)} />
          <InputField label="16. Upgrade/expansion options" value={formData.upgrades || ""} onChange={(v: string) => update("upgrades", v)} />
        </FormStep>
      )}
      {step === 4 && (
        <FormStep step={4} totalSteps={4} title="Buying Decision" description="Why they buy." onNext={handleNext} onPrev={() => setStep(step-1)} onSave={() => onSave(formData)}>
          <TextAreaField label="17. Why should someone buy this now?" value={formData.whyNow || ""} onChange={(v: string) => update("whyNow", v)} />
          <TextAreaField label="18. What makes the offer different?" value={formData.difference || ""} onChange={(v: string) => update("difference", v)} />
          <TextAreaField label="19. Biggest objections?" value={formData.objections || ""} onChange={(v: string) => update("objections", v)} />
          <TextAreaField label="20. What proof supports the offer?" value={formData.proof || ""} onChange={(v: string) => update("proof", v)} />
          <TextAreaField label="21. What is the expected customer outcome?" value={formData.expectedOutcome || ""} onChange={(v: string) => update("expectedOutcome", v)} />
        </FormStep>
      )}
    </>
  );
}

export function BrandForm({ data, onSave, onCancel }: { data: any, onSave: (d: any) => void, onCancel: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(data || {});
  const update = (key: string, val: any) => setFormData({ ...formData, [key]: val });
  const handleNext = () => { if (step < 4) setStep(step + 1); else onSave(formData); };

  // Helper for sliders
  const Slider = ({ label, value = 50, onChange }: any) => (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex justify-between items-center text-[12px] font-bold text-foreground">
        <span>{label}</span>
        <span className="text-muted-foreground">{value} / 100</span>
      </div>
      <input type="range" min="0" max="100" value={value} onChange={e => onChange(Number(e.target.value))} className="w-full accent-tertiary" />
    </div>
  );

  return (
    <>
      {step === 1 && (
        <FormStep step={1} totalSteps={4} title="Brand Identity" description="How the brand feels." onNext={handleNext} onPrev={() => {}} onSave={() => onSave(formData)}>
          <InputField label="1. How should people describe your brand?" value={formData.description || ""} onChange={(v: string) => update("description", v)} />
          <InputField label="2. What should the brand feel like?" value={formData.feeling || ""} onChange={(v: string) => update("feeling", v)} />
          <InputField label="3. What should it never feel like?" value={formData.neverFeeling || ""} onChange={(v: string) => update("neverFeeling", v)} />
        </FormStep>
      )}
      {step === 2 && (
        <FormStep step={2} totalSteps={4} title="Voice Sliders" description="Determine the exact tone ASENZO uses." onNext={handleNext} onPrev={() => setStep(step - 1)} onSave={() => onSave(formData)}>
          <p className="text-[12px] text-muted-foreground mb-4">Set these levers to define the specific tone of your brand voice.</p>
          <Slider label="Directness" value={formData.directness} onChange={(v: number) => update("directness", v)} />
          <Slider label="Confidence" value={formData.confidence} onChange={(v: number) => update("confidence", v)} />
          <Slider label="Formality" value={formData.formality} onChange={(v: number) => update("formality", v)} />
          <Slider label="Humor" value={formData.humor} onChange={(v: number) => update("humor", v)} />
          <Slider label="Energy" value={formData.energy} onChange={(v: number) => update("energy", v)} />
          <Slider label="Contrarianism" value={formData.contrarianism} onChange={(v: number) => update("contrarianism", v)} />
          <Slider label="Technical Depth" value={formData.technicalDepth} onChange={(v: number) => update("technicalDepth", v)} />
          <Slider label="Emotional Tone" value={formData.emotionalTone} onChange={(v: number) => update("emotionalTone", v)} />
        </FormStep>
      )}
      {step === 3 && (
        <FormStep step={3} totalSteps={4} title="Language" description="The specific words you use and avoid." onNext={handleNext} onPrev={() => setStep(step - 1)} onSave={() => onSave(formData)}>
          <TextAreaField label="4. Words/phrases you frequently use" value={formData.frequentWords || ""} onChange={(v: string) => update("frequentWords", v)} />
          <TextAreaField label="5. Words/phrases you never want used" value={formData.neverWords || ""} onChange={(v: string) => update("neverWords", v)} />
          <TextAreaField label="6. Industry jargon you prefer" value={formData.jargon || ""} onChange={(v: string) => update("jargon", v)} />
          <TextAreaField label="7. Language customers understand" value={formData.customerLanguage || ""} onChange={(v: string) => update("customerLanguage", v)} />
        </FormStep>
      )}
      {step === 4 && (
        <FormStep step={4} totalSteps={4} title="Communication Principles" description="Beliefs and guardrails." onNext={handleNext} onPrev={() => setStep(step - 1)} onSave={() => onSave(formData)}>
          <TextAreaField label="8. What beliefs should your communication reinforce?" value={formData.reinforceBeliefs || ""} onChange={(v: string) => update("reinforceBeliefs", v)} />
          <TextAreaField label="9. What beliefs should your communication challenge?" value={formData.challengeBeliefs || ""} onChange={(v: string) => update("challengeBeliefs", v)} />
          <TextAreaField label="10. How should you talk about competitors?" value={formData.competitorTalk || ""} onChange={(v: string) => update("competitorTalk", v)} />
          <TextAreaField label="11. What should AI never say on behalf of this business?" value={formData.aiNeverSay || ""} onChange={(v: string) => update("aiNeverSay", v)} />
        </FormStep>
      )}
    </>
  );
}

export function KnowledgeForm({ data, onSave, onCancel }: { data: any, onSave: (d: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState(data || { items: [] });
  const [newItem, setNewItem] = useState({ category: "Business Knowledge", content: "", source: "" });
  
  const handleAdd = () => {
    if (!newItem.content) return;
    setFormData({
       ...formData,
       items: [...(formData.items || []), { ...newItem, id: Date.now().toString(), status: "Unverified" }]
    });
    setNewItem({ category: "Business Knowledge", content: "", source: "" });
  };

  return (
    <div className="flex flex-col h-full mt-2">
      <div className="p-4 bg-muted border border-border rounded-lg mb-6">
        <h3 className="text-[14px] font-bold text-foreground mb-1">Knowledge Base</h3>
        <p className="text-[12.5px] text-muted-foreground leading-relaxed">Structured internal knowledge layer that ASENZO uses to generate grounded content.</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-8 space-y-6">
        <div className="bg-card border border-border rounded-lg p-5">
          <h4 className="text-[13px] font-bold text-foreground mb-4">Add Knowledge</h4>
          <div className="flex gap-4 mb-3">
             <div className="w-1/3">
                <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1.5">Category</label>
                <select className="w-full px-3 py-2 bg-background border border-border rounded-[8px] text-[13px] focus:outline-none" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                   <option>Business Knowledge</option>
                   <option>Customer Knowledge</option>
                   <option>Market Knowledge</option>
                   <option>Founder Knowledge</option>
                   <option>Product / Offer Knowledge</option>
                </select>
             </div>
             <div className="flex-1">
                <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1.5">Source (e.g. Call transcript, Document)</label>
                <input type="text" className="w-full px-3 py-2 bg-background border border-border rounded-[8px] text-[13px] focus:outline-none" value={newItem.source} onChange={e => setNewItem({...newItem, source: e.target.value})} placeholder="URL or identifier" />
             </div>
          </div>
          <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1.5">Content Focus / Rule</label>
          <textarea className="w-full px-3 py-2 bg-background border border-border rounded-[8px] text-[13px] min-h-[60px] focus:outline-none mb-4" value={newItem.content} onChange={e => setNewItem({...newItem, content: e.target.value})} placeholder="What should ASENZO know?"></textarea>
          <button className="bg-secondary text-foreground font-semibold px-4 py-2 text-[12px] rounded border border-border hover:bg-muted transition-colors" onClick={handleAdd}>Add to Base</button>
        </div>

        <div className="space-y-3">
          <h4 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Existing Blocks ({(formData.items || []).length})</h4>
          {(formData.items || []).length === 0 && <p className="text-[13px] text-muted-foreground">No knowledge assets configured.</p>}
          {(formData.items || []).map((item: any) => (
             <div key={item.id} className="p-4 bg-muted border border-border rounded-lg flex justify-between items-start gap-4">
                <div>
                   <span className="text-[10px] font-bold uppercase text-tertiary border border-border bg-card px-2 py-0.5 rounded-full mr-2">{item.category}</span>
                   <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${item.status === 'Verified' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>{item.status}</span>
                   <p className="text-[13px] text-foreground font-medium mt-2 leading-relaxed">{item.content}</p>
                   {item.source && <p className="text-[11px] text-muted-foreground mt-2 font-mono truncate">Source: {item.source}</p>}
                </div>
                <button className="text-[12px] text-destructive hover:underline" onClick={() => setFormData({...formData, items: formData.items.filter((i: any) => i.id !== item.id)})}>Remove</button>
             </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-end mt-auto bg-card sticky bottom-0 z-10">
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 border border-border text-foreground font-semibold text-[13px] rounded-[8px] hover:bg-muted" onClick={onCancel}>Cancel</button>
          <button className="px-5 py-2.5 bg-foreground text-background font-semibold text-[13px] rounded-[8px] hover:bg-foreground/90" onClick={() => onSave(formData)}>Save & Apply</button>
        </div>
      </div>
    </div>
  );
}

export function ProofForm({ data, onSave, onCancel }: { data: any, onSave: (d: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState(data || { items: [] });
  const [newItem, setNewItem] = useState({ title: "", type: "Case study", relatedOffer: "", claimSupported: "", actualResult: "", clientPermission: "Pending" });
  
  const handleAdd = () => {
    if (!newItem.title) return;
    setFormData({
       ...formData,
       items: [...(formData.items || []), { ...newItem, id: Date.now().toString(), publicUse: true }]
    });
    setNewItem({ title: "", type: "Case study", relatedOffer: "", claimSupported: "", actualResult: "", clientPermission: "Pending" });
  };

  return (
    <div className="flex flex-col h-full mt-2">
      <div className="p-4 bg-muted border border-border rounded-lg mb-6">
        <h3 className="text-[14px] font-bold text-foreground mb-1">Proof Configuration</h3>
        <p className="text-[12.5px] text-muted-foreground leading-relaxed">Proof establishes what the business can credibly claim. ASENZO requires explicit permission mappings.</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-8 space-y-6">
        <div className="bg-card border border-border rounded-lg p-5">
           <h4 className="text-[13px] font-bold text-foreground mb-4">Log New Proof Asset</h4>
           <InputField label="Asset Title" required value={newItem.title} onChange={(v: string) => setNewItem({...newItem, title: v})} />
           <div className="grid grid-cols-2 gap-4 mb-4">
               <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1.5">Type</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-[8px] text-[13px] focus:outline-none" value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value})}>
                     <option>Case study</option>
                     <option>Testimonial</option>
                     <option>Metric</option>
                     <option>Third-party validation</option>
                  </select>
               </div>
               <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1.5">Client Permission</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-[8px] text-[13px] focus:outline-none" value={newItem.clientPermission} onChange={e => setNewItem({...newItem, clientPermission: e.target.value})}>
                     <option>Pending</option>
                     <option>Approved</option>
                     <option>Restricted</option>
                  </select>
               </div>
           </div>
           <InputField label="Related Offer" value={newItem.relatedOffer} onChange={(v: string) => setNewItem({...newItem, relatedOffer: v})} />
           <InputField label="Claim Supported (e.g. Can scale teams to 50+)" value={newItem.claimSupported} onChange={(v: string) => setNewItem({...newItem, claimSupported: v})} />
           <InputField label="Actual Measured Result" value={newItem.actualResult} onChange={(v: string) => setNewItem({...newItem, actualResult: v})} />
           <button className="bg-secondary text-foreground font-semibold px-4 py-2 text-[12px] rounded border border-border hover:bg-muted transition-colors mt-2" onClick={handleAdd}>Save to Library</button>
        </div>

        <div className="space-y-3">
          <h4 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Library ({(formData.items || []).length})</h4>
          {(formData.items || []).length === 0 && <p className="text-[13px] text-muted-foreground">No proof assets verified.</p>}
          {(formData.items || []).map((item: any) => (
             <div key={item.id} className="p-4 bg-card border border-border rounded-lg flex flex-col gap-2">
                <div className="flex justify-between items-start">
                   <h5 className="font-bold text-[14px]">{item.title}</h5>
                   <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${item.clientPermission === 'Approved' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>{item.clientPermission}</span>
                </div>
                <div className="flex gap-4 text-[12px] text-muted-foreground">
                   <span>Type: <strong className="text-foreground">{item.type}</strong></span>
                   <span>Offer: <strong className="text-foreground">{item.relatedOffer}</strong></span>
                </div>
                <div className="mt-2 text-[13px] bg-muted p-2 rounded border border-border/50">
                   <p><strong className="font-bold text-foreground">Claim Supported:</strong> {item.claimSupported}</p>
                   <p><strong className="font-bold text-foreground">Result:</strong> {item.actualResult}</p>
                </div>
                <div className="flex justify-end mt-2">
                   <button className="text-[12px] text-destructive hover:underline" onClick={() => setFormData({...formData, items: formData.items.filter((i: any) => i.id !== item.id)})}>Revoke/Remove</button>
                </div>
             </div>
          ))}
        </div>
      </div>
      
      <div className="pt-4 border-t border-border flex items-center justify-end mt-auto bg-card sticky bottom-0 z-10">
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 border border-border text-foreground font-semibold text-[13px] rounded-[8px] hover:bg-muted" onClick={onCancel}>Cancel</button>
          <button className="px-5 py-2.5 bg-foreground text-background font-semibold text-[13px] rounded-[8px] hover:bg-foreground/90" onClick={() => onSave(formData)}>Approve & Save</button>
        </div>
      </div>
    </div>
  );
}

