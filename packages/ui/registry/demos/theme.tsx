import { ThemeProvider, ThemeToggle } from "@krizaka/ui/theme";

export default function ThemeDemo() {
  return (
    <ThemeProvider>
      <ThemeToggle label="Change the theme" />
    </ThemeProvider>
  );
}
