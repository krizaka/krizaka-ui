# Krizaka cinematic prompt kit: Wan 2.2 (I2V A14B) + FLUX.2 [klein] keyframes

A reusable template for every brand-asset video (addendum: *brand asset videos are Hollywood-grade*). It is written for
Orazaka's `cinema` worker profile: **Wan 2.2 I2V A14B, 4-step lightx2v distill, guidance 1.0, 81 frames at 16 fps,
1280×720 / 720×1280**, and keyframes from **FLUX.2 [klein] 4B**. It is meant to move into the Orazaka cinematic Studio's
data (`cinematic-script` prompt) once proven.

## 1. What the distilled model listens to

- **Guidance 1.0 = no classifier-free guidance, so the negative prompt is ignored.** Every "don't" must be said as a
  "do": *"one single continuous shot"* instead of *no cuts*, *"the character keeps its exact shape and colours"* instead of
  *no morphing*, *"plain unbranded surfaces"* instead of *no logos*. Keep a negative prompt only for the 40-step,
  guidance > 1 runs (template in §5).
- **In image-to-video, the image is the look; the prompt is the motion.** Do not re-describe what the keyframe already
  shows in detail. Name the subject briefly, so the model knows what to move, then spend the words on the action, the
  camera, the light that changes and the pace.
- **One subject action plus one camera move per 5 s clip.** Two moves (orbit *and* push) or three actions produce
  mush. A longer beat is two clips: the second starts from the first's last frame.
- **60–110 words.** Shorter leaves the model to its defaults; longer dilutes the action.
- **Order:** subject → action (with a timing word: *slowly, then suddenly, in unison*) → camera → lens → light →
  atmosphere → texture/grade → pace. Wan 2.2 reads standard film language (pan, tilt, dolly, crane, orbit, rack focus,
  handheld) and holds directions better than 2.1.

## 2. The template

```
[SUBJECT]   The {colour} {bird} character {1 identifying feature: "with a black visor and two glowing cyan eyes"},
[ACTION]    {verb phrase, physical, one beat}, then {one follow-through beat}.
[CAMERA]    {Static locked-off | Slow dolly in | Slow push-in | Slow orbit left | Slow crane up | Handheld slight sway |
             Fast lateral tracking | Rack focus from X to Y}, {lens} mm{, anamorphic}.
[LIGHT]     {key: hard spotlight / candle / golden hour backlight / CRT glow}, {rim light on soft feathers}, {practicals}.
[ATMOS]     {haze in the beam | dust particles | smoke | mist in the valley | clay dust | grass blades flying}.
[LOOK]      {shallow depth of field, creamy bokeh} {film grain 16 mm | sepia film look | broadcast clean colour}.
[PACE]      {slow and deliberate | in slow motion, 120 fps look | energetic}.
[KEEP]      One single continuous shot. The character keeps its exact cartoon design, proportions and colours,
            rendered as a feature-film CG character with soft feather texture. Plain unbranded props, no lettering.
```

The `[KEEP]` line is the positive stand-in for the negative prompt: it goes at the end of **every** prompt.

## 3. Vocabulary that works

| Need | Words |
|---|---|
| Camera | *static locked-off*, *slow dolly in / out*, *slow push-in*, *pull back*, *slow orbit left/right around*, *crane up*, *tilt up*, *pan left*, *handheld slight sway*, *lateral tracking shot*, *rack focus from … to …*, *high broadcast angle*, *low angle hero shot* |
| Lens | *21 / 24 / 28 mm wide*, *35 / 50 mm*, *85 / 100 / 135 mm telephoto*, *macro*, *anamorphic with oval bokeh and horizontal flare* |
| Light | *single hard spotlight*, *warm tungsten key*, *candle light from below*, *golden hour backlight*, *rim light*, *practical lamps*, *CRT glow*, *volumetric god rays*, *hard noon sun, crisp shadows* |
| Atmosphere | *haze*, *smoke*, *dust particles in the beam*, *mist*, *breeze moving the feathers*, *sparks*, *confetti* (sparingly) |
| Speed | *in slow motion*, *120 fps / 240 fps slow-motion look*, *in time with the music*, *in unison*, *suddenly* |
| Texture | *feature-film CG*, *soft fur-like feathers*, *subsurface light in the feathers*, *16 mm film grain*, *sepia film look*, *broadcast clean colour* |

Avoid: artist, film, song and brand names (also a legal rule), *4k, masterpiece, trending* (no effect), more than one camera
verb, and abstract words (*epic, amazing*): show it with light and lens instead.

## 4. Keyframes (FLUX.2 [klein] 4B edit)

The bird always comes from the code. The `Mascot` render (`loops/<bird>-alpha.png`) is composited onto the set at the
shot's scale and position, then FLUX.2 [klein] edit takes it as its reference:

```
Re-light this exact scene as a frame from a feature-film CG animation. Keep the {bird} character's exact shape,
proportions, colours, face and features ({features}) unchanged and in the same place; give it soft, fine feather texture,
subsurface light and a contact shadow. Render the set as a photoreal {set}: {light}, {atmosphere}, {lens} mm,
shallow depth of field. No text, no logos, no people.
```

4 steps (klein is distilled), 1280×720 or 720×1280, 3 seeds. Accept only on-model results (the treatment's §5).

## 5. Negative prompt (only for guidance > 1 runs)

```
cuts, scene change, text, letters, watermark, logo, subtitles, extra limbs, extra wings, extra heads, duplicated
character, melted, morphing, deformed beak, broken neck, realistic real-world bird species, human, person, hands,
flicker, jitter, frame tearing, oversaturated, low detail, blurry character, static frozen frame
```

## 6. A worked example (shot 04 of the epic)

> The orange-red falcon character with a black visor and two glowing cyan eyes stands at a vintage microphone, holds a
> deadpan pause, then slowly turns its head left and right, scanning the room, its cyan eye lights narrowing like a
> scanner as a small shield-shaped reflection glides across the visor. Slow push-in, 85 mm. Single hard spotlight from
> above, warm tungsten, deep black shadows, rim light on soft feathers. Haze and dust in the beam, candle bokeh behind.
> Slow and deliberate. One single continuous shot. The character keeps its exact cartoon design, proportions and
> colours, rendered as a feature-film CG character with soft feather texture. Plain unbranded props, no lettering.

Sources: VEED, *Wan 2.2 prompting guide*; Unifically, *Wan 2.2 image-to-video prompt guide*; Scenario, *Wan 2.2: the
essentials*; Hugging Face forum, *How to get the most out of prompts for WAN models* (the guidance 1.0 point); Instasd,
*Wan 2.2: what's new*.
