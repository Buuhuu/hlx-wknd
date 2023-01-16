import { readBlockConfig, decorateSections, decorateBlocks, loadBlocks } from '../../scripts/lib-franklin.js';
import { decorateGrid, NO_SCRIPT_BLOCKS, NO_STYLE_BLOCKS } from '../../scripts/scripts.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    block.innerHTML = html;

    decorateSections(block);
    decorateBlocks(block);
    decorateGrid(block);
    await loadBlocks(block, NO_STYLE_BLOCKS, NO_SCRIPT_BLOCKS);
  }
}
