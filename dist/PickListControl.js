define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PickListControl = exports.PickListValuesProject = exports.PickListValuesOrganization = void 0;
    class PickListValuesOrganization {
        constructor(values, lastModified) {
            if (values == null || values == undefined || values.length == 0)
                throw new Error('Array of values ​​cannot be null, undefined or empty.');
            this.values = values;
            this.lastModified = lastModified;
        }
        getValues() {
            return this.values;
        }
        setValues(values) {
            this.values = values;
        }
        getLastModified() {
            return this.lastModified;
        }
        setLastModified(lastModified) {
            this.lastModified = lastModified;
        }
        getDataObject() {
            return {
                values: this.values,
                lastModified: this.lastModified
            };
        }
        static createFromObject(OrganizationData) {
            if (OrganizationData == undefined)
                return undefined;
            const values = OrganizationData.values;
            const lastModified = new Date(OrganizationData.lastModified);
            return new PickListValuesOrganization(values, lastModified);
        }
    }
    exports.PickListValuesOrganization = PickListValuesOrganization;
    class PickListValuesProject {
        constructor(projectName, values, lastModified) {
            if (projectName == null || projectName == undefined || projectName.length == 0)
                throw new Error('Project name ​​cannot be null, undefined or empty.');
            if (values == null || values == undefined || values.length == 0)
                throw new Error('Array of values ​​cannot be null, undefined or empty.');
            this.projectName = projectName;
            this.values = values;
            this.lastModified = lastModified;
        }
        getProjectName() {
            return this.projectName;
        }
        setProjectName(projectName) {
            this.projectName = projectName;
        }
        getValues() {
            return this.values;
        }
        setValues(values) {
            this.values = values;
        }
        getLastModified() {
            return this.lastModified;
        }
        setLastModified(lastModified) {
            this.lastModified = lastModified;
        }
        getDataObject() {
            return {
                projectName: this.projectName,
                values: this.values,
                lastModified: this.lastModified
            };
        }
        static createFromObject(projectData) {
            const projectName = projectData.projectName;
            const values = projectData.values;
            const lastModified = new Date(projectData.lastModified);
            return new PickListValuesProject(projectName, values, lastModified);
        }
    }
    exports.PickListValuesProject = PickListValuesProject;
    class PickListControl {
        constructor(controlName) {
            this.controlName = controlName;
            this.valuesOrganization = undefined;
            this.valuesProjects = new Array();
        }
        add(valuesProject) {
            let projectNameExist = false;
            const i = this.valuesProjects.findIndex(vp => vp.getProjectName() == valuesProject.getProjectName());
            if (i != -1) {
                this.valuesProjects[i] = valuesProject;
            }
            else {
                this.valuesProjects.push(valuesProject);
            }
        }
        delete(projName) {
            const i = this.valuesProjects.findIndex(vp => vp.getProjectName() == projName);
            if (i != -1) {
                this.valuesProjects.splice(i, 1);
            }
        }
        getValuesProject(projName) {
            return this.valuesProjects.find(vp => vp.getProjectName() == projName);
        }
        getName() {
            return this.controlName;
        }
        setName(controlName) {
            this.controlName = controlName;
        }
        getValuesOrganization() {
            return this.valuesOrganization;
        }
        setValuesOrganization(valuesOrganization) {
            if (valuesOrganization == null)
                valuesOrganization = undefined;
            this.valuesOrganization = valuesOrganization;
        }
        getValuesProjects() {
            return this.valuesProjects;
        }
        setValuesProjects(valuesProjects) {
            if (valuesProjects == null || valuesProjects == undefined)
                valuesProjects = new Array();
            this.valuesProjects = valuesProjects;
        }
        getDataObject() {
            return {
                controlName: this.controlName,
                valuesOrganization: this.valuesOrganization == undefined ? undefined : this.valuesOrganization.getDataObject(),
                valuesProjects: this.valuesProjects == undefined ? undefined : this.valuesProjects.map(vp => vp.getDataObject())
            };
        }
        static createFromObject(controlData) {
            const controlName = controlData.controlName;
            const valuesOrganization = PickListValuesOrganization.createFromObject(controlData.valuesOrganization);
            const valuesProjects = controlData.valuesProjects
                .map(vp => PickListValuesProject.createFromObject(vp));
            const pickListControl = new PickListControl(controlName);
            pickListControl.setValuesOrganization(valuesOrganization);
            pickListControl.setValuesProjects(valuesProjects);
            return pickListControl;
        }
    }
    exports.PickListControl = PickListControl;
});
