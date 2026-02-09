export type ParsedDescription = {
  paragraph: string;
  bullets: string[];
};

const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();

const decodeHtml = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const stripHtml = (raw: string) => {
  const withBreaks = raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '');
  const noTags = withBreaks.replace(/<[^>]*>/g, '');
  return decodeHtml(noTags);
};

export const parseDescription = (raw: string): ParsedDescription => {
  const cleaned = stripHtml(raw).trim();
  if (!cleaned) {
    return { paragraph: '', bullets: [] };
  }

  const parts = cleaned.split(/\.:\s*/).map((p) => p.trim()).filter(Boolean);
  const hasDotColon = parts.length > 1;
  const head = hasDotColon ? (parts.shift() as string) : cleaned;

  let paragraph = '';
  let bullets: string[] = [];

  if (hasDotColon) {
    paragraph = normalize(head);
    const bulletText = parts.join('\n');
    bullets = bulletText
      .split(/\n+/)
      .map((b) => normalize(b))
      .filter(Boolean);
  } else if (head.includes(' - ')) {
    const dashParts = head.split(/\s-\s/).map((p) => p.trim()).filter(Boolean);
    if (dashParts.length >= 3) {
      paragraph = normalize(dashParts.shift() as string);
      bullets = dashParts.map(normalize).filter(Boolean);
    } else {
      paragraph = normalize(head);
    }
  } else {
    const lines = head.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    bullets = lines
      .filter((line) => /^[-•]\s+/.test(line))
      .map((line) => normalize(line.replace(/^[-•]\s+/, '')));
    paragraph = normalize(lines.filter((line) => !/^[-•]\s+/.test(line)).join(' '));
  }

  const paragraphLower = paragraph.toLowerCase();
  const deduped = Array.from(new Set(bullets)).filter((b) => {
    const bl = b.toLowerCase();
    return bl !== paragraphLower && !paragraphLower.includes(bl);
  });

  return { paragraph, bullets: deduped };
};
