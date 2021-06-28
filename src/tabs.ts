const tabs = document.querySelectorAll(".tab-bar__tab[data-target]");
const contents = document.querySelectorAll(".content-tab[data-content]");

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        contents.forEach(c => c.classList.remove(".d-block"));
        tabs.forEach(t => t.classList.remove("tab-bar__tab--current"));

        tab.classList.add("tab-bar__tab--current");
        const content = document.querySelector((<HTMLElement> tab).dataset.target);
        content.classList.add(".d-block");
    });
});