import { WorkItemTrackingProcessTemplateHttpClient } from "TFS/WorkItemTracking/ProcessTemplateRestClient";
import { WorkItemTrackingHttpClient } from "TFS/WorkItemTracking/RestClient";
import { WorkItemFormService } from "TFS/WorkItemTracking/Services";
import { ControlsManager } from "./ControlsManager";
import { Model } from "./Model";
import { PickListControl } from "./PickListControl";
import { View } from "./View";

export class Controller {

    private editeList :string = "false";
    private controlName :string;
    private fieldNames :Array<string> = new Array<string>();
    private refFieldNames :Array<string> = new Array<string>();
    private refSummarizeToPath :string = "";
    private viewOption :string = "";

    private model :Model;
    private view :View;

    constructor() {
        this.init();
    }

    private async init() {

        const inputs = VSS.getConfiguration().witInputs;
        
        this.editeList = inputs["CanEdit"];
        this.controlName = inputs["ControlName"];
        this.refSummarizeToPath = inputs["SummarizeToPath"];
        this.viewOption = inputs["ViewOption"];
        
        const cantConfiguredFields = Object.keys(inputs).filter(key => key.includes("Field")).length;
        for (let i = 0; i < cantConfiguredFields; i++) {
            if (inputs["Field" + (i+1)])
                this.refFieldNames[i] = inputs["Field" + (i+1)];
            else break;
        }
        
        const fieldsToGet = Array.from(this.refFieldNames);
        fieldsToGet.push(this.editeList);
        fieldsToGet.push(this.refSummarizeToPath);

        const service = await WorkItemFormService.getService();
        let fields = await service.getFieldValues(fieldsToGet);

        let refFieldValues :Array<string> = new Array<string>();
        
        for (const fieldName of this.refFieldNames) {
            const f = fields[fieldName] ? fields[fieldName].toString() : ""
            refFieldValues.push(f);
        }

        const summarizeToPath = fields[this.refSummarizeToPath] ? fields[this.refSummarizeToPath].toString() : "";

        const pat = inputs["PAT"];
        await ControlsManager.getControl(this.controlName, pat).then(async control => {
            if (control == undefined)
                control = new PickListControl(this.controlName);
            

            this.model = new Model();
            await this.model.init(control, this.viewOption,
                this.fieldNames, this.refFieldNames, refFieldValues,
                this.refSummarizeToPath, summarizeToPath);
        
            console.log(this.model.toString());
            
            this.view = new View(this.model.fieldNames);

            const selects = this.view.getSelects();
            for (let i = 0; i < selects.length; i++)
                selects[i].addEventListener('change', () => this.updateValues(i+1));
            
            if (this.model.fieldValuesList == undefined)
                this.view.showErrorMessage('There is no data loaded to fill in the fields.');
            else 
                this.setLastSavedValues();
        })
        .catch(error => {
            this.view = new View([]);
            this.view.showErrorMessage(error.message);
        });
    }

    private setLastSavedValues() :void {
        if (this.model.fieldValues[0] != '') {
            for (let idSelect = 1; idSelect <= this.model.fieldNames.length; idSelect++) {
                this.fillSelect(idSelect);
                const lastValue :string = this.model.fieldValues[idSelect-1];
                this.view.setSelectValue(idSelect, lastValue);
            }
        }
        else {
            this.fillSelect(1);
            this.view.setSelectValue(1, '');
        }
    }

    private fillSelect(idSelect :number) :void {
        if (idSelect == 1) {
            let values :Array<string> = this.model.fieldValuesList
            .map(v => v[idSelect-1])
            .sort();

            values = this.removeDuplicates(values);

            this.view.fillSelect(idSelect, values);
        }
        else {
            const dependentValues :Array<string> = this.model.fieldValues.slice(0, idSelect-1);

            let values = this.model.fieldValuesList.filter(v => {
                let matchDependentValues = true;
                for (let i = 0; i < dependentValues.length; i++)
                    if (dependentValues[i] != v[i]) 
                        matchDependentValues = false;
                return matchDependentValues;
            })
            .map(v => v[idSelect-1])
            .sort();

            values = this.removeDuplicates(values);

            this.view.fillSelect(idSelect, values);
        }
    }

    private removeDuplicates(values :Array<string>) :Array<string> {
        return values.filter((n, i) => values.indexOf(n) === i);
    }

    private updateValues(idSelect :number) :void {
        this.model.fieldValues[idSelect-1] = this.view.getSelectValue(idSelect);

        if (idSelect < this.model.fieldNames.length) {
            const idNextSelect :number = idSelect + 1;

            //Clear selects 
            for (let idSelect = idNextSelect; idSelect <= this.model.fieldNames.length; idSelect++) {
                this.view.clearSelect(idSelect);
                this.model.fieldValues[idSelect-1] = '';
            }

            this.fillSelect(idNextSelect);
            this.view.setSelectValue(idNextSelect, '');

            if(this.view.getOptions(idNextSelect).includes(''))
                if (idNextSelect+1 < this.model.fieldNames.length)
                    this.updateValues(idNextSelect+1);
            
        }

        this.model.summarizeToPath = this.model.fieldValues.filter(v => v != '').join('\\');
        this.updateWorkItem();
    }

    private async updateWorkItem() :Promise<void> {
        const service = await WorkItemFormService.getService();
        for (let i = 0; i < this.model.fieldNames.length; i++)
            service.setFieldValue(this.model.fieldRefNames[i], this.model.fieldValues[i]);
        service.setFieldValue(this.model.summarizeToPathRefName, this.model.summarizeToPath);
    }

}