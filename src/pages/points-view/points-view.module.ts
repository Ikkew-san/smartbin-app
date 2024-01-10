import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PointsViewPage } from "./points-view";

@NgModule({
  declarations: [PointsViewPage],
  imports: [IonicPageModule.forChild(PointsViewPage)],
  exports: [PointsViewPage]
})
export class PointsViewPageModule {}
