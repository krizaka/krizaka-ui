import { ThemeProvider, ThemeToggle } from "@krizaka/ui/theme";

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <ThemeToggle label="Change the theme" />
    </ThemeProvider>
  );
}
