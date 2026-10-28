// Ilustraciones del portfolio generadas con Muse Image (Meta) — muse-image-1.0.
// Cada trabajo produce PNG en bruto en .art-raw/; scripts/process-art.py los recorta y los pasa a WebP en public/art/.

const OBJ =
  'Hand-drawn sketchbook illustration with loose graphite pencil and black ink linework, light cross-hatching and soft muted watercolor washes. ' +
  'Isolated single subject on a plain pure white background, centered, fully visible with a generous empty white margin on all sides. ' +
  'No text, no letters, no numbers, no logos, no signature, no border, no cast shadow on the ground.';
const FRONT = OBJ + ' Straight-on front elevation view, flat, no perspective distortion.';
const TEX =
  'Seamless tileable texture, straight-on flat view that fills the whole image edge to edge with no border. ' +
  'Hand-drawn sketchbook style: graphite pencil and black ink linework with light cross-hatching and a very soft muted watercolor wash. ' +
  'Even lighting, no objects, no text.';
const SCENE =
  'Wide hand-drawn sketchbook illustration with loose graphite pencil and black ink linework, light cross-hatching and soft muted watercolor washes, ' +
  'the drawing fills the entire image, airy composition with lots of light paper tones. No text, no letters, no logos, no signature, no border.';

const island = top =>
  `A small floating island: a chunk of earth and rock with a grassy top and dangling roots underneath, floating in the air. On top of the island: ${top}. ` + OBJ;

export const JOBS = [
  // ── Personaje (a partir de la foto) ──
  { id: 'avatar', edit: ['photo'], size: '1024x1024', prompt: 'Turn this photo into a hand-drawn sketchbook portrait of the same young man (keep his exact likeness: short dark wavy hair, dark eyes, friendly slight smile, black t-shirt). Loose graphite pencil and black ink linework with light cross-hatching, soft muted watercolor washes, head and shoulders, isolated on a plain pure white background, no text.' },
  { id: 'avatar-window', edit: ['avatar', 'photo'], size: '1024x1024', prompt: 'Using the young man from the reference images (keep his exact likeness: short dark wavy hair, dark eyes, friendly smile, black t-shirt), draw him leaning on the sill of an open old wooden window with two open wooden shutters, waving hello with one hand. Draw only the window with him in it; the wall around the window is not drawn. ' + FRONT },
  { id: 'avatar-full', edit: ['avatar', 'photo'], size: '1024x1536', prompt: 'Using the young man from the reference images (keep his exact likeness: short dark wavy hair, dark eyes, friendly smile), draw him full body standing and waving hello, wearing a black t-shirt, dark jeans and white sneakers, a small backpack on one shoulder. ' + OBJ },

  // ── Entrada ──
  { id: 'brick', size: '1024x1024', prompt: 'Old light red-brown brick wall in running bond pattern with pale mortar lines and a few chipped bricks. ' + TEX },
  { id: 'door-main', size: '1024x1536', prompt: 'A closed wooden double front door inside a simple wooden door frame with a small stone threshold step. Two tall door leaves with recessed panels and long brass lever handles in the middle. The doors are decorated with a handful of playful round and square stickers: a shield with a padlock, a cute penguin, a green snake, a small robot head, a game controller, a light bulb with circuit lines and a ladybug. ' + FRONT },
  { id: 'sign', size: '1536x1024', prompt: 'A blank rustic wooden plank sign board hanging from two short iron chains attached at the top; the face of the board is completely empty with no writing. ' + FRONT },
  { id: 'tree', size: '1024x1536', prompt: 'A big leafy deciduous tree with a thick twisted trunk and visible roots. A small wooden birdhouse with a tiny satellite dish on its roof hangs from one branch by a rope. ' + OBJ },
  { id: 'robot', size: '1024x1024', prompt: 'A small friendly robot sitting, with a round helmet head, big eyes, a little antenna and claw hands. ' + OBJ },
  { id: 'mailbox', size: '1024x1536', prompt: 'A classic rounded metal mailbox on a wooden post; the little red flag is raised and a white envelope sticks out of the slot. ' + OBJ },
  { id: 'planter', size: '1536x1024', prompt: 'A long wooden planter box full of small succulents and cacti, with a small yellow rubber duck sitting among the plants. ' + FRONT },
  { id: 'bug', size: '1024x1024', prompt: 'A small cute dark green beetle seen from directly above, legs spread as if crawling. ' + OBJ },
  { id: 'lantern', size: '1024x1536', prompt: 'An old black iron wall lantern hanging from a curly wall bracket, glass panes, a warm glowing bulb inside. ' + OBJ },
  { id: 'path', size: '1024x1536', prompt: 'A path of irregular flat stepping stones with little tufts of grass between them, seen from directly above, the path runs straight from the bottom of the image to the top. ' + OBJ },

  // ── Pasillo ──
  { id: 'wall', size: '1536x1024', prompt: 'Interior hallway wall: the lower third is wooden wainscoting with vertical tongue-and-groove boards and a rail on top, the upper part is plain light cream plaster with faint brush strokes, a thin baseboard at the very bottom. ' + TEX },
  { id: 'floor', size: '1024x1024', prompt: 'Wooden floorboards seen from directly above, long planks running vertically, visible wood grain and small nail dots. ' + TEX },
  { id: 'ceiling', size: '1024x1024', prompt: 'Plain light cream plaster ceiling with faint brush strokes and a few hairline cracks. ' + TEX },
  { id: 'door-a', size: '1024x1536', prompt: 'A single closed wooden interior door with four recessed panels and a round brass doorknob, inside a simple painted wooden door frame. ' + FRONT },
  { id: 'door-b', size: '1024x1536', prompt: 'A single closed wooden interior door with a round porthole window near the top (the glass is plain white), three horizontal panels below and a brass lever handle, inside a simple wooden door frame. ' + FRONT },
  { id: 'door-c', size: '1024x1536', prompt: 'A single closed old wooden door with an upper frosted glass pane divided into four small squares and two panels below, a brass doorknob, inside a simple wooden door frame. ' + FRONT },
  { id: 'door-end', size: '1024x1536', prompt: 'A tall arched wooden double door with many small glass panes, bright warm sunlight glowing through the glass, inside a stone archway. ' + FRONT },
  { id: 'frame-ornate', size: '1024x1280', prompt: 'An empty ornate gilded picture frame with carved corners; the inside of the frame is completely empty plain white. ' + FRONT },
  { id: 'frame-simple', size: '1024x1280', prompt: 'An empty simple thin dark wooden picture frame with a white mat; the inside is completely empty plain white. ' + FRONT },
  { id: 'plant', size: '1024x1536', prompt: 'A tall monstera plant in a round terracotta pot. ' + OBJ },
  { id: 'bench', size: '1536x1024', prompt: 'A simple wooden hallway bench with four legs. ' + FRONT },
  { id: 'lamp', size: '1024x1536', prompt: 'A hanging pendant ceiling lamp with a metal cone shade and a glowing bulb, on a long cord coming from the top edge. ' + OBJ },
  { id: 'side-table', size: '1024x1280', prompt: 'A small round wooden side table with a steaming coffee mug and a short stack of books on top. ' + FRONT },

  // ── Sobre mí (cielo) ──
  { id: 'clouds', n: 3, size: '1536x1024', prompt: 'A single soft fluffy cumulus cloud drawn with light pencil outlines and the faintest blue-grey watercolor shading. ' + OBJ },
  { id: 'balloon', size: '1024x1536', prompt: 'A small hot air balloon with a wicker basket; the balloon envelope is plain off-white with simple vertical seams and no pattern, ropes connect it to the basket. ' + OBJ },
  { id: 'isl-start', size: '1024x1024', prompt: island('a small wooden desk with an old CRT computer monitor showing a simple video game, and a game controller next to it') },
  { id: 'isl-arcade', size: '1024x1024', prompt: island('a retro arcade cabinet machine') },
  { id: 'isl-castle', size: '1024x1024', prompt: island('a small stone castle tower with a shield emblem showing a padlock, and a flag on top') },
  { id: 'isl-school', size: '1024x1024', prompt: island('a small school building with a clock on the front and a flag') },
  { id: 'isl-lab', size: '1024x1024', prompt: island('a camping tent, a laptop on a wooden crate, a small server rack with tiny lights and a cozy campfire') },
  { id: 'isl-robot', size: '1024x1024', prompt: island('a small robot standing on a winner podium holding up a trophy') },
  { id: 'isl-rocket', size: '1024x1024', prompt: island('a small rocket on a launch pad ready for lift-off, with a little smoke') },

  // ── Proyectos (tablón de investigación) ──
  { id: 'cork', size: '1024x1024', prompt: 'Cork board surface with natural cork granules, warm light brown. ' + TEX },
  { id: 'pin', size: '1024x1024', prompt: 'A single red push pin seen from the front at a slight angle, round head and short metal needle. ' + OBJ },
  { id: 'magnifier', size: '1024x1024', prompt: 'A vintage magnifying glass with a wooden handle. ' + OBJ },
  { id: 'folder', size: '1536x1024', prompt: 'A closed manila file folder with a tab and a paper clip on the edge, slightly worn. ' + FRONT },

  // ── Ciberseguridad (laboratorio) ──
  { id: 'monitor', size: '1024x1024', prompt: 'An old-school chunky computer monitor with a thick beige bezel and a completely blank solid dark screen, on a small stand. ' + FRONT },
  { id: 'desk', size: '1536x1024', prompt: 'A long wooden desk with a mechanical keyboard, a mouse, a coffee mug and a pair of headphones on top. ' + FRONT },
  { id: 'bookshelf', size: '1024x1536', prompt: 'A tall wooden bookshelf with five completely empty shelves. ' + FRONT },
  { id: 'whiteboard', size: '1536x1024', prompt: 'A whiteboard on a stand with a hand-drawn network diagram: small computers, a server, a cloud and a brick firewall connected by lines and arrows. ' + FRONT },
  { id: 'chair', size: '1024x1024', prompt: 'An office swivel chair with a dark hoodie draped over its backrest. ' + OBJ },
  { id: 'rack', size: '1024x1536', prompt: 'A tall server rack cabinet with stacked servers, little green status lights and neatly bundled cables. ' + FRONT },

  // ── Programación (taller) ──
  { id: 'laptop', size: '1536x1024', prompt: 'An open laptop seen from the front with a completely blank solid dark screen. ' + FRONT },
  { id: 'arcade', size: '1024x1536', prompt: 'A retro arcade cabinet machine with a joystick, buttons and a completely blank solid dark screen. ' + FRONT },
  { id: 'pegboard', size: '1536x1024', prompt: 'A wooden pegboard panel with seven tools hanging on hooks in a neat evenly spaced row: a hammer, a wrench, a screwdriver, pliers, a hand saw, a paintbrush and a soldering iron. ' + FRONT },
  { id: 'duck', size: '1024x1024', prompt: 'A classic yellow rubber duck. ' + OBJ },

  // ── Certificaciones ──
  { id: 'gradcap', size: '1024x1024', prompt: 'A black graduation cap (mortarboard) with a tassel resting on a small stack of books. ' + OBJ },

  // ── IA y hackatones ──
  { id: 'bulb', size: '1024x1536', prompt: 'A large light bulb with a brain made of circuit lines glowing inside. ' + OBJ },
  { id: 'rocket', size: '1024x1536', prompt: 'A small cartoon rocket with round windows and fins, pointing up, with a little flame. ' + OBJ },

  // ── Robótica ──
  { id: 'robot-kit', size: '1536x1024', prompt: 'A small wheeled competition robot built from a construction kit, with sensors, wires, a small control brick and big rubber wheels. ' + OBJ },
  { id: 'trophy', size: '1024x1536', prompt: 'A big shiny golden trophy cup with two handles and a star on top, on a small base. ' + OBJ },
  { id: 'gear', size: '1024x1024', prompt: 'A single mechanical gear cog with teeth all around and a round hole in the center. ' + FRONT },
  { id: 'medal', size: '1024x1536', prompt: 'A round silver medal hanging from a striped ribbon. ' + OBJ },

  // ── Contacto ──
  { id: 'sea', size: '1792x1024', prompt: 'A calm Mediterranean seaside at the end of a wooden pier, a small lighthouse on rocks to the right, a sailboat on the horizon, a couple of seagulls, soft sky. ' + SCENE },
  { id: 'envelope', size: '1536x1024', prompt: 'A sealed paper envelope with a red wax seal. ' + FRONT },
  { id: 'plane', size: '1536x1024', prompt: 'A folded white paper airplane flying, side view. ' + OBJ },

  // ── Objetivo (horizonte) ──
  { id: 'landscape', size: '1792x1024', prompt: 'A winding country road leading from the foreground toward distant mountains under a big open sky with a rising sun and a few birds, gentle fields on both sides. ' + SCENE },
  { id: 'signpost', size: '1024x1536', prompt: 'A wooden signpost with six blank wooden arrow-shaped signs pointing left and right at different heights; the arrows have no writing at all. ' + FRONT }
];
