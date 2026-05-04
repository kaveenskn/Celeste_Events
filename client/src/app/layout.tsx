import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/ui/Navbar';

export const metadata: Metadata = {
  title: "Céleste Events — Sri Lanka's Premier Event Venues",
  description: "Book extraordinary venues for weddings, galas, and corporate events.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@400;700;900&display=swap" rel="stylesheet" />
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          body{background:#0c0a09;color:#f5f5f4;font-family:'Lato',sans-serif;-webkit-font-smoothing:antialiased}
          h1,h2,h3,.font-serif{font-family:'Playfair Display',Georgia,serif}
          a{text-decoration:none} button{font-family:inherit}
          ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:#1c1917}
          ::-webkit-scrollbar-thumb{background:#44403c;border-radius:4px}
          ::-webkit-scrollbar-thumb:hover{background:#d97706}
          input[type=range]{accent-color:#d97706} ::placeholder{color:#44403c}
          .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
          @keyframes spin{to{transform:rotate(360deg)}}
          @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
          @keyframes progressBar{from{width:0}to{width:100%}}
        `}</style>
      </head>
      <body>
        <Navbar />
        <main style={{ paddingTop: 66 }}>{children}</main>
      </body>
    </html>
  );
}
