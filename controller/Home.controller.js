sap.ui.define([
   "res/controller/Base"
], function (BaseController) {
   "use strict";
   return BaseController.extend("res.controller.Home", {
      onNavPress: function (oEvent) {
         var oBtn = oEvent.getSource(),
            sRoute = oBtn.getText();
         this.getOwnerComponent().getRouter().navTo(sRoute);
      }
   });
});