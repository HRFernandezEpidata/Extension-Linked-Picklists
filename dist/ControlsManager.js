var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./ExtensionData", "./PickListControl"], function (require, exports, ExtensionData_1, PickListControl_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ControlsManager = void 0;
    class ControlsManager {
        static getAllControls(pat) {
            return __awaiter(this, void 0, void 0, function* () {
                const controls = new Array();
                const orgName = VSS.getWebContext().collection.name;
                yield ExtensionData_1.ExtensionData.getValue(orgName, pat, this.keyExtensionData, 'User').then((result) => {
                    if (result != undefined) {
                        const controlsData = result;
                        controlsData.forEach((control) => controls.push(PickListControl_1.PickListControl.createFromObject(control)));
                    }
                }).catch(error => {
                    throw new Error("Network error trying to retrieve the resource. It is possible that the 'PAT' is invalid.");
                });
                return controls;
            });
        }
        static getControl(controlName, pat) {
            return __awaiter(this, void 0, void 0, function* () {
                let control = undefined;
                const orgName = VSS.getWebContext().collection.name;
                yield ExtensionData_1.ExtensionData.getValue(orgName, pat, this.keyExtensionData, 'User').then((result) => {
                    if (result != undefined) {
                        const controlsData = result;
                        const controlData = controlsData.find(c => c.controlName == controlName);
                        if (controlData != undefined)
                            control = PickListControl_1.PickListControl.createFromObject(controlData);
                    }
                }).catch(error => {
                    throw new Error("Network error trying to retrieve the resource. It is possible that the 'PAT' is invalid.");
                });
                return control;
            });
        }
    }
    exports.ControlsManager = ControlsManager;
    ControlsManager.keyExtensionData = "linked-picklist.control-values";
});
