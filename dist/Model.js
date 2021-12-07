var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "TFS/WorkItemTracking/Services"], function (require, exports, Services_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = void 0;
    class Model {
        constructor() {
            this.fieldValuesList = new Array();
        }
        init(control, viewOption, fieldNames, fieldRefNames, fieldValues, summarizeToPathRefName, summarizeToPath) {
            return __awaiter(this, void 0, void 0, function* () {
                this.summarizeToPathRefName = summarizeToPathRefName;
                this.summarizeToPath = summarizeToPath;
                this.viewOption = viewOption != undefined ? viewOption : "1";
                this.control = control;
                const currentProjectName = VSS.getWebContext().project.name;
                let valuesControl = undefined;
                const valuesProject = this.control.getValuesProjects()
                    .find(vp => vp.getProjectName() == currentProjectName);
                if (valuesProject != undefined) {
                    valuesControl = valuesProject.getValues();
                }
                else {
                    const valuesCollection = this.control.getValuesOrganization();
                    if (valuesCollection != undefined)
                        valuesControl = valuesCollection.getValues();
                }
                const service = yield Services_1.WorkItemFormService.getService();
                this.fieldValuesList = valuesControl;
                if (this.fieldValuesList == undefined) {
                    this.fieldValuesList = [];
                    this.fieldValuesList[0] = [];
                    const fields = yield service.getFields();
                    fieldRefNames.forEach(fieldRefName => {
                        this.fieldValuesList[0].push(fields.find(f => f.referenceName === fieldRefName).name);
                    });
                }
                this.fieldNames = this.fieldValuesList.shift().slice(0, fieldRefNames.length);
                this.fieldValues = fieldValues;
                this.fieldRefNames = fieldRefNames;
            });
        }
        toString() {
            console.log(this.fieldNames);
            console.log(this.fieldRefNames);
            console.log(this.fieldValues);
            console.log(this.fieldValuesList);
        }
    }
    exports.Model = Model;
});
