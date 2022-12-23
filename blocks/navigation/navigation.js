export default async function decorate(block) {
    const container = block.firstElementChild;
    const nav = document.createElement('nav');
    nav.appendChild(container.querySelector('ul'));
    container.replaceWith(nav);
}