import { WorkItemFormService } from 'TFS/WorkItemTracking/Services';
import { Model } from './Model';

export class View {

    private body :HTMLElement;
    private msjArea :HTMLElement;
    private selects :Array<HTMLSelectElement>;

    constructor(selectNames :Array<string>) {
        this.body = document.querySelector('body');
        this.createMessageArea();
        if (selectNames.length > 0)
            this.createSelects(selectNames, 1);
    }

    private createMessageArea() :void {
        this.msjArea = document.createElement('div');
        this.msjArea.classList.add('msj-area');
        this.body.appendChild(this.msjArea);
    }

    private createSelects(selectNames :Array<string>, viewOption: number) :void {
        this.selects = new Array<HTMLSelectElement>();
        
        const container = document.createElement('div');
        for (let i = 0; i < selectNames.length; i++) {
            const label = document.createElement('label');
            label.textContent = selectNames[i];
            label.classList.add('labelPicklist');

            const newSelect = document.createElement('select');
            newSelect.classList.add('myPicklist');
            newSelect.setAttribute('id', (i+1)+'');
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

    public fillSelect(idSelect :number, values :Array<string>) :void {
        const select :HTMLSelectElement = this.selects[idSelect-1];
        values.forEach(value => select.append(new Option(value)))
    }

    public clearSelect(idSelect :number) :void {
        const select :HTMLSelectElement = this.selects[idSelect-1];
        while (select.options.length > 0)
            select.remove(0);
        select.value = '';
    }

    public setSelectValue(idSelect, value) :void {
        const select :HTMLSelectElement = this.selects[idSelect-1];
        select.value = value;
    }

    public getSelectValue(idSelect :number) :string {
        const select :HTMLSelectElement = this.selects[idSelect-1];
        return select.value;
    }

    public showSuccessMessage(msj :string) :void {
        this.msjArea.textContent = msj;
        this.msjArea.classList.remove('msj-area--error');
        this.msjArea.classList.add('msj-area--success');
    }

    public showErrorMessage(msj :string) :void {
        this.msjArea.textContent = msj;
        this.msjArea.classList.remove('msj-area--success');
        this.msjArea.classList.add('msj-area--error');
    }

    public hideMessage() :void {
        this.msjArea.classList.remove('msj-area--error');
        this.msjArea.classList.remove('msj-area--success');
        this.msjArea.textContent = '';
    }

    public getSelects() :Array<HTMLSelectElement> {
        return this.selects;
    }

}