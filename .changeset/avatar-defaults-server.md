---
"@krizaka/ui": patch
---

New server-safe entry `@krizaka/ui/avatar/defaults` (`defaultAvatarUrl`, `defaultAvatarSvg`, …): the pure helpers of the default avatars can be called in a Server Component. `@krizaka/ui/avatar` keeps re-exporting them for client code, but calling them from the server through it failed ("Attempted to call defaultAvatarUrl() from the server"). A test now checks that no server entry reaches a "use client" module.
