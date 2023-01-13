const idx = { image: 0, title: 1, description: 2 };

export default async function decorate(block) {
    const ul = document.createElement('ul');    
    [...block.children].forEach((child) => {
        const li = document.createElement('li');
        ['image', 'title', 'description'].forEach((cls) => {
            const el = child.children[idx.image];
            if (el) {
                el.classList.add(cls);
                if (el.matches('.button-container')) {
                    el.classList.remove('button-container');
                    el.querySelector('a').classList.remove('button', 'primary', 'secondary');
                }
                li.appendChild(el);
            }
        });
        ul.appendChild(li);
    });
    block.textContent = null;
    block.appendChild(ul);
}