---
name: krizaka-choice-controls
description: Choices and settings in a Krizaka app (Next.js or Expo) with @krizaka/ui — RadioGroup (dots, cards, tactile keys that press in, segmented), Slider (range, steps and marks, floating value, brand gradient, vertical), Switch, and on React Native Select / Combobox in a Sheet, with haptics through the ThemeProvider. Use it instead of React Native's Switch, a picker module, a hand-made segmented control or a slider library.
---

# RadioGroup · Slider · Switch · Select · Combobox · Sheet

## Rules

1. Pick by the choice:
   - two to five options seen at once → `RadioGroup` — `list` (settings), `cards` (an amount, a plan: a line under
     each), `buttons` (a size, a tip, a level: tactile keys), `segmented` (two to four short words on one line);
   - many options → web `Select` of `@krizaka/ui/field` (the platform's menu) or `Combobox` (searched); native `Select`
     / `Combobox` (a field that opens a `Sheet`);
   - a value by feel within bounds → `Slider` (`ticks` when the steps are few, `marks` to name the ends,
     `floatingValue` while touched, `orientation="vertical"` for faders); an exact number → a text field;
   - on / off, applied at once → `Switch` (native: `showLabel` + `description` makes the settings row).
2. Never React Native's `Switch`, `@react-native-community/slider` or a picker module: the platform's controls are
   drawn by the theme, the same on iOS and Android, and wear the product's accent.
3. A segmented control that **switches views** is `Tabs variant="segmented"` (web) / `Segmented` (native); one that is a
   **form's value** is `RadioGroup variant="segmented"`.
4. Haptics: `<ThemeProvider haptics={(k) => k === "selection" ? Haptics.selectionAsync() : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>`
   once at the root (expo-haptics). Wheels, slider steps, radios and switches play `selection`; a tactile key `impact`.
5. Words are props (`label`, `thumbLabels`, `formatValue`, `hint`, `labels`), passed translated. In a form, use the
   form's fields (`form.RadioGroup variant=…`, `form.Slider`, `form.Switch`, `form.Select`, `form.Combobox`).

## Recipes

```tsx
<RadioGroup.Root label={t("tip")} variant="buttons" value={tip} onValueChange={setTip}>
  {TIPS.map((p) => <RadioGroup.Button key={p} value={p} hint={formatMoney(total * p / 100)}>{`${p} %`}</RadioGroup.Button>)}
</RadioGroup.Root>
<Slider<[number, number]> label={t("price")} thumbLabels={[t("min"), t("max")]} value={range} onValueChange={setRange}
  max={250} step={10} floatingValue marks={[{ value: 0, label: "$0" }, { value: 250, label: "$250+" }]} />
// React Native
<Switch label={t("push")} description={t("push.hint")} showLabel checked={push} onCheckedChange={setPush} />
<Select label={t("language")} options={LANGUAGES} value={lang} onValueChange={setLang} />
<Combobox label={t("city")} onSearch={(q, signal) => searchCities(q, signal)} value={city} onValueChange={setCity} />
```
