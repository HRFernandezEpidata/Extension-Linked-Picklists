export class ExtensionData {

    static async getValue(orgName :string, pat :string, key :string,  scopeType :string) {

        let urlExtensionData = 'https://extmgmt.dev.azure.com/' + orgName + '/_apis/ExtensionManagement/InstalledExtensions/HernanFernandez/linked-picklists/Data/Scopes';
        urlExtensionData += scopeType == 'User' ? '/User/Me' : '/Default/Current';
        urlExtensionData += '/Collections/%24settings/Documents/';

        pat = btoa(":"+pat);

        const response = await fetch(urlExtensionData, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + pat
            },
        });

        const result = await response.json();
        const document = result.value.find(doc => doc.id == key);
        if (document != undefined)
            return document.value;
        return undefined;
    }

}