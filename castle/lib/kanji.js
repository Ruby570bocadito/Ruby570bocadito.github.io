const D = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

/** 0–100 en numerales kanji tradicionales: 75 → 七十五, 100 → 百. */
export function toKanji(n) {
  n = Math.max(0, Math.min(100, Math.round(n)));
  if (n === 100) return '百';
  if (n < 10) return D[n];
  const t = Math.floor(n / 10), o = n % 10;
  return (t > 1 ? D[t] : '') + '十' + (o ? D[o] : '');
}
