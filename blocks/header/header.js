import { readBlockConfig, decorateBlocks, decorateSections, loadBlocks, buildBlock } from '../../scripts/lib-franklin.js';
import { NO_SCRIPT_BLOCKS, NO_STYLE_BLOCKS } from '../../scripts/scripts.js';

function toggleScrolly(block) {
  if (window.pageYOffset > 25) {
    block.classList.add('scrolly');
  } else {
    block.classList.remove('scrolly');
  }
}

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch nav content
  const navPath = cfg.nav || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    
    // initialise sticky header
    toggleScrolly(block);

    // decorate nav DOM
    block.innerHTML = html;
    
    const searchBlock = buildBlock('search', '');
    searchBlock.classList.add('header');
    block.querySelector('.navigation').insertAdjacentElement('afterend', searchBlock);

    decorateSections(block);
    decorateBlocks(block);
    await loadBlocks(block, NO_STYLE_BLOCKS, NO_SCRIPT_BLOCKS);

    document.addEventListener('scroll', () => toggleScrolly(block), { capture: false, passive: true });
  }
}
