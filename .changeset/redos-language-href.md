---
"@krizaka/ui": patch
---

`languageHref`: the path split no longer uses a backtracking regular expression (CodeQL polynomial ReDoS); a regression test guards a very long path.
