const idx = { image: 0, pretitle: 1, title: 2, description: 3, cta: 4, styles: 5 };

export default async function decorate(block) {
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
}
