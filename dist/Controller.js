var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "TFS/WorkItemTracking/Services", "./ControlsManager", "./Model", "./PickListControl", "./View"], function (require, exports, Services_1, ControlsManager_1, Model_1, PickListControl_1, View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    class Controller {
        constructor() {
            this.editeList = "false";
            this.fieldNames = new Array();
            this.refFieldNames = new Array();
            this.refSummarizeToPath = "";
            this.viewOption = "";
            this.init();
        }
        init() {
            return __awaiter(this, void 0, void 0, function* () {
                const inputs = VSS.getConfiguration().witInputs;
                this.editeList = inputs["CanEdit"];
                this.controlName = inputs["ControlName"];
                this.refSummarizeToPath = inputs["SummarizeToPath"];
                this.viewOption = inputs["ViewOption"];
                const cantConfiguredFields = Object.keys(inputs).filter(key => key.includes("Field")).length;
                for (let i = 0; i < cantConfiguredFields; i++) {
                    if (inputs["Field" + (i + 1)])
                        this.refFieldNames[i] = inputs["Field" + (i + 1)];
                    else
                        break;
                }
                const fieldsToGet = Array.from(this.refFieldNames);
                fieldsToGet.push(this.editeList);
                fieldsToGet.push(this.refSummarizeToPath);
                const service = yield Services_1.WorkItemFormService.getService();
                let fields = yield service.getFieldValues(fieldsToGet);
                let refFieldValues = new Array();
                for (const fieldName of this.refFieldNames) {
                    const f = fields[fieldName] ? fields[fieldName].toString() : "";
                    refFieldValues.push(f);
                }
                const summarizeToPath = fields[this.refSummarizeToPath] ? fields[this.refSummarizeToPath].toString() : "";
                const pat = inputs["PAT"];
                yield ControlsManager_1.ControlsManager.getControl(this.controlName, pat).then((control) => __awaiter(this, void 0, void 0, function* () {
                    if (control == undefined)
                        control = new PickListControl_1.PickListControl(this.controlName);
                    this.model = new Model_1.Model();
                    yield this.model.init(control, this.viewOption, this.fieldNames, this.refFieldNames, refFieldValues, this.refSummarizeToPath, summarizeToPath);
                    console.log(this.model.toString());
                    this.view = new View_1.View(this.model.fieldNames);
                    const selects = this.view.getSelects();
                    for (let i = 0; i < selects.length; i++)
                        selects[i].addEventListener('change', () => this.updateValues(i + 1));
                    if (this.model.fieldValuesList == undefined)
                        this.view.showErrorMessage('There is no data loaded to fill in the fields.');
                    else
                        this.setLastSavedValues();
                }))
                    .catch(error => {
                    this.view = new View_1.View([]);
                    this.view.showErrorMessage(error.message);
                });
            });
        }
        setLastSavedValues() {
            if (this.model.fieldValues[0] != '') {
                for (let idSelect = 1; idSelect <= this.model.fieldNames.length; idSelect++) {
                    this.fillSelect(idSelect);
                    const lastValue = this.model.fieldValues[idSelect - 1];
                    this.view.setSelectValue(idSelect, lastValue);
                }
            }
            else {
                this.fillSelect(1);
                this.view.setSelectValue(1, '');
            }
        }
        fillSelect(idSelect) {
            if (idSelect == 1) {
                let values = this.model.fieldValuesList
                    .map(v => v[idSelect - 1])
                    .sort();
                values = this.removeDuplicates(values);
                this.view.fillSelect(idSelect, values);
            }
            else {
                const dependentValues = this.model.fieldValues.slice(0, idSelect - 1);
                let values = this.model.fieldValuesList.filter(v => {
                    let matchDependentValues = true;
                    for (let i = 0; i < dependentValues.length; i++)
                        if (dependentValues[i] != v[i])
                            matchDependentValues = false;
                    return matchDependentValues;
                })
                    .map(v => v[idSelect - 1])
                    .sort();
                values = this.removeDuplicates(values);
                this.view.fillSelect(idSelect, values);
            }
        }
        removeDuplicates(values) {
            return values.filter((n, i) => values.indexOf(n) === i);
        }
        updateValues(idSelect) {
            this.model.fieldValues[idSelect - 1] = this.view.getSelectValue(idSelect);
            if (idSelect < this.model.fieldNames.length) {
                const idNextSelect = idSelect + 1;
                //Clear selects 
                for (let idSelect = idNextSelect; idSelect <= this.model.fieldNames.length; idSelect++) {
                    this.view.clearSelect(idSelect);
                    this.model.fieldValues[idSelect - 1] = '';
                }
                this.fillSelect(idNextSelect);
                this.view.setSelectValue(idNextSelect, '');
                console.log(this.view.getOptions(idNextSelect).includes(''));
                if (this.view.getOptions(idNextSelect).includes('')) {
                    this.fillSelect(idNextSelect + 1);
                    this.view.setSelectValue(idNextSelect + 1, '');
                }
            }
            this.model.summarizeToPath = this.model.fieldValues.filter(v => v != '').join('\\');
            this.updateWorkItem();
        }
        updateWorkItem() {
            return __awaiter(this, void 0, void 0, function* () {
                const service = yield Services_1.WorkItemFormService.getService();
                for (let i = 0; i < this.model.fieldNames.length; i++)
                    service.setFieldValue(this.model.fieldRefNames[i], this.model.fieldValues[i]);
                service.setFieldValue(this.model.summarizeToPathRefName, this.model.summarizeToPath);
            });
        }
    }
    exports.Controller = Controller;
});
