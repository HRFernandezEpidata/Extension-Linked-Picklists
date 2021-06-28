import { PickListControl, PickListValuesOrganization, PickListValuesProject } from "./PickListControl";
import { ControlsManager } from "./ControlsManager";


const inputPAT = <HTMLInputElement> document.getElementById("pat");
const btnViewData = document.getElementById("btnViewData");
const secControlValues = document.getElementById("control-values");

btnViewData.addEventListener("click", () => {
    updateViewControlValues();
});

function updateViewControlValues() {

    if (inputPAT.value.trim() == '') {
        alert('Personal access token is empty.');
        return
    }
    
    ControlsManager.getAllControls(inputPAT.value).then((result) => {
        let controls :Array<PickListControl> = new Array<PickListControl>();
        controls = result;
        console.log(controls);
        secControlValues.innerHTML = '';

        if (controls.length == 0) {
            secControlValues.innerHTML += `
                <p class="no-values">No data has been uploaded yet.</p>
            `;
        }
        else {
            for (const control of controls) 
                secControlValues.innerHTML += createControlElement(control);
            addEventBtnTable();
        }
    })
    .catch(error => {
        secControlValues.innerHTML = '';
        alert(error.message);
    });
}

function createControlElement(control :PickListControl) :string {
    let controlElement :string = `
        <div class="control">
            <h3 class="control__name">Control Name: <span>${control.getName()}</span></h3>
            <div class="control__org-values">
    `;

    const orgValues :PickListValuesOrganization = control.getValuesOrganization();
    if (orgValues == undefined) {
        controlElement += '<p class="no-values">This control has no values loaded at the organization level.</p>';
    }
    else {
        controlElement += `
        <h4>Organization Values (Updated: ${orgValues.getLastModified()})</h4>
            <div class="btns-container">
                <button class="btn-table">Show data</button>
            </div>
        `;
        controlElement += createTable(orgValues.getValues());
    }

    controlElement += '</div>'

    controlElement += `
        <div class="control__proj-values">
            <h4>Project Values</h4>
    `;

    const projValues :Array<PickListValuesProject> = control.getValuesProjects();
    
    if (projValues.length == 0) {
        controlElement += `
                <p class="no-values">This control has no values loaded at project level.</p>
            </div>
        `;
    }
    else {
        projValues.forEach(v => {
            controlElement += `<p class="control__proj-name">Project name: ${v.getProjectName()} (Updated: ${v.getLastModified()})</p>`;
            controlElement += `
                <div class="btns-container">
                    <button class="btn-table">Show data</button>
                </div>
            `;
            controlElement += createTable(v.getValues());
        });
        controlElement += '</div>'
    }

    controlElement += '</div>';

    return controlElement;
}

function createTable(values :Array<Array<string>>) :string {

    let table = `
    <div class="cont-table">
        <table>
            <tbody>
    `;

    values.forEach((row) => {
        table += `<tr>`;

        row.forEach((col) => {
            table += `<td>${col}</td>`
        });

        table += `</tr>`
    });

    table += `
            </tbody>
        </table>
    </div>
    `;

    return table;
}

function  addEventBtnTable() {
    const btns = document.querySelectorAll('.btn-table');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const table = btn.parentElement.nextElementSibling;
            if (table.classList.contains('d-block')) {
                table.classList.remove('d-block');
                btn.textContent = 'Show data';
            }
            else {
                table.classList.add('d-block');
                btn.textContent = 'Hide data';
            }
        });
    });
}

