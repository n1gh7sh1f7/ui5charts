sap.ui.define([
   "res/controller/Base"
], function (BaseController) {
   "use strict";
   return BaseController.extend("res.controller.ExtendedChart", {
      onInit: function () {
         this.getOwnerComponent().getRouter().getRoute("ExtendedChart").attachPatternMatched(this.onRouteMatched, this);
      },
      onFeedChange: function (oEvent) {
         var message = "", measures, dimensions, added, removed, feedType;
         measures = oEvent.getParameter("measures");
         dimensions = oEvent.getParameter("dimensions");
         added = oEvent.getParameter("added");
         removed = oEvent.getParameter("removed");
         if (added.measure.length > 0) {
            message += "Added measures: ";
            message += added.measure.map(function (item) {
               return item.name + " [" + item.value + "]";
            }).join(", ");
            message += "\n\n";
         }
         if (added.dimension.length > 0) {
            message += "Added dimensions: ";
            message += added.dimension.map(function (item) {
               return item.name + " [" + item.value + "]";
            }).join(", ");
            message += "\n\n";
         }
         if (removed.measure.length > 0) {
            message += "Removed measures: ";
            message += removed.measure.map(function (item) {
               return item.name + " [" + item.value + "]";
            }).join(", ");
            message += "\n\n";
         }
         if (removed.dimension.length > 0) {
            message += "Removed dimensions: ";
            message += removed.dimension.map(function (item) {
               return item.name + " [" + item.value + "]";
            }).join(", ");
            message += "\n\n";
         }
         message += "measures: " + measures.map(function (item) {
            return item.name + " [" + item.value + "]";
         }).join(", ");
         message += "\n\n";
         message += "dimensions: " + dimensions.map(function (item) {
            return item.name + " [" + item.value + "]";
         }).join(", ");
         console.log(message);
      }
   });
});