export default async function decorate(block) {
    const input = document.createElement('input');
    input.placeholder = 'Search'.toUpperCase();

    block.firstElementChild.replaceWith(input);
}