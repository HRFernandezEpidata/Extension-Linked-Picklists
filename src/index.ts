import { Controller } from "./Controller";
import { IWorkItemLoadedArgs } from "TFS/WorkItemTracking/ExtensionContracts";

var controller: Controller;

var provider = () => {
    return {
        onLoaded: (workItemLoadedArgs: IWorkItemLoadedArgs) => {
            controller = new Controller();
        },
    };
};

VSS.register(VSS.getContribution().id, provider);