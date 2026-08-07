// Smoke test: every builder produces well-formed SVG with no NaN/undefined
// coordinates, and the composed styleguide includes all sections.
import {
    buildColorsSvg, buildTypographySvg, buildFontsSvg, buildSpacingSvg,
    buildRadiusSvg, buildShadowsSvg, buildButtonsSvg, buildIconsSvg,
    buildStyleguideSvg,
} from '../src/index.js';

let failed = 0;
const check = (name, { svg, count }, minCount = 1) => {
    const bad = /NaN|undefined/.test(svg);
    const wellFormed = svg.startsWith('<svg') && svg.endsWith('</svg>');
    const ok = !bad && wellFormed && count >= minCount;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${name} (count=${count}, len=${svg.length})`);
    if (!ok) failed += 1;
};

const icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>';

check('colors', buildColorsSvg([{ label: 'Brand', items: [{ hex: '#6366F1', label: 'primary' }, { hex: '#111' }] }]));
check('typography', buildTypographySvg([{ tag: 'H1', family: 'Inter', size: '48px', weight: '700', sample: 'Hello' }]));
check('fonts', buildFontsSvg([{ family: 'Inter', note: 'variable' }]));
check('spacing', buildSpacingSvg([{ label: 'md', px: 16 }]));
check('radius', buildRadiusSvg([4, 8, 9999]));
check('shadows', buildShadowsSvg(['0 1px 2px rgba(0,0,0,.2), 0 8px 24px rgba(0,0,0,.1)', 'inset 0 1px 0 #fff']));
check('buttons', buildButtonsSvg([{ text: 'Go', bgColor: '#111', textColor: '#fff', borderRadius: '8px', fontSize: '14px', padding: '8px 16px' }]));
check('icons', buildIconsSvg([{ name: 'dot', svg: icon }]));
check('styleguide', buildStyleguideSvg({
    colors: [{ label: 'Brand', items: [{ hex: '#6366F1' }] }],
    typography: [{ tag: 'H1', family: 'Inter', size: '32px' }],
    fonts: [{ family: 'Inter' }],
    spacing: [{ label: 'md', px: 16 }],
    radius: [8],
    shadows: ['0 2px 8px rgba(0,0,0,.2)'],
    buttons: [{ text: 'Go', bgColor: '#111' }],
    icons: [{ name: 'dot', svg: icon }],
}), 8);
const empty = buildStyleguideSvg({});
const emptyOk = empty.count === 0 && empty.svg === '';
console.log(`${emptyOk ? 'ok  ' : 'FAIL'} empty styleguide returns nothing`);
if (!emptyOk) failed += 1;

process.exit(failed ? 1 : 0);
