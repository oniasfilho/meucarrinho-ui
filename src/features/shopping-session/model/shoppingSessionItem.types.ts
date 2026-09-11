export interface ShoppingSessionItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  note: string | null;
  labelPhotoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
