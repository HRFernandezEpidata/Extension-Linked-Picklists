define(["require", "exports", "./Controller"], function (require, exports, Controller_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var controller;
    var provider = () => {
        return {
            onLoaded: (workItemLoadedArgs) => {
                controller = new Controller_1.Controller();
            },
        };
    };
    VSS.register(VSS.getContribution().id, provider);
});
