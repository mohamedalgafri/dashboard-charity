import "@/styles/globals.css";
import { fontArabic } from "@/assets/fonts";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import { cn, constructMetadata } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/analytics";
import ModalProvider from "@/components/modals/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Suspense } from "react";
import { ReduxProvider } from "@/store/provider";


interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = constructMetadata();

export default async function RootLayout({ children }: RootLayoutProps) {



  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          fontArabic.variable,
          "font-arabic" 
        )}
      >
            <ReduxProvider>

            
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider>
              <Suspense fallback={<div>جاري التحميل...</div>}>
                {children}
              </Suspense>
            </ModalProvider>
            <Analytics />
            <Toaster richColors closeButton position="top-center" />
            <TailwindIndicator />
          </ThemeProvider>
        </SessionProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}