const keys = ['image', 'title', 'description'];

export default async function decorate(block) {
    const ul = document.createElement('ul');    
    [...block.children].forEach((child) => {
        const li = document.createElement('li');
        keys.forEach((cls) => {
            const el = child.children[0];
            if (el) {
                el.classList.add(cls);
                if (el.matches('.button-container')) {
                    el.classList.remove('button-container');
                    el.querySelector('a').classList.remove('button', 'primary', 'secondary');
                }
                li.appendChild(el);
            }
        });
        const a = li.querySelector('a');
        const picture = li.querySelector('picture');
        if (a && picture) {
            const clone = a.cloneNode();
            const parent = picture.parentElement;
            clone.appendChild(picture);
            parent.appendChild(clone);
        }
        ul.appendChild(li);
    });
    block.textContent = null;
    block.appendChild(ul);
}