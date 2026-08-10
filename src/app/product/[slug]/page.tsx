import type { Metadata } from "next";
import { getProductBySlug, products } from "@/data/products";
import { ProductPageClient } from "@/components/ProductPageClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return {
      title: "Handmade product",
      description: "Discover handmade goods on Artisan Lane.",
    };
  }
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | Artisan Lane`,
      description: product.shortDescription,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  return <ProductPageClient slug={slug} />;
}
