export default async function decorate(block) {
    const container = block.firstElementChild;
    const nav = document.createElement('nav');
    nav.appendChild(container.querySelector('ul'));
    container.replaceWith(nav);
    const [currentPath] = window.location.pathname.split('.');
    const currentLink = block.querySelector(`a[href='${currentPath}']`);
    if (currentLink) currentLink.classList.add('active');
}