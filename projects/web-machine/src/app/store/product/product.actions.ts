import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Product } from './product.model';

export const loadProducts = createAction(
  '[Product] Load Products', 
);

export const loadProductsSuccess = createAction(
  '[Product] Load Products Success', 
  props<{ products: Product[] }>()
);

export const addProduct = createAction(
  '[Product] Add Product',
  props<{ product: Product }>()
);

export const addProductSuccess = createAction(
  '[Product] Add Product Success',
  props<{ product: Product }>()
);

export const upsertProduct = createAction(
  '[Product/API] Upsert Product',
  props<{ product: Product }>()
);

export const addProducts = createAction(
  '[Product/API] Add Products',
  props<{ products: Product[] }>()
);

export const upsertProducts = createAction(
  '[Product/API] Upsert Products',
  props<{ products: Product[] }>()
);

export const updateProduct = createAction(
  '[Product] Update Product',
  props<{ product: Update<Product> }>()
);


export const updateProductSuccess = createAction(
  '[Product] Update Product Success',
  props<{ product: Update<Product> }>()
);

export const updateProducts = createAction(
  '[Product/API] Update Products',
  props<{ products: Update<Product>[] }>()
);

export const deleteProduct = createAction(
  '[Product] Delete Product',
  props<{ id: string }>()
);

export const deleteProductSuccess = createAction(
  '[Product] Delete Product Success',
  props<{ id: string }>()
);

export const deleteProducts = createAction(
  '[Product] Delete Products',
  props<{ ids: string[] }>()
);

export const deleteProductsSuccess = createAction(
  '[Product] Delete Products Success',
  props<{ ids: string[] }>()
);

export const clearProducts = createAction(
  '[Product/API] Clear Products'
);
