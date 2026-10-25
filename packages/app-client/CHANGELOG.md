# @krizaka/app-client

## 0.2.1

### Patch Changes

- [#666](https://github.com/krizaka/krizaka-ui/pull/666) [`8a5d7b9`](https://github.com/krizaka/krizaka-ui/commit/8a5d7b9f5f440e0d20a22d68ec9e3ef07a437c10) Thanks [@dependabot](https://github.com/apps/dependabot)! - Errors keep their cause: the « did not answer in time » TypeError of `@krizaka/app-client` carries the abort it comes from, and the AggregateError of `@krizaka/payments` (handler and give-back both failed) carries the give-back's failure as `cause`.

## 0.2.0

### Minor Changes

- [#571](https://github.com/krizaka/krizaka-ui/pull/571) [`1035e0c`](https://github.com/krizaka/krizaka-ui/commit/1035e0c5dd0d7a9e0e55575bd923cd6d31cca8da) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `@krizaka/app-client/react`: `createAuth(session, { signIn, signOut })` (the `AuthProvider` and `useAuth` every Expo and Mac
  app had copied), `useSessionStatus` and `AUTH`. React is an optional peer.

## 0.1.0

### Minor Changes

- [#507](https://github.com/krizaka/krizaka-ui/pull/507) [`0f7b249`](https://github.com/krizaka/krizaka-ui/commit/0f7b249c746b83b498ccfe07e1627eec95239265) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - First release: the bearer session over a storage port, the discovery client with a product's address and build inputs, and the API client, extracted from the Expo apps (krizaka/.github#178).
