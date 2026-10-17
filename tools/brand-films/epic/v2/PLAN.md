# « La tournée » v2: the birds speak and sing

Oussama, 2026-10-17: « si les personnages peuvent parler ou chanter, c'est encore mieux… fais-moi rêver ». The cut of
v1, re-shot at full quality, where **each promise bird says its own line** and **the family sings the closing line**.
Every brand rule of `../TREATMENT.md` still holds (the right bird for the right promise, no humans, no real person's
voice, likeness or song, the film's exact lines), plus the §5.3 exception: every bird starts from the Mascot render
and each take is checked against it.

## What speaks, what sings (the film's own lines, EN / FR)

| Bird | Line (FILM.cues) | Shot | Voice seed (Kokoro, Apache-2.0) |
|---|---|---|---|
| falcon | The falcon keeps watch: security comes first. / Le faucon veille : la sécurité d'abord. | club, at the mic, spotlight | `bm_george`: low, dry, deadpan |
| owl | The owl reads every page and knows every face. / Le hibou lit chaque page et reconnaît chaque visage. | dinner, by candlelight | `bf_emma`: calm, wise |
| flamingo | The flamingo answers, and the payment follows. / Le flamant répond, et le paiement suit. | dinner head of table | `af_bella`: smooth, assured |
| duck | The duck builds, line by line, in the open. / Le canard construit, ligne après ligne, en open source. | 90s studio | `am_puck`: quick, playful |
| pigeon | The pigeon delivers, every time. / Le pigeon livre, à chaque fois. | grass court | `am_eric`: bright, proud |
| the family (sung) | Each bird carries a promise, and the family keeps growing. / Chaque oiseau porte une promesse, et la famille s'agrandit. | lovebirds on the beach, then the flock on the ridge | ACE-Step 1.5 (MIT) choir of bright, cartoonish voices |

The Kokoro voice is only the **timbre seed**: Chatterbox (MIT) speaks each line in EN and FR from that seed, so a
bird has the same voice in both languages, then a light per-bird pitch shift. No voice imitates a real person.

## Models (licences checked 2026-10-17)

| Role | Model | Licence |
|---|---|---|
| Talking and singing shots | Wan 2.2 **S2V-14B** (audio-driven, from the keyframe), 40 steps | Apache-2.0 |
| Silent cinematic shots | Wan 2.2 **I2V A14B, 40 steps** (not the 4-step distill), real CFG and negative prompt | Apache-2.0 |
| Keyframes | FLUX.2 [klein] 4B edit, on the Mascot render | Apache-2.0 |
| Voices | Kokoro-82M (timbre seeds), Chatterbox multilingual (EN/FR) | Apache-2.0, MIT |
| Song and score | ACE-Step 1.5 (lyrics, choir; genre prompts only) | MIT |
| Master | SeedVR2 3B → 2160p master, 1080p delivery | Apache-2.0 |

## The cut (~75 s)

Same five eras as v1. Each act: one cinematic establishing shot (I2V 40 steps), then the bird **speaks its line on
camera** (S2V, beak on the words), captions under it. The finale: the lovebirds sing the first half of the chorus on the
beach, the flock on the ridge sings the second half, then the Krizaka mark. Music: the v1 medley re-cut under the
voices (ducked -9 dB), the sung chorus at the end, the synthesised hits. EN and FR cuts (the speech and the song are
remade per language, the picture of the talking shots too, so the beaks follow each language).
