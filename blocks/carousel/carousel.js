import { loadCSS } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
    const additionalStyles = [
        new Promise((r) => loadCSS(`${window.hlx.codeBasePath}/blocks/teaser/teaser.css`, r))
    ];
    const th = block.firstElementChild;
    th.remove();
    const idx = [...th.children]
        .map(child => child.innerText.trim())
        .reduce((left, right, i) => ({ ...left, [right]: i }), {});
    [...block.children].forEach((slide, index) => {
        slide.classList.add('carousel-slide');

        if (index === 0) slide.classList.add('active');

        if (slide.children[idx.styles]) {
            slide.className += ` ${slide.children[idx.styles].innerText.trim()}`;
            slide.children[idx.styles].remove();
        }

        if (slide.children[idx.image]) slide.children[idx.image].classList.add('image');

        const contentEl = document.createElement('div');
        contentEl.classList.add('content');
        ['title', 'description', 'cta']
            .map((cls) => {
                var el = slide.children[idx[cls]];
                if (el) el.classList.add(cls);
                return el;
            }).forEach((el) => el && contentEl.appendChild(el));
        slide.append(contentEl);
    });

    await Promise.all(additionalStyles);
}
