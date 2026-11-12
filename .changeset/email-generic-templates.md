---
"@krizaka/email": minor
---

feat(email): two generic templates, `verificationCode` (a 6-digit one-time code with its life in minutes and an optional purpose) and `notification` (a title, a line and an optional https action the caller words), both transactional, FR/EN, branded, dark mode, with a plain-text part. Products stop designing these mails themselves (ADR-033).
