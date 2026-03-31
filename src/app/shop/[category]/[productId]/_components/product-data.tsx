import { notFound } from "next/navigation";
import { getProductByIdAction } from "@/app/shop/_actions/get-product-by-id";
import { slugToCategory } from "@/lib/shop-utils";
import ProductView from "./product-view";

interface Props {
  params: Promise<{ category: string; productId: string }>;
}

export default async function ProductData({ params }: Props) {
  const { category: slug, productId } = await params;

  if (!slugToCategory(slug)) notFound();

  const product = await getProductByIdAction(productId);
  if (!product) notFound();

  return <ProductView product={product} />;
}
