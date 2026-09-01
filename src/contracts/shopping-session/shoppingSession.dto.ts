export interface ShoppingSessionDto {
  id: string;
  name: string;
  status: "ACTIVE" | "COMPLETED";
  itemCount: number;
  total: number;
  createdAt: string;
}

export interface CreateShoppingSessionRequestDto {
  name: string;
}
