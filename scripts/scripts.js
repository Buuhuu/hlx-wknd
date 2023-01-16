import {
  sampleRUM,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  decorateBlock,
  loadHeader,
  loadFooter,
} from './lib-franklin.js';

const LCP_BLOCKS = ['carousel', 'teaser']; // add your LCP blocks to the list
export const NO_SCRIPT_BLOCKS = ['separator', 'breadcrumb', 'grid-cell'];
export const NO_STYLE_BLOCKS = ['grid-cell'];
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // remove last section if empty
    const lastSection = [...main.children].pop();
    if (!lastSection.children.length) lastSection.remove();
    // move header block into <header> and footer into <footer>
    Object.entries({
      ':scope > div:first-child > div': 'header',
      ':scope > div:last-child > div': 'footer'
    }).forEach(([from, to]) => {
      const block = main.querySelector(from);
      if (block && block.className === to) {
        if (!block.nextElementSibling) block.parentElement.remove();
        document.querySelector(to).appendChild(block);
        decorateBlock(block);
      }
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Merge consecurtive -wrappers into a single one if the content are grid cells
 * @param {*} main 
 */
export function decorateGrid(main) {
  const gridCellPattern = /(offset|width)-(default|tablet|phone)+-(\d+)/;
  let lastWrapper = null;
  // inside sections
  main.querySelectorAll(':scope > .section > div').forEach((wrapper) => {
    const defaultContent = wrapper.matches('.default-content-wrapper');
    const gridCell = !defaultContent && [...wrapper.firstElementChild.classList].find(cls => cls.match(gridCellPattern));
    if (gridCell) {
      if (lastWrapper == null) {
        // new grid
        lastWrapper = wrapper
        lastWrapper.className = 'grid-wrapper';
      } else {
        lastWrapper.appendChild(wrapper.firstElementChild);
        wrapper.remove();
      }
    } else {
      lastWrapper = null;
    }
  });
  // for sections create a new intermediate wrapper to apply the grid styles to
  lastWrapper = null;
  main.querySelectorAll(':scope > .section').forEach((section) => {
    const nonGridClassees = [...section.classList].filter(cls => !cls.match(gridCellPattern));
    const isGridCell = nonGridClassees.length !== section.classList.length;
    if (isGridCell) {
      if (lastWrapper == null) {
        const newSection = document.createElement('div');
        newSection.className = nonGridClassees.join(' ');
        newSection.setAttribute('data-section-status', 'initialized');
        lastWrapper = document.createElement('div');
        lastWrapper.className = `grid-wrapper`;
        newSection.appendChild(lastWrapper);
        section.insertAdjacentElement('beforebegin', newSection);
      }
      nonGridClassees.forEach((cls) => section.classList.remove(cls));
      delete section.dataset.sectionStatus;
      lastWrapper.appendChild(section);
    } else {
      lastWrapper = null;
    }
  });
  // make offsets absolute
  main.querySelectorAll(':scope .grid-wrapper').forEach((grid) => {
    let offsets = { default: 0, phone: 0, tablet: 0 };
    [...grid.children].forEach((cell) => [...cell.classList].forEach((cls) => {
      const [, type, breakpoint, width] = cls.match(gridCellPattern) || [];
      offsets[breakpoint] += parseInt(width);
      if (type === 'offset') {
        cell.classList.remove(cls);
        cell.classList.add(`offset-${breakpoint}-${offsets[breakpoint] % 12}`);
      }
    }));
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateGrid(main);
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  document.body.classList.add('anonymous');
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  await loadBlocks(main, NO_STYLE_BLOCKS, NO_SCRIPT_BLOCKS);

  const { hash } = window.location;
  const element = hash ? main.querySelector(hash) : false;
  if (hash && element) element.scrollIntoView();


  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadCSS('https://fonts.googleapis.com/css2?family=Asar&family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap');
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.svg`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
