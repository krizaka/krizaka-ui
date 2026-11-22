---
"@krizaka/ui": patch
---

The family's lines no longer say Java is on Maven Central or Rust on crates.io, where nothing is published: `Site` gains `published` (the registries a site's packages are really on) and a test refuses a line that names another one.
