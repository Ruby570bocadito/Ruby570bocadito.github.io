'use client';
import { useStore } from './store';

const UI = {
  loading: { en: 'Preparing the watch...', es: 'Preparando la guardia...', ja: '見張りの準備中...' },
  skip: { en: 'Skip to accessible navigation', es: 'Saltar a navegación accesible', ja: 'アクセシブル版へ移動' },
  to3d: { en: '3D castle', es: 'Castillo 3D', ja: '3D版' },
  to2d: { en: 'Accessible 2D', es: 'Versión 2D accesible', ja: '2D版' },
  back: { en: 'Back', es: 'Volver', ja: '戻る' },
  map: { en: 'Map', es: 'Mapa', ja: '地図' },
  audio: { en: 'Sound', es: 'Sonido', ja: '音' },
  stamps: { en: 'Stamp book', es: 'Libro de sellos', ja: '御朱印帳' },
  music: { en: 'Music & ambience', es: 'Música y ambiente', ja: '音楽・環境音' },
  effects: { en: 'Effects', es: 'Efectos', ja: '効果音' },
  mute: { en: 'Mute', es: 'Silenciar', ja: 'ミュート' },
  unmute: { en: 'Turn sound on', es: 'Activar sonido', ja: '音を出す' },
  gateHint: { en: 'Click the ōtemon gate to enter', es: 'Pulsa el portón (ōtemon) para entrar', ja: '大手門をクリックして入城' },
  enter: { en: 'Enter', es: 'Entrar', ja: '入る' },
  scrollHint: { en: 'Scroll to walk the engawa', es: 'Haz scroll para recorrer la pasarela', ja: 'スクロールで縁側を歩く' },
  scrollRead: { en: 'Scroll to unroll the emakimono', es: 'Haz scroll para desenrollar el emakimono', ja: 'スクロールで絵巻を広げる' },
  dragHint: { en: 'Drag to look around · click a tablet', es: 'Arrastra para girar · pulsa una tablilla', ja: 'ドラッグで見回す・絵馬をクリック' },
  hoverHint: { en: 'Hover a weapon', es: 'Pasa el ratón por un arma', ja: '武器にカーソルを' },
  clickScroll: { en: 'Pick a scroll', es: 'Elige un pergamino', ja: '巻物を選ぶ' },
  unlock: { en: 'Turn the key', es: 'Gira la llave', ja: '鍵を回す' },
  close: { en: 'Close', es: 'Cerrar', ja: '閉じる' },
  github: { en: 'GitHub', es: 'GitHub', ja: 'GitHub' },
  demo: { en: 'Demo', es: 'Demo', ja: 'デモ' },
  noDemo: { en: 'Demo on request', es: 'Demo bajo petición', ja: 'デモは要相談' },
  stack: { en: 'Stack', es: 'Stack', ja: '技術' },
  metrics: { en: 'Key metrics', es: 'Métricas clave', ja: '主要指標' },
  featured: { en: 'Featured', es: 'Destacado', ja: '注目' },
  learned: { en: 'What it taught me', es: 'Lo que me enseñó', ja: '学んだこと' },
  sendMsg: { en: 'Send a message', es: 'Enviar mensaje', ja: 'メッセージを送る' },
  downloadCv: { en: 'Download CV', es: 'Descargar CV', ja: '履歴書' },
  name: { en: 'Your name', es: 'Tu nombre', ja: 'お名前' },
  yourEmail: { en: 'Your email', es: 'Tu email', ja: 'メール' },
  message: { en: 'Message', es: 'Mensaje', ja: 'メッセージ' },
  send: { en: 'Fold & send', es: 'Doblar y enviar', ja: '折って送る' },
  letterNote: { en: 'Opens your mail app with the letter ready.', es: 'Abre tu app de correo con la carta preparada.', ja: 'メールアプリが開きます。' },
  required: { en: 'Please fill in every field.', es: 'Rellena todos los campos.', ja: 'すべて入力してください。' },
  achievements: { en: 'stamps', es: 'sellos', ja: '印' },
  stampEarned: { en: 'Stamp earned', es: 'Sello conseguido', ja: '御朱印を授与' },
  here: { en: 'You are here', es: 'Estás aquí', ja: '現在地' },
  gate: { en: 'Gate & courtyard', es: 'Portón y patio', ja: '大手門・中庭' },
  terminalHint: { en: 'Press ~ for the terminal', es: 'Pulsa ~ para la terminal', ja: '~ でターミナル' },
  terminal: { en: 'Terminal', es: 'Terminal', ja: '端末' },
  classic: { en: 'Classic portfolio', es: 'Portfolio clásico', ja: '旧ポートフォリオ' },
  locked: { en: 'Locked storehouse', es: 'Almacén cerrado', ja: '施錠された蔵' },
  hiring: { en: 'Open to internships and junior roles', es: 'Abierto a prácticas y puestos junior', ja: 'インターン・ジュニア職募集中' },
  rooms: { en: 'Rooms', es: 'Salas', ja: '部屋' },
  home: { en: 'Castle', es: 'Castillo', ja: '城' },
  copied: { en: 'Email copied', es: 'Email copiado', ja: 'コピーしました' },
};

export function pick(v, lang) {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  return v[lang] ?? v.en ?? v.es ?? '';
}

export function useT() {
  const lang = useStore((s) => s.lang);
  return (k) => (typeof k === 'string' ? pick(UI[k] ?? k, lang) : pick(k, lang));
}
