import { ExtensionData } from "./ExtensionData";
import { ControlData, PickListControl } from "./PickListControl";

export class ControlsManager {

    private static keyExtensionData = "linked-picklist.control-values";

    public static async getAllControls(pat :string) :Promise<Array<PickListControl>> {
        const controls = new Array<PickListControl>();

        const orgName = VSS.getWebContext().collection.name;
        
        await ExtensionData.getValue(orgName, pat, this.keyExtensionData, 'User').then((result) => {
            if (result != undefined) {
                const controlsData :Array<ControlData> = result;
                controlsData.forEach((control) => controls.push(PickListControl.createFromObject(control)));
            }
        }).catch(error => {
            console.log("getAllControls");
            console.log(error);
            throw new Error("Network error trying to retrieve the resource. It is possible that the 'PAT' is invalid.");
        });

        return controls;
    }

    public static async getControl(controlName :string, pat :string) :Promise<PickListControl> {
        let control :PickListControl = undefined;
        const orgName = VSS.getWebContext().collection.name;
        
        await ExtensionData.getValue(orgName, pat, this.keyExtensionData, 'User').then((result) => {
            if (result != undefined) {
                const controlsData :Array<ControlData> = result;
                const controlData :ControlData = controlsData.find(c => c.controlName == controlName);

                if (controlData != undefined) 
                    control = PickListControl.createFromObject(controlData);
            }
        }).catch(error => {
            console.log("getControl");
            console.log(error);
            throw new Error("Network error trying to retrieve the resource. It is possible that the 'PAT' is invalid.");
        });

        return control;
    }

}