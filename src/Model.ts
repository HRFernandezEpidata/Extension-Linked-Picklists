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

    constructor(control :PickListControl, viewOption: string,
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

        this.fieldValuesList = valuesControl;

        this.fieldNames = this.fieldValuesList.shift().slice(0, fieldRefNames.length);
        this.fieldValues = fieldValues;
        this.fieldRefNames = fieldRefNames;

        // this.fieldNames.push(fieldNames[0]);
        // this.fieldValues.push(fieldValues[0]);
        // this.fieldRefNames.push(fieldRefNames[0]);

        // this.fieldNames.push(fieldNames[1]);
        // this.fieldValues.push(fieldValues[1]);
        // this.fieldRefNames.push(fieldRefNames[1]);
        // this.summarizeToPath = fieldValues[0] + '\\' + fieldValues[1];

        // for (let i = 2; i < fieldNames.length; i++) {
        //     if (fieldNames[i] != null && fieldNames[i] != undefined && fieldValues[i] != null && fieldValues[i] != undefined) {
        //         if (fieldValues[i] != "")
        //             this.summarizeToPath += '\\' + fieldValues[i];

        //         this.fieldNames.push(fieldNames[i]);
        //         this.fieldValues.push(fieldValues[i]);
        //         this.fieldRefNames.push(fieldRefNames[i]);
        //     }
        //     else
        //         break;
        // }

    }
    
    public toString() {
        console.log(this.fieldNames);
        console.log(this.fieldRefNames);
        console.log(this.fieldValues);
        console.log(this.fieldValuesList)
    }
}