export interface FoundationHealth {
  percentage: number;
  overallStatus: string;
  categories: {
    completeness: number;
    clarity: number;
    consistency: number;
    evidence: number;
    freshness: number;
  };
  moduleStatus: {
    business: "Complete" | "Partial" | "Needs refinement" | "Missing";
    customer: "Complete" | "Partial" | "Needs refinement" | "Missing";
    positioning: "Complete" | "Partial" | "Needs refinement" | "Missing";
    offer: "Complete" | "Partial" | "Needs refinement" | "Missing";
    brand: "Complete" | "Partial" | "Needs refinement" | "Missing";
    knowledge: "Complete" | "Partial" | "Needs refinement" | "Missing";
    proof: "Complete" | "Partial" | "Needs refinement" | "Missing";
  };
}

export interface FoundationSummary {
  business: string;
  customer: string;
  coreProblem: string;
  desiredResult: string;
  mechanism: string;
  offer: string;
  positioning: string;
}

export interface DownstreamImpact {
  module: string;
  impacts: string[];
}

export const mockFoundationData = {
  health: {
    percentage: 82,
    overallStatus: "Ready",
    categories: {
      completeness: 92,
      clarity: 78,
      consistency: 85,
      evidence: 74,
      freshness: 81
    },
    moduleStatus: {
      business: "Complete",
      customer: "Needs refinement",
      positioning: "Complete",
      offer: "Complete",
      brand: "Partial",
      knowledge: "Partial",
      proof: "Partial"
    }
  } as FoundationHealth,

  summary: {
    business: "ASENZO",
    customer: "Founder-led service businesses",
    coreProblem: "Founder dependency is preventing predictable growth.",
    desiredResult: "Build a growth system the founder can operate independently.",
    mechanism: "Founder Growth Operating System.",
    offer: "Comprehensive Growth OS Deployment & 12-Month Support",
    positioning: "The only growth operating system built exclusively to remove the founder bottleneck from B2B service businesses."
  } as FoundationSummary,

  dependencies: [
    {
      module: "ICP (Customer)",
      impacts: [
        "Attention OS (Content Ideas)",
        "Conversion OS (Lead Qualification)",
        "Intelligence (Audience Modeling)"
      ]
    },
    {
      module: "Positioning",
      impacts: [
        "Content Generation (Hooks)",
        "Sales OS (Scripts)",
        "Recommendations"
      ]
    },
    {
      module: "Brand Voice",
      impacts: [
        "AI Content Generation",
        "Platform Adaptation (LinkedIn, Email)"
      ]
    },
    {
      module: "Proof",
      impacts: [
        "Attention OS (Content Claims)",
        "Conversion OS (Landing Surfaces)",
        "Sales OS (Proposals)"
      ]
    },
    {
      module: "Knowledge",
      impacts: [
        "AI Context (All Modules)",
        "Intelligence (Business Truth Verification)"
      ]
    }
  ] as DownstreamImpact[],
  
  knowledgeMeta: {
    sourcesReady: 12,
    sourcesProcessing: 1,
    sourcesFailed: 0
  },
  
  proofMeta: {
    approvedAssets: 7,
    pendingAssets: 2
  }
};
