sap.ui.define([
   "res/controller/Base"
], function (BaseController) {
   "use strict";
   return BaseController.extend("res.controller.SimpleChart", {
      onInit: function () {
         this.getOwnerComponent().getRouter().getRoute("SimpleChart").attachPatternMatched(this.onRouteMatched, this);
      }
   });
});