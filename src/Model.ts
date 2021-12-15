import { WorkItemFormService } from "TFS/WorkItemTracking/Services";
import { PickListControl, PickListValuesProject } from "./PickListControl";

export class Model {

    public control: PickListControl;
    public fieldNames: Array<string>;
    public fieldValues: Array<string>;
    public fieldRefNames: Array<string>;
    public summarizeToPath: string;
    public summarizeToPathRefName: string;
    public viewOption: string;
    public fieldValuesList: Array<Array<string>> = new Array<Array<string>>();

    constructor() {   
    }

    public async init(control :PickListControl, viewOption: string,
        fieldNames :Array<string>, fieldRefNames :Array<string>, fieldValues :Array<string>,
        summarizeToPathRefName: string, summarizeToPath: string) {

        this.summarizeToPathRefName = summarizeToPathRefName;
            this.summarizeToPath = summarizeToPath;
            this.viewOption = viewOption != undefined ? viewOption : "1"; 
            this.control = control;
    
            const currentProjectName = VSS.getWebContext().project.name;
            let valuesControl :Array<Array<string>> = undefined;
            const valuesProject :PickListValuesProject = this.control.getValuesProjects()
                .find(vp => vp.getProjectName() == currentProjectName); 
    
            if (valuesProject != undefined) {
                valuesControl = valuesProject.getValues();
            }
            else { 
                const valuesCollection = this.control.getValuesOrganization()
                if (valuesCollection != undefined)
                    valuesControl = valuesCollection.getValues();
            }
            const service = await WorkItemFormService.getService();
            this.fieldValuesList = valuesControl;

            if (this.fieldValuesList == undefined)
                this.fieldValuesList = [];

            this.fieldNames = [];
            const fields = await service.getFields();
                fieldRefNames.forEach(fieldRefName => {
                    this.fieldNames.push(
                        fields.find(f => f.referenceName === fieldRefName).name
                    );
                });
    
            this.fieldValues = fieldValues;
            this.fieldRefNames = fieldRefNames;
    }
    
    public toString() {
        console.log(this.fieldNames);
        console.log(this.fieldRefNames);
        console.log(this.fieldValues);
        console.log(this.fieldValuesList)
    }
}