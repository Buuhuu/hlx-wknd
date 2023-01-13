const keys = [ 'image', 'pretitle', 'title', 'description', 'cta' ];

export default async function decorate(block) {
    if (block.matches('.hero-image-bottom,.hero-image-top')) block.classList.add('hero');
    const contentEl = document.createElement('div');
    contentEl.classList.add('content');
    [...block.children].forEach((child, i) => {
        const content = child.firstElementChild;
        content.classList.add(keys[i]);
        if (i > 0) {
            contentEl.appendChild(content);
        } else {
            block.appendChild(content);
        }
        child.remove();
    });
    block.appendChild(contentEl);
}