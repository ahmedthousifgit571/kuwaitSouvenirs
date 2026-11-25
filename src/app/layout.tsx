import type { Metadata, Viewport } from 'next';
import { Fira_Code, Instrument_Serif, Vazirmatn } from 'next/font/google';
import './globals.css';

const vazir = Vazirmatn({ variable: '--font-vazir', subsets: ['latin', 'arabic'], display: 'swap' });
const fira = Fira_Code({ variable: '--font-fira', subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap' });
// Closest free match to the reference's condensed serif italic. Swap here to change it site-wide.
const italic = Instrument_Serif({ variable: '--font-italic', subsets: ['latin'], weight: '400', style: ['italic'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Souvenir & More: Kuwait souvenirs & gifts',
  description: 'Souvenir & More, Souk Mubarakiya, Kuwait City: Kuwaiti souvenirs and gift packs, from dhow models and crystal keepsakes to skyline mugs, totes, caps, magnets and postcards.',
};

export const viewport: Viewport = {
  themeColor: '#cf1830',
};

// Runs before paint: skip the loader on a repeat visit in this tab, or when motion is reduced.
const introScript = `try{var d=document.documentElement;if(sessionStorage.getItem('ks-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.intro='skip'}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${vazir.variable} ${fira.variable} ${italic.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
