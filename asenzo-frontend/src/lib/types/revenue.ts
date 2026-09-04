export type CustomerStatus = "NEW" | "ONBOARDING" | "ACTIVE" | "AT_RISK" | "RENEWING" | "CHURNED" | "EXPANDED";

export type CustomerHealth = "HEALTHY" | "AT_RISK" | "CRITICAL";

export interface Customer {
  id: string;
  leadId?: string; // Link to conversion lead if applicable
  opportunityId?: string; // Link to conversion opp
  name: string;
  company: string;
  email: string;
  source: string;
  originalContent: string;
  offerPurchased: string;
  purchaseDate: string;
  contractStartDate: string;
  totalRevenue: number;
  recurringRevenue: number;
  renewalDate?: string;
  status: CustomerStatus;
  health: CustomerHealth;
  healthReasoning: string;
  accountOwner: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "OUTSTANDING";
export type TransactionType = "RECURRING" | "ONE_TIME";

export interface RevenueTransaction {
  id: string;
  customerId: string;
  amount: number;
  status: TransactionStatus;
  type: TransactionType;
  date: string;
  offerName: string;
  invoiceId?: string;
}

export interface Renewal {
  id: string;
  customerId: string;
  renewalDate: string;
  currentValue: number;
  status: "UPCOMING" | "RENEWED" | "CHURNED" | "IN_NEGOTIATION";
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  riskReason?: string;
  recommendedAction?: string;
}

export interface ExpansionOpportunity {
  id: string;
  customerId: string;
  potentialRevenue: number;
  type: "UPSELL" | "CROSS_SELL" | "CAPACITY";
  reason: string;
  status: "IDENTIFIED" | "PITCHED" | "CLOSED_WON" | "CLOSED_LOST";
}

export interface RevenueForecast {
  month: string;
  committedRevenue: number;
  weightedPipeline: number;
  bestCase: number;
  target: number;
}
