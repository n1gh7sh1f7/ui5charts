sap.ui.define([
   "res/controller/Base"
], function (BaseController) {
   "use strict";
   return BaseController.extend("res.controller.Home", {
      onNavPress: function (oEvent) {
         var oTile = oEvent.getSource(),
            sRoute = oTile.getHeader();
         this.getOwnerComponent().getRouter().navTo(sRoute);
      }
   });
});