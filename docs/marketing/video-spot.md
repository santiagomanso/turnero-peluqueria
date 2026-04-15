# Spot Publicitario — Turnero Peluquería SaaS

## Concepto

Historia real en tres actos: el caos diario de gestionar turnos a mano → el contraste de cómo es con la app → la dueña al final del día en control total.

**Plataforma destino:** Instagram Stories / Reels
**Herramienta:** OpenArt — Kling 2.6 / Kling 3.0
**Texto:** NO generado por IA — agregar en CapCut en post-producción
**Referencia de personaje:** Usar las imágenes generadas con ChatGPT como Start Frame en OpenArt para mantener consistencia visual entre clips

---

## Workflow

```
OpenArt (Kling 2.6/3.0)  →  genera cada clip con Start Frame de referencia
CapCut                    →  monta clips + agrega textos + música + captions
```

> **Regla de oro:** Kling NO genera texto legible. Todo copy va en CapCut.
> **Para consistencia:** Cargar siempre la misma imagen de referencia del personaje como Start Frame.

---

## PERSONAJE — Descripción fija para todos los prompts

Para que Kling mantenga consistencia entre clips, incluir siempre en el prompt:

```
blonde woman with messy bun, black leather apron over white t-shirt,
mid-30s, warm natural look, no heavy makeup
```

**Start Frame recomendado:** Imagen 1 (peluquera sonriendo atendiendo clienta, libreta visible)

---

## VIDEO 1 — "El caos de siempre" (10s, 9:16 vertical)

**Historia:** La dueña está atendiendo tranquila → suena el teléfono → lo atiende y tiene que buscar en la libreta → retoma la clienta → vuelve a sonar.

**Formato en OpenArt:** Multi-shot, 10s, Audio ON, Start Frame = Imagen 1

### Prompt completo

```
[SHOT 1 - 0 to 4s]
Warm cozy hair salon interior, golden hour lighting. Blonde woman with
messy bun, black leather apron over white t-shirt, mid-30s, calmly
styling a female client sitting in salon chair with white towel on head.
On the counter: open messy appointment book filled with handwriting and
sticky notes, a smartphone face-down. Camera holds steady, intimate
medium shot, warm film look. Peaceful mood.

[SHOT 2 - 4s to 7s]
Sudden cut. The smartphone on the counter lights up and vibrates loudly.
The hairdresser pauses, glances at the phone with a slight frown, picks
it up. She opens the appointment book with her free hand, scanning the
messy handwriting while pressing the phone to her ear. The seated client
watches with a mildly impatient expression. Handheld camera, slight
tension in the air.

[SHOT 3 - 7s to 10s]
The hairdresser hangs up, exhales, puts the phone down on the counter.
She turns back toward her client with an apologetic half-smile and raises
her comb. Immediately the phone lights up again on the counter. Her eyes
drop to it. Visible exhaustion on her face. Close-up on her tired
expression. Fade to black.

Vertical 9:16, cinematic color grade, warm tones, realistic documentary
style, no text on screen.
```

### Textos a agregar en CapCut

| Momento | Texto | Color | Animación |
|---------|-------|-------|-----------|
| Shot 2 (teléfono suena) | `¿Tenés turno a las 14:30?` | Blanco | Typewriter rápido |
| Shot 3 (segundo llamado) | `Y otra vez.` | Rojo | Shake + fade |
| Final (fade a negro) | `¿Así todos los días?` | Blanco | Fade in lento |

### Audio sugerido (CapCut)
Sonido de teléfono vibrando → corte seco a silencio → beat de tensión low-fi

---

## VIDEO 2 — "Mientras tanto" (15s, 9:16 split-screen vertical)

**Historia:** Pantalla dividida. Izquierda: la dueña trabaja tranquila atendiendo. Derecha: sus clientas en casa, en el trabajo, desde el celular agendan/consultan/modifican su turno sin llamar.

**Formato en OpenArt:** Generar los dos lados por separado → montar en CapCut como split-screen

---

### CLIP 2A — Lado izquierdo: La dueña trabaja tranquila (15s)

**Start Frame:** Imagen 1 (peluquera sonriendo atendiendo clienta)

```
Blonde woman with messy bun, black leather apron over white t-shirt,
mid-30s, working calmly in a warm hair salon. She applies hair dye to a
client's hair, smiling naturally, relaxed body language. No phone in
sight. Warm golden lighting, soft bokeh background with salon mirrors and
chairs. Slow push-in camera movement. Cinematic, peaceful. No phone
interruptions. Vertical 9:16, realistic.
```

---

### CLIP 2B — Lado derecho: Clienta desde su casa (5s)

```
Young woman in casual home clothes, sitting on a couch, tapping on a
clean modern mobile app on her smartphone, selecting a date and time on a
calendar interface, smiling slightly. Soft natural daylight from a window.
Relaxed and comfortable mood. Close-up on hands and phone screen, slight
over-shoulder angle. Vertical 9:16, warm tones, cinematic.
```

---

### CLIP 2C — Lado derecho: Clienta desde el trabajo (5s)

```
Professional woman in office attire, sitting at a desk, quickly checking
a booking confirmation on her smartphone, a green checkmark visible on
screen, she smiles and puts the phone face-down returning to her work.
Clean modern office background, soft light. Vertical 9:16, cinematic.
```

---

### CLIP 2D — Lado derecho: Clienta modificando turno (5s)

```
Woman lying in bed in pajamas, casually tapping on a smartphone app,
changing a date on a calendar screen, tapping confirm, then placing the
phone on the nightstand satisfied. Cozy bedroom with soft lamp light.
Relaxed mood. Vertical 9:16, warm tones.
```

---

### Montaje en CapCut — Video 2

```
Split-screen vertical: izquierda = CLIP 2A (dueña trabajando, dura todo)
                        derecha  = 2B → 2C → 2D en secuencia
```

### Textos a agregar en CapCut

| Momento | Texto | Posición | Color |
|---------|-------|----------|-------|
| Arranque | `Ella trabaja.` | Izquierda, arriba | Blanco |
| Arranque | `Ellas reservan solas.` | Derecha, arriba | Blanco |
| Final | `Sin llamadas. Sin interrupciones.` | Centro, abajo | Dorado |

---

## VIDEO 3 — "Al final del día" (10s, 9:16 vertical)

**Historia:** La dueña cierra el salón, se sienta, abre la app en el teléfono, revisa los turnos de los próximos días y la sección de métricas/finanzas. Cara de satisfacción.

**Formato en OpenArt:** Single shot, 10s, Audio ON

### Prompt completo

```
Evening in a hair salon, warm dim lighting, chairs empty. Blonde woman
with messy bun, black leather apron partially removed, sitting relaxed
at the salon counter. She picks up her smartphone and navigates an app —
first scrolling through a weekly calendar view with colored appointment
blocks, then switching to a clean financial dashboard with charts and
numbers. She leans back slightly, a slow satisfied smile spreading across
her face. She nods. Camera slow push-in on her face and screen.
Cinematic, warm golden tones, peaceful end-of-day mood. Vertical 9:16,
no text on screen.
```

### Textos a agregar en CapCut

| Momento | Texto | Color | Animación |
|---------|-------|-------|-----------|
| Revisa turnos | `Turnos de la semana. Sin llamar a nadie.` | Blanco | Slide in |
| Revisa métricas | `Ingresos del día. Siempre al día.` | Dorado | Fade in |
| Final (sonrisa) | `Tu peluquería, en piloto automático.` | Dorado | Fade in lento |

---

## VIDEO 4 — CTA (solo CapCut, sin IA)

Fondo negro. Sin video generado.

```
Turnos · Pagos · Tienda
Todo en uno.
[URL]
```

**Tipografía:** Sans-serif, blanco y dorado
**Duración:** 3–4 segundos
**Animación:** Fade in palabra por palabra

---

## Resumen de clips a generar en OpenArt

| # | Video | Duración | Modelo sugerido | Start Frame |
|---|-------|----------|-----------------|-------------|
| 1 | El caos (multi-shot) | 10s | Kling 3.0 | Imagen 1 (calma) |
| 2A | Dueña trabaja (split izquierda) | 15s | Kling 2.6 | Imagen 1 |
| 2B | Clienta en casa | 5s | Kling 2.6 | Ninguno |
| 2C | Clienta en trabajo | 5s | Kling 2.6 | Ninguno |
| 2D | Clienta en cama | 5s | Kling 2.6 | Ninguno |
| 3 | Al final del día | 10s | Kling 3.0 | Imagen 1 |

> **Usar Kling 3.0** para los clips donde el personaje principal hace expresiones faciales (Video 1 y Video 3). Kling 2.6 es suficiente para tomas de manos/secundarias.

---

## Tips de producción

- **Start Frame siempre** — Cargar la imagen de referencia para mantener consistencia del personaje entre clips. Sin Start Frame, Kling genera un personaje diferente en cada clip.
- **Audio ON en OpenArt** — Kling genera ambiente sonoro (ruido de salón, teléfono, pasos) que sirve de base. Reemplazar o mezclar en CapCut.
- **Split-screen en CapCut** — Usar plantilla "Picture in Picture" o "Split Screen" con ratio 50/50 vertical. Ajustar timing para que las clientas coincidan con momentos de la dueña trabajando.
- **Screenshots de la app** — Para Video 3, si Kling no genera una pantalla convincente, agregar screenshot real de la app como overlay animado en CapCut (escala desde 0, efecto "phone reveal").
- **Música:** Video 1 = tensión/caos (notificaciones, beat ansioso) → Video 2 = contraste calmo-activo → Video 3 = beat minimal satisfecho con crescendo al CTA.
- **No regenerar si la escena es buena** — Kling 3.0 consume créditos. Si el movimiento es correcto aunque el personaje no sea idéntico, usar igual — la consistencia se logra más con Start Frame que con múltiples regeneraciones.

---

## Herramientas

| Herramienta | Uso |
|-------------|-----|
| OpenArt — Kling 3.0 | Clips con expresión facial del personaje principal |
| OpenArt — Kling 2.6 | Clips secundarios (clientas, manos, ambiente) |
| CapCut | Montaje, split-screen, textos, música, captions |
| ChatGPT Image | Generación de Start Frames de referencia del personaje |
