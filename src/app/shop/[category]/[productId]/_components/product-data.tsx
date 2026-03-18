import { notFound } from "next/navigation";
import { getProductByIdAction } from "@/app/shop/_actions/get-product-by-id";
import ProductView from "./product-view";

export default async function ProductData({ productId }: { productId: string }) {
  const product = await getProductByIdAction(productId);
  if (!product) notFound();
  return <ProductView product={product} />;
}
