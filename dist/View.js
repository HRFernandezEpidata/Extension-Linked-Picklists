define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.View = void 0;
    class View {
        constructor(selectNames) {
            this.body = document.querySelector('body');
            this.createMessageArea();
            if (selectNames.length > 0)
                this.createSelects(selectNames, 1);
        }
        createMessageArea() {
            this.msjArea = document.createElement('div');
            this.msjArea.classList.add('msj-area');
            this.body.appendChild(this.msjArea);
        }
        createSelects(selectNames, viewOption) {
            this.selects = new Array();
            const container = document.createElement('div');
            for (let i = 0; i < selectNames.length; i++) {
                const label = document.createElement('label');
                label.textContent = selectNames[i];
                label.classList.add('labelPicklist');
                const newSelect = document.createElement('select');
                newSelect.classList.add('myPicklist');
                newSelect.setAttribute('id', (i + 1) + '');
                this.selects.push(newSelect);
                const div = document.createElement('div');
                div.appendChild(label);
                div.appendChild(newSelect);
                div.classList.add('divSelect');
                div.style.width = (100 / viewOption).toString() + '%';
                div.classList.add('selectedDiv');
                container.appendChild(div);
            }
            this.body.appendChild(container);
            VSS.resize();
        }
        fillSelect(idSelect, values) {
            const select = this.selects[idSelect - 1];
            values.forEach(value => select.append(new Option(value)));
        }
        clearSelect(idSelect) {
            const select = this.selects[idSelect - 1];
            while (select.options.length > 0)
                select.remove(0);
            select.value = '';
        }
        setSelectValue(idSelect, value) {
            const select = this.selects[idSelect - 1];
            select.value = value;
        }
        getSelectValue(idSelect) {
            const select = this.selects[idSelect - 1];
            return select.value;
        }
        showSuccessMessage(msj) {
            this.msjArea.textContent = msj;
            this.msjArea.classList.remove('msj-area--error');
            this.msjArea.classList.add('msj-area--success');
        }
        showErrorMessage(msj) {
            this.msjArea.textContent = msj;
            this.msjArea.classList.remove('msj-area--success');
            this.msjArea.classList.add('msj-area--error');
        }
        hideMessage() {
            this.msjArea.classList.remove('msj-area--error');
            this.msjArea.classList.remove('msj-area--success');
            this.msjArea.textContent = '';
        }
        getSelects() {
            return this.selects;
        }
        getOptions(idSelect) {
            const select = this.selects[idSelect - 1];
            const options = [];
            for (var i = 0, n = select.options.length; i < n; i++)
                options.push(select.options[i].value);
            return options;
        }
    }
    exports.View = View;
});
