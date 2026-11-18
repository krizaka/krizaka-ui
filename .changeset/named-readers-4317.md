---
"@krizaka/ui": patch
"@krizaka/sovkora-shared": patch
---

Refactor, behaviour unchanged: `document-viewer/locate` names its character-range constants and holds the Helvetica width table as a typed array; the PDF pre-flight reads names, extensions, base64 and the trailer with named readers instead of regular expressions.
