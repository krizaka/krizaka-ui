# @krizaka/push

Mobile push **without an SDK**: the [Expo Push Service](https://docs.expo.dev/push-notifications/sending-notifications/)
relays to Firebase Cloud Messaging on Android and to the Apple Push Notification service on iOS, from one HTTP call and
one kind of token (`ExponentPushToken[…]`). The FCM and APNs credentials live in the app's EAS project — never on your
server.

```bash
npm install @krizaka/push
```

ESM only, Node ≥ 22, **zero dependency**: you pass `fetch` (the global one in production, a fake in tests).

## Use

```ts
import { isExpoPushToken, sendExpoPush } from "@krizaka/push";

// When the phone registers: refuse anything that is not an Expo token before storing it.
if (!isExpoPushToken(token)) return badRequest();

// When something happens: one message per device, sent in batches of 100.
const outcome = await sendExpoPush(
  devices.map((d) => ({ to: d.token, title, body, data: { path: "/inbox/42" } })),
  { fetch, accessToken: process.env.PUSH_ACCESS_TOKEN },   // the token: only with "enhanced push security" on
);
await forgetTokens(outcome.deadTokens);                     // uninstalled app, revoked permission
if (outcome.errors.length) log.warn(outcome.errors[0]);
```

| Export | What |
| :-- | :-- |
| `sendExpoPush(messages, { fetch, accessToken? })` | Sends in batches of `EXPO_PUSH_BATCH` (100); returns `{ sent, deadTokens, errors }`. **Never throws.** Messages whose `to` is not an Expo token are dropped before any call. Defaults: `sound: "default"`, `channelId: "default"` (create that Android channel in the app). |
| `isExpoPushToken(token)` | Whether a string looks like an Expo push token. |
| `PushMessage`, `PushTicket`, `PushOutcome` | The types. |
| `EXPO_PUSH_URL`, `EXPO_PUSH_BATCH` | The endpoint and the batch size. |

## The rules it carries

- **Best-effort.** A push repeats what the app already shows (the bell, the inbox); it never decides anything. Write
  the fact first, push second.
- **Dead tokens are forgotten.** `DeviceNotRegistered` tickets come back in `deadTokens`: delete them.
- **Data, not secrets.** `data` is delivered to the device as is: a path to open, an id — never personal content you
  would not show on a lock screen.
- **Send from production only** (or behind an explicit switch): local runs and CI should never call the service.

Switching to FCM HTTP v1 and APNs directly later changes this package only, not its callers.

## How the Krizaka products use it

- **A video platform**: a push for each notification an account allows (a new follower, a message, an auction
  outbid), sent after the notification is written, the dead tokens deleted from its `push_devices` table.
- **A dating app**: "your batch is ready", a new intro, a message in an intro.

## License

Apache-2.0 © Krizaka
