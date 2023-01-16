export default async function decorate(block) {
    const container = block.firstElementChild;
    const nav = document.createElement('nav');
    nav.appendChild(container.querySelector('ul'));
    container.replaceWith(nav);
    const [currentPath] = window.location.pathname.split('.');
    block.querySelectorAll('a').forEach((link) => {
        const { pathname } = new URL(link);
        if (currentPath === pathname || currentPath.startsWith(pathname)) link.classList.add('active')
    });
}