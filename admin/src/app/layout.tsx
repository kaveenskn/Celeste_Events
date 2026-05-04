import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Céleste Events — Admin Portal',
  description: 'Administration panel for Céleste Events platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          body{background:#070605;color:#f5f5f4;font-family:'Inter','Lato',sans-serif;-webkit-font-smoothing:antialiased}
          .font-serif,h1,h2,h3{font-family:'Playfair Display',Georgia,serif}
          a{text-decoration:none}
          button{font-family:inherit;cursor:pointer}
          ::-webkit-scrollbar{width:4px}
          ::-webkit-scrollbar-track{background:#0e0c0b}
          ::-webkit-scrollbar-thumb{background:#292524;border-radius:4px}
          ::-webkit-scrollbar-thumb:hover{background:#d97706}
          input:focus,textarea:focus,select:focus{outline:none;border-color:#d97706!important;box-shadow:0 0 0 3px rgba(217,119,6,0.1)!important}
          textarea{resize:vertical}
          @keyframes spin{to{transform:rotate(360deg)}}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
