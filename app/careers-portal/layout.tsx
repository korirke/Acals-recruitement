import { Inter } from "next/font/google";
import { Toaster as HotToaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import "../globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster as CareersToaster } from "@/components/careers/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Careers - Acals Consulting ",
  description: "Find your dream job with ACAL",
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1 bg-background text-foreground">
              {children}
            </main>
          </div>

          {/* Careers Radix Toasts (shadcn) */}
          <CareersToaster />

          {/* react-hot-toast toaster */}
          {/* <HotToaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "var(--color-neutral-800)",
                color: "var(--color-neutral-50)",
              },
            }}
          /> */}
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
}
