export interface ShoppingSessionItemDto {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  note: string | null;
  labelPhotoKey: string | null;
  labelPhotoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
