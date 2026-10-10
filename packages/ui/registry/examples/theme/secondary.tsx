import { ThemeProvider, ThemeToggle } from "@krizaka/ui/theme";

// The toggle takes any button variant and shape.
export default function ThemeToggleSecondary() {
  return (
    <ThemeProvider>
      <ThemeToggle label="Change the theme" variant="secondary" shape="pill" />
    </ThemeProvider>
  );
}
