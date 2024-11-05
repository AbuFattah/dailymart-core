export type CategoryType = {
  id: string;
  name: string;
  status: string;
  subcategory?: [];
};

export type CreateProductParams = {
  name: string;
  sku: string;
  price: number;
  description: string;
  origin: string;
  category_id: string;
  category_name: string;
  subcategory_id: string;
  subcategory_name: string;
  brand: string;
  status: string;
  size: string;
  type: string;
  color: string;
  created_at?: Date;
  updated_at?: Date;
};

export type UpdateProductParams = {
  name: string;
  description: string;
  sku: string;
  price: number;
  origin: string;
  category_id: string;
  category_name: string;
  subcategory_id: string;
  subcategory_name: string;
  brand: string;
  status: string;
  size: string;
  type: string;
  color: string;
  updated_at?: Date;
};
