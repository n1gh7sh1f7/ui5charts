sap.ui.define([
   "res/controller/Base"
], function (BaseController) {
   "use strict";
   return BaseController.extend("res.controller.StandardChart", {
      onInit: function () {
         this.getOwnerComponent().getRouter().getRoute("StandardChart").attachPatternMatched(this.onRouteMatched, this);
      }
   });
});