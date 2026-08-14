import type {
  HttpTypes,
  StoreProduct,
  StoreProductCategory,
  StoreCart,
  StoreCartLineItem,
  StoreRegion,
} from "@medusajs/types";

export type {
  StoreProduct,
  StoreProductCategory,
  StoreCart,
  StoreCartLineItem,
  StoreRegion,
};

export type { HttpTypes };

export type MedusaProduct = HttpTypes.StoreProduct;
export type MedusaProductCategory = HttpTypes.StoreProductCategory;
export type MedusaCart = HttpTypes.StoreCart;
export type MedusaCartLineItem = HttpTypes.StoreCartLineItem;
export type MedusaRegion = HttpTypes.StoreRegion;
export type MedusaProductVariant = HttpTypes.StoreProductVariant;