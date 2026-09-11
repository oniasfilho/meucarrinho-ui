export interface ShoppingSessionSummaryDto {
  id: string;
  name: string;
  storeName: string | null;
  budget: number | null;
  status: "ACTIVE" | "COMPLETED";
  itemCount: number;
  total: number;
  remainingBudget: number | null;
  overBudget: boolean;
  createdAt: string;
  completedAt: string | null;
}
