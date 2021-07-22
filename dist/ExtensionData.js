var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExtensionData = void 0;
    class ExtensionData {
        static getValue(orgName, pat, key, scopeType) {
            return __awaiter(this, void 0, void 0, function* () {
                let urlExtensionData = 'https://extmgmt.dev.azure.com/' + orgName + '/_apis/ExtensionManagement/InstalledExtensions/' + this.publisher + '/linked-picklists/Data/Scopes';
                urlExtensionData += scopeType == 'User' ? '/User/Me' : '/Default/Current';
                urlExtensionData += '/Collections/%24settings/Documents/';
                pat = btoa(":" + pat);
                const response = yield fetch(urlExtensionData, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Basic ' + pat
                    },
                });
                const result = yield response.json();
                const document = result.value.find(doc => doc.id == key);
                if (document != undefined)
                    return document.value;
                return undefined;
            });
        }
    }
    exports.ExtensionData = ExtensionData;
    ExtensionData.publisher = '';
});
