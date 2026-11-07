import { Suspense } from "react";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import Toaster from "@/components/Toaster";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata = {
  title: {
    default: "نکستورا | فروشگاه تخصصی محصولات دیجیتال",
    template: "%s | نکستورا",
  },
  description:
    "خرید آنلاین موبایل، لپ‌تاپ، قطعات کامپیوتر، گیمینگ، دوربین و لوازم جانبی از فروشگاه نکستورا با گارانتی اصالت کالا، ارسال سریع و ۷ روز ضمانت بازگشت.",
  applicationName: "NEXORA",
  keywords: ["فروشگاه اینترنتی", "موبایل", "لپ تاپ", "گیمینگ", "نکستورا", "خرید آنلاین"],
};

export const viewport = {
  themeColor: "#5B45E8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <StoreProvider>
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          <div className="h-16 bg-ink lg:hidden" aria-hidden="true" />
          <Suspense fallback={null}>
            <MobileNav />
          </Suspense>
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
