import Providers from "@/components/layout/Providers";
import SiteHeader from "@/components/layout/SiteHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className="min-h-screen flex flex-col">
      <Providers>
        <SiteHeader />
        {children}
      </Providers>
    </body>
  );
}
