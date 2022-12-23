function toggleNavigation(toggle, nav) {
    if (toggle.matches('.open')) {
        // close
        toggle.classList.remove('open');
    } else {
        // open
        toggle.classList.add('open');
    }

}

export default async function decorate(block) {
    const container = block.firstElementChild;
    const ul = container.querySelector('ul');
    
    const nav = document.createElement('nav');
    nav.appendChild(ul);

    const [, country, language] = window.location.href.match('\/([^/]{2})\/([^/]{2})([/.]|$)')
    const toggle = document.createElement('a');
    toggle.classList.add(`countrycode-${country}`);
    toggle.ariaLabel = 'toggle language';
    toggle.href = '#';
    toggle.innerHTML = `${language}-${country}`;
    toggle.addEventListener('click', () => toggleNavigation(toggle, nav))

    container.replaceWith(toggle);  
    block.appendChild(nav);
}
