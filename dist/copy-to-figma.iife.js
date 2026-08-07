var CopyToFigma = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.js
  var index_exports = {};
  __export(index_exports, {
    buildButtonsSvg: () => buildButtonsSvg,
    buildColorsSvg: () => buildColorsSvg,
    buildFontsSvg: () => buildFontsSvg,
    buildIconsSvg: () => buildIconsSvg,
    buildRadiusSvg: () => buildRadiusSvg,
    buildShadowsSvg: () => buildShadowsSvg,
    buildSpacingSvg: () => buildSpacingSvg,
    buildStyleguideSvg: () => buildStyleguideSvg,
    buildTypographySvg: () => buildTypographySvg,
    copyColorsToClipboard: () => copyColorsToClipboard,
    copyIconsToClipboard: () => copyIconsToClipboard,
    copyStyleguideToClipboard: () => copyStyleguideToClipboard,
    copyTypographyToClipboard: () => copyTypographyToClipboard
  });
  var UI_FONT = "Inter, -apple-system, system-ui, sans-serif";
  var INK = "#1B1B1B";
  var MUTED = "#7A7A7A";
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function hexRgb(h) {
    h = String(h).replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function contrastInk(hex) {
    const [r, g, b] = hexRgb(hex);
    return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? INK : "#FFFFFF";
  }
  function luminance(hex) {
    const [r, g, b] = hexRgb(hex);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
  var num = (v, fallback = 0) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  };
  function splitTop(str) {
    const out = [];
    let depth = 0, cur = "";
    for (const ch of String(str)) {
      if (ch === "(") depth += 1;
      if (ch === ")") depth -= 1;
      if (ch === "," && depth === 0) {
        out.push(cur.trim());
        cur = "";
        continue;
      }
      cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  function frame(w, h, inner, bg = "#FFFFFF") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" rx="16" fill="${bg}"/>` + inner + "</svg>";
  }
  var title = (text, pad = 32) => `<text x="${pad}" y="${pad + 24}" font-family="${UI_FONT}" font-size="20" font-weight="700" fill="${INK}">${esc(text)}</text>`;
  function buildColorsSvg(groups) {
    const PAD = 32, W = 150, H = 104, GAPX = 16, GAPY = 20, COLS = 5, HEADER_H = 34, SECTION_GAP = 26;
    const frameW = PAD * 2 + COLS * W + (COLS - 1) * GAPX;
    const parts = [];
    let y = PAD, count = 0;
    for (const g of groups || []) {
      const items = (g.items || []).filter((it) => it && it.hex);
      if (!items.length) continue;
      parts.push(`<text x="${PAD}" y="${y + 16}" font-family="${UI_FONT}" font-size="16" font-weight="600" fill="${INK}">${esc(g.label)} (${items.length})</text>`);
      y += HEADER_H;
      const rowY = y;
      items.forEach((it, k) => {
        const col = k % COLS, row = Math.floor(k / COLS);
        const sx = PAD + col * (W + GAPX), sy = rowY + row * (H + GAPY);
        const hex = ("#" + String(it.hex).replace("#", "")).toUpperCase();
        const tc = contrastInk(hex);
        const name = it.label && String(it.label).toUpperCase() !== hex ? it.label : null;
        const cx = sx + W / 2;
        parts.push(`<rect x="${sx}" y="${sy}" width="${W}" height="${H}" rx="10" fill="${hex}"/>`);
        if (name) {
          parts.push(`<text x="${cx}" y="${sy + H / 2 - 2}" font-family="${UI_FONT}" font-size="13" font-weight="600" text-anchor="middle" fill="${tc}">${esc(hex)}</text>`);
          parts.push(`<text x="${cx}" y="${sy + H / 2 + 16}" font-family="${UI_FONT}" font-size="11" text-anchor="middle" fill="${tc}">${esc(name)}</text>`);
        } else {
          parts.push(`<text x="${cx}" y="${sy + H / 2 + 4}" font-family="${UI_FONT}" font-size="13" font-weight="600" text-anchor="middle" fill="${tc}">${esc(hex)}</text>`);
        }
        count += 1;
      });
      const rows = Math.ceil(items.length / COLS);
      y = rowY + rows * (H + GAPY) - GAPY + SECTION_GAP;
    }
    const frameH = Math.max(y - SECTION_GAP + PAD, PAD * 2);
    return { svg: frame(frameW, frameH, parts.join("")), count };
  }
  function buildTypographySvg(styles) {
    styles = (styles || []).filter((s) => s && s.tag);
    const PAD = 32, LEFTW = 220, GAP = 24, CARDW = 560, TITLE_H = 46;
    const frameW = PAD * 2 + LEFTW + GAP + CARDW;
    const cardX = PAD + LEFTW + GAP;
    const parts = [title("Typography")];
    let y = PAD + TITLE_H, count = 0;
    for (const s of styles) {
      const real = parseFloat(s.size) || 16;
      const disp = Math.max(12, Math.min(real, 56));
      const rowH = Math.max(disp * 1.5, 78);
      const cardH = rowH - 10;
      parts.push(`<rect x="${cardX}" y="${y}" width="${CARDW}" height="${cardH}" rx="10" fill="#F7F7F7"/>`);
      parts.push(`<text x="${PAD}" y="${y + 22}" font-family="${UI_FONT}" font-size="15" font-weight="600" fill="${INK}">${esc(s.tag)}</text>`);
      const lines = [];
      if (s.family) lines.push(s.family);
      lines.push([s.size, (s.weight || "400") + "", s.lineHeight && s.lineHeight !== "normal" ? "LH " + s.lineHeight : ""].filter(Boolean).join("  \xB7  "));
      const extra = [];
      if (s.letterSpacing && s.letterSpacing !== "normal") extra.push("LS " + s.letterSpacing);
      if (s.color) extra.push(String(s.color).toUpperCase());
      if (extra.length) lines.push(extra.join("  \xB7  "));
      let py = y + 41;
      for (const ln of lines) {
        parts.push(`<text x="${PAD}" y="${py}" font-family="${UI_FONT}" font-size="11" fill="${MUTED}">${esc(ln)}</text>`);
        py += 15;
      }
      const color = s.color && /^#/.test(s.color) && luminance(s.color) < 0.78 ? s.color : INK;
      const maxChars = Math.max(6, Math.floor((CARDW - 40) / (disp * 0.56)));
      let sample = (s.sample || "The quick brown fox").replace(/\s+/g, " ").trim();
      if (sample.length > maxChars) sample = sample.slice(0, maxChars - 1) + "\u2026";
      const family = `&quot;${esc(s.family || "Inter")}&quot;, ${UI_FONT}`;
      const baseline = y + cardH / 2 + disp * 0.34;
      parts.push(`<text x="${cardX + 20}" y="${baseline}" font-family="${family}" font-size="${disp}" font-weight="${esc((s.weight || 400) + "")}" fill="${color}">${esc(sample)}</text>`);
      y += rowH;
      count += 1;
    }
    return { svg: frame(frameW, y + PAD - 4, parts.join("")), count };
  }
  function buildFontsSvg(items) {
    items = (items || []).filter((it) => it && it.family);
    const PAD = 32, ROW_H = 56, TITLE_H = 46, FRAME_W = 640;
    const parts = [title("Fonts")];
    let y = PAD + TITLE_H;
    for (const it of items) {
      const fam = `&quot;${esc(it.family)}&quot;, ${UI_FONT}`;
      parts.push(`<text x="${PAD}" y="${y + 26}" font-family="${fam}" font-size="24" fill="${INK}">${esc(it.family)}</text>`);
      if (it.note) {
        parts.push(`<text x="${PAD}" y="${y + 44}" font-family="${UI_FONT}" font-size="11" fill="${MUTED}">${esc(it.note)}</text>`);
      }
      y += ROW_H;
    }
    return { svg: frame(FRAME_W, y + PAD - 12, parts.join("")), count: items.length };
  }
  function buildSpacingSvg(items) {
    items = (items || []).filter((it) => it && Number.isFinite(it.px));
    const PAD = 32, ROW_H = 34, LABELW = 96, BARH = 20, TITLE_H = 46, MAXBAR = 560;
    const maxPx = Math.max(...items.map((i) => i.px), 1);
    const scale = Math.min(1, MAXBAR / maxPx);
    const frameW = PAD * 2 + LABELW + MAXBAR + 90;
    const parts = [title("Spacing")];
    let y = PAD + TITLE_H;
    for (const it of items) {
      const w = Math.max(2, it.px * scale);
      const cy = y + ROW_H / 2;
      parts.push(`<text x="${PAD}" y="${cy + 4}" font-family="${UI_FONT}" font-size="13" font-weight="600" fill="${INK}">${esc(it.label)}</text>`);
      parts.push(`<rect x="${PAD + LABELW}" y="${cy - BARH / 2}" width="${w}" height="${BARH}" rx="4" fill="#6366F1"/>`);
      parts.push(`<text x="${PAD + LABELW + w + 10}" y="${cy + 4}" font-family="${UI_FONT}" font-size="12" fill="${MUTED}">${esc(Math.round(it.px) + "px")}</text>`);
      y += ROW_H;
    }
    return { svg: frame(frameW, y + PAD, parts.join("")), count: items.length };
  }
  function buildRadiusSvg(values) {
    values = (values || []).map((v) => num(v, NaN)).filter((v) => Number.isFinite(v));
    const PAD = 32, TITLE_H = 46, SZ = 88, GAP = 22, LABEL_H = 26, PER_ROW = 6;
    const cols = Math.max(1, Math.min(values.length, PER_ROW));
    const frameW = PAD * 2 + cols * SZ + (cols - 1) * GAP;
    const parts = [title("Border radius")];
    values.forEach((v, i) => {
      const col = i % PER_ROW, row = Math.floor(i / PER_ROW);
      const x = PAD + col * (SZ + GAP);
      const y = PAD + TITLE_H + row * (SZ + LABEL_H + GAP);
      parts.push(`<rect x="${x}" y="${y}" width="${SZ}" height="${SZ}" rx="${Math.min(v, SZ / 2)}" fill="#EEF2FF" stroke="#6366F1" stroke-width="1.5"/>`);
      parts.push(`<text x="${x + SZ / 2}" y="${y + SZ + 18}" text-anchor="middle" font-family="${UI_FONT}" font-size="12" fill="${MUTED}">${esc(Math.round(v) + "px")}</text>`);
    });
    const rows = Math.ceil(values.length / PER_ROW);
    return { svg: frame(frameW, PAD * 2 + TITLE_H + rows * (SZ + LABEL_H + GAP) - GAP, parts.join("")), count: values.length };
  }
  function buildShadowsSvg(shadows) {
    shadows = (shadows || []).filter(Boolean);
    const PAD = 32, TITLE_H = 50, CARD_W = 200, CARD_H = 92, GAP_X = 40, GAP_Y = 64, PER_ROW = 3, LABEL_H = 18;
    const cols = Math.max(1, Math.min(shadows.length, PER_ROW));
    const frameW = PAD * 2 + cols * CARD_W + (cols - 1) * GAP_X;
    const defs = [];
    const parts = [title("Shadows")];
    shadows.forEach((css, i) => {
      const first = splitTop(css).find((p) => !/\binset\b/.test(p)) || splitTop(css)[0] || "";
      const nums = (first.match(/-?\d*\.?\d+(?=px)/g) || []).map(Number);
      const [dx = 0, dy = 2, blur = 4] = nums;
      const color = (first.match(/rgba?\([^)]*\)|#[0-9a-fA-F]{3,8}/) || ["rgba(0,0,0,0.25)"])[0];
      const col = i % PER_ROW, row = Math.floor(i / PER_ROW);
      const x = PAD + col * (CARD_W + GAP_X);
      const y = PAD + TITLE_H + row * (CARD_H + GAP_Y);
      defs.push(`<filter id="ctf-sh-${i}" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="${dx}" dy="${dy}" stdDeviation="${Math.max(blur / 2, 0.5)}" flood-color="${esc(color)}"/></filter>`);
      parts.push(`<rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H}" rx="12" fill="#FFFFFF" stroke="#F0F0F0" filter="url(#ctf-sh-${i})"/>`);
      let label = css.replace(/\s+/g, " ").trim();
      if (label.length > 34) label = label.slice(0, 33) + "\u2026";
      parts.push(`<text x="${x}" y="${y + CARD_H + 24}" font-family="${UI_FONT}" font-size="11" fill="${MUTED}">${esc(label)}</text>`);
    });
    const rows = Math.ceil(shadows.length / PER_ROW);
    const frameH = PAD * 2 + TITLE_H + rows * (CARD_H + GAP_Y) - GAP_Y + LABEL_H + 16;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${frameW}" height="${frameH}" viewBox="0 0 ${frameW} ${frameH}"><rect width="${frameW}" height="${frameH}" rx="16" fill="#FAFAFA"/><defs>${defs.join("")}</defs>${parts.join("")}</svg>`;
    return { svg, count: shadows.length };
  }
  function buildButtonsSvg(buttons) {
    buttons = (buttons || []).filter((b) => b && (b.bgColor || b.border));
    const PAD = 32, TITLE_H = 50, GAP = 26, META_W = 300;
    const parts = [title("Buttons")];
    let y = PAD + TITLE_H, maxBtnW = 0;
    const rows = [];
    for (const b of buttons) {
      const fs = num(b.fontSize, 14);
      const padParts = String(b.padding || "").match(/-?\d*\.?\d+(?=px)/g) || [];
      const pv = padParts.length ? num(padParts[0], 10) : 10;
      const ph = padParts.length > 1 ? num(padParts[1], 18) : padParts.length ? pv : 18;
      const text = String(b.text || "Button").slice(0, 28);
      const w = Math.max(90, Math.round(text.length * fs * 0.56 + ph * 2));
      const h = Math.max(34, Math.round(fs + pv * 2 + 2));
      const rx = Math.min(num(b.borderRadius, 6), h / 2);
      rows.push({ b, fs, text, w, h, rx });
      maxBtnW = Math.max(maxBtnW, w);
    }
    for (const { b, fs, text, w, h, rx } of rows) {
      const borderM = String(b.border || "").match(/(-?\d*\.?\d+)px[^#r]*(rgba?\([^)]*\)|#[0-9a-fA-F]{3,8})?/);
      const stroke = b.border && b.border !== "none" && borderM ? ` stroke="${esc(borderM[2] || "#D0D0D0")}" stroke-width="${num(borderM[1], 1)}"` : "";
      parts.push(`<rect x="${PAD}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${esc(b.bgColor || "transparent")}"${stroke}/>`);
      parts.push(`<text x="${PAD + w / 2}" y="${y + h / 2 + fs * 0.34}" text-anchor="middle" font-family="${UI_FONT}" font-size="${fs}" font-weight="${esc((b.fontWeight || 500) + "")}" fill="${esc(b.textColor || "#111111")}">${esc(text)}</text>`);
      const meta = [b.bgColor, b.textColor, b.borderRadius].filter(Boolean).join("  \xB7  ");
      parts.push(`<text x="${PAD + maxBtnW + 28}" y="${y + h / 2 + 4}" font-family="${UI_FONT}" font-size="11" fill="${MUTED}">${esc(meta)}</text>`);
      y += h + GAP;
    }
    return { svg: frame(PAD * 2 + maxBtnW + 28 + META_W, y - GAP + PAD, parts.join("")), count: rows.length };
  }
  function inlineIcon(svg, x, y, size) {
    let s = String(svg).replace(/<\?xml[\s\S]*?\?>/g, "").replace(/<!DOCTYPE[\s\S]*?>/gi, "").trim();
    const m = s.match(/<svg\b[^>]*>/i);
    if (!m) return "";
    let open = m[0].replace(/\s(?:x|y|width|height)="[^"]*"/gi, "");
    if (!/viewBox=/i.test(open)) {
      const w = m[0].match(/width="?([\d.]+)/i);
      const h = m[0].match(/height="?([\d.]+)/i);
      if (w && h) open = open.replace("<svg", `<svg viewBox="0 0 ${w[1]} ${h[1]}"`);
    }
    open = open.replace("<svg", `<svg x="${x}" y="${y}" width="${size}" height="${size}"`);
    return open + s.slice(m.index + m[0].length);
  }
  function buildIconsSvg(items) {
    items = (items || []).filter((it) => it && it.svg);
    const PAD = 32, CELL = 104, ICON = 56, LABEL_H = 24, GAP = 14, PER_ROW = 8, TITLE_H = 46;
    const cols = Math.max(1, Math.min(items.length, PER_ROW));
    const frameW = PAD * 2 + cols * CELL + (cols - 1) * GAP;
    const parts = [title(`Icons (${items.length})`)];
    let count = 0;
    items.forEach((it, i) => {
      const col = i % PER_ROW, row = Math.floor(i / PER_ROW);
      const x = PAD + col * (CELL + GAP);
      const y = PAD + TITLE_H + row * (CELL + LABEL_H + GAP);
      const inner = inlineIcon(it.svg, x + (CELL - ICON) / 2, y + (CELL - ICON) / 2 - 6, ICON);
      if (!inner) return;
      parts.push(`<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="12" fill="#F7F7F8"/>`);
      parts.push(inner);
      let label = String(it.name || "").trim();
      if (label.length > 14) label = label.slice(0, 13) + "\u2026";
      if (label) {
        parts.push(`<text x="${x + CELL / 2}" y="${y + CELL + 16}" text-anchor="middle" font-family="${UI_FONT}" font-size="11" fill="${MUTED}">${esc(label)}</text>`);
      }
      count += 1;
    });
    const rows = Math.ceil(items.length / PER_ROW);
    const frameH = PAD * 2 + TITLE_H + rows * (CELL + LABEL_H + GAP) - GAP;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${frameW}" height="${frameH}" viewBox="0 0 ${frameW} ${frameH}" color="${INK}" style="color:${INK}"><rect width="${frameW}" height="${frameH}" rx="16" fill="#FFFFFF"/>${parts.join("")}</svg>`;
    return { svg, count };
  }
  function stripBoard(svg) {
    const m = svg.match(/^<svg[^>]*\bwidth="([\d.]+)"[^>]*\bheight="([\d.]+)"[^>]*>\s*<rect[^>]*\/>([\s\S]*)<\/svg>$/);
    if (!m) return { w: 0, h: 0, inner: "" };
    return { w: parseFloat(m[1]), h: parseFloat(m[2]), inner: m[3] };
  }
  function buildStyleguideSvg({ colors, typography, fonts, spacing, radius, shadows, buttons, icons } = {}) {
    const boards = [];
    let count = 0;
    const add = (r, label = null) => {
      boards.push({ label, ...stripBoard(r.svg) });
      count += r.count;
    };
    if (colors && colors.length) add(buildColorsSvg(colors), "Color tokens");
    if (typography && typography.length) add(buildTypographySvg(typography));
    if (fonts && fonts.length) add(buildFontsSvg(fonts));
    if (spacing && spacing.length) add(buildSpacingSvg(spacing));
    if (radius && radius.length) add(buildRadiusSvg(radius));
    if (shadows && shadows.length) add(buildShadowsSvg(shadows));
    if (buttons && buttons.length) add(buildButtonsSvg(buttons));
    if (icons && icons.length) add(buildIconsSvg(icons));
    if (!boards.length) return { svg: "", count: 0 };
    const PAD = 32, GAP = 40, LABEL_H = 32;
    let y = PAD, maxW = 0;
    const parts = [];
    for (const b of boards) {
      if (b.label) {
        parts.push(`<text x="${PAD}" y="${y + 20}" font-family="${UI_FONT}" font-size="22" font-weight="700" fill="#111111">${esc(b.label)}</text>`);
        y += LABEL_H;
      }
      parts.push(`<g transform="translate(${PAD}, ${y})">${b.inner}</g>`);
      y += b.h + GAP;
      maxW = Math.max(maxW, b.w + PAD * 2);
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${maxW}" height="${y - GAP + PAD}" viewBox="0 0 ${maxW} ${y - GAP + PAD}" color="${INK}" style="color:${INK}"><rect width="${maxW}" height="${y - GAP + PAD}" fill="#F4F4F5"/>${parts.join("")}</svg>`;
    return { svg, count };
  }
  async function copySvg(build) {
    const { svg, count } = build;
    if (!count || !svg) return 0;
    await navigator.clipboard.writeText(svg);
    return count;
  }
  var copyColorsToClipboard = (groups) => copySvg(buildColorsSvg(groups));
  var copyTypographyToClipboard = (styles) => copySvg(buildTypographySvg(styles));
  var copyIconsToClipboard = (items) => copySvg(buildIconsSvg(items));
  var copyStyleguideToClipboard = (sections) => copySvg(buildStyleguideSvg(sections));
  return __toCommonJS(index_exports);
})();
