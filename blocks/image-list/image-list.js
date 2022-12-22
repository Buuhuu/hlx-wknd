export default async function decorate(block) {
    const [th, ...children] = [...block.children];
    const idx = [...th.children]
        .map(child => child.innerText.trim())
        .reduce((left, right, i) => ({ ...left, [right]: i }), {});
    const ul = document.createElement('ul');    
    children.forEach((child) => {
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