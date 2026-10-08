import Image from 'next/image';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { site } from '@/config/site';

export const metadata = { title: 'IES Branded Products' };

const WHATSAPP_NUMBER = '252612267178';

interface Product {
  name: string;
  price: string;
  image: string;
}

const products: Product[] = [
  { name: 'IES Cap', price: '$3', image: '/IES BRAND PRODUCT/Brand-koofiyad.jpeg' },
  { name: 'IES Mug', price: '$5', image: '/IES BRAND PRODUCT/Brund-cup.jpeg' },
  { name: 'IES T-Shirt (White)', price: '$7', image: '/IES BRAND PRODUCT/Brand-t-shert-white.png' },
  { name: 'IES T-Shirt (White & Blue) ', price: '$8', image: '/IES BRAND PRODUCT/t-shirtblue&white.jpeg' },
  { name: 'IES T-Shirt (Blue) ', price: '$12', image: '/IES BRAND PRODUCT/Brand-t-shert-.jpeg' },
];
const buildWhatsappLink = (product: Product) => {
  const imageUrl = new URL(product.image, site.url).toString();
  const message = `Hello IES,

I am interested in this product:
${product.name}
Price: ${product.price}
Image: ${imageUrl}

Please share more details about its availability and how I can place an order.

Thank you.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export default function MerchandisePage() {
  return (
    <>
      <PageHero
        eyebrow="IES STORE"
        title="IES Branded Products"
        description="Discover our Official branded products from IES"
      />

      <Section tone="muted">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"> 
          {products.map((product) => (
            <div
              key={product.name}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-xl bg-slate-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 220px"
                  className="object-contain p-4"
                />
              </div>

              <div className="mt-5 flex flex-col items-center text-center">
                <h3 className="text-base font-semibold text-[#022D5A] sm:text-lg">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-[#035CB3]">{product.price}</p>

                <a
                  href={buildWhatsappLink(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#48C184] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2d7a50]"
                  aria-label={`Buy ${product.name} via WhatsApp`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.07 0C5.46 0 .1 5.36.1 11.97c0 2.11.55 4.17 1.6 5.98L0 24l6.21-1.63a11.94 11.94 0 0 0 5.86 1.49h.01c6.6 0 11.97-5.36 11.97-11.97 0-3.2-1.24-6.2-3.53-8.41ZM12.08 21.8h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.69.97.98-3.6-.23-.37a9.84 9.84 0 0 1-1.51-5.24c0-5.44 4.43-9.87 9.87-9.87 2.64 0 5.12 1.03 6.98 2.9a9.83 9.83 0 0 1 2.9 6.98c-.01 5.44-4.44 9.82-9.9 9.82Zm5.42-7.37c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.13 3.26 5.17 4.57.72.31 1.29.5 1.73.63.73.23 1.39.2 1.91.12.58-.09 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35Z" />
                  </svg>
                  Buy Now
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-left text-xs text-slate-500 sm:text-sm">
            All orders are processed via WhatsApp. Prices shown are indicative. Order confirmation and shipping details will be provided through WhatsApp.        </p>
      </Section>
    </>
  );
}
