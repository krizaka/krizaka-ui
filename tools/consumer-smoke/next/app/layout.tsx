import { ThemeProvider, ThemeScript } from "@krizaka/ui/theme";
import { Toaster } from "@krizaka/ui/toast";
import { getDictionary } from "@/lib/i18n";
import { I18nProvider } from "./components/I18nProvider";
import "./globals.css";

export const metadata = { title: "Krizaka consumer smoke" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript defaultMode="dark" />
      </head>
      <body>
        <ThemeProvider defaultMode="dark">
          <I18nProvider locale="en" messages={getDictionary("en")}>
            {children}
            <Toaster label="Notifications" closeLabel="Close" />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
