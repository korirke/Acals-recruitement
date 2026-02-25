import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { ErrorProvider } from "@/context/ErrorContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";
import { DynamicThemeProvider } from "@/context/DynamicThemeContext";
import ChatWidgetLoader from "./ChatWidgetLoader";
import { ToastProvider } from "@/components/admin/ui/Toast";
import { NavigationProvider } from "@/context/NavigationContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fortune Technologies Limited",
  description: "Empowering businesses with intelligent HR solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const initialTheme = theme || systemTheme;
                  if (initialTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <ToastProvider>
            <NavigationProvider>
              <DynamicThemeProvider>
                <ErrorProvider>
                  <AuthProvider>
                    {children}
                    <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: "var(--color-neutral-800)",
                          color: "var(--color-neutral-50)",
                        },
                        success: {
                          iconTheme: {
                            primary: "#10b981",
                            secondary: "#fff",
                          },
                        },
                        error: {
                          iconTheme: {
                            primary: "#ef4444",
                            secondary: "#fff",
                          },
                        },
                      }}
                    />
                  </AuthProvider>
                </ErrorProvider>
                <ChatWidgetLoader />
              </DynamicThemeProvider>
            </NavigationProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}