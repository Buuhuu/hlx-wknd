export default async function decorate(block) {
    const contentEl = document.createElement('div');
    contentEl.classList.add('content');
    [...block.children].forEach((child) => {
        const [left, right] = child.children;
        const type = left.innerText.trim();
        right.classList.add(type);
        if (type !== 'image') {
            contentEl.appendChild(right);
        } else {
            block.appendChild(right);
        }
        child.remove();
    });
    block.appendChild(contentEl);
}