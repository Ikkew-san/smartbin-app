import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PointsHistoryPage } from "./points-history";

@NgModule({
  declarations: [PointsHistoryPage],
  imports: [IonicPageModule.forChild(PointsHistoryPage)],
  exports: [PointsHistoryPage]
})
export class PointsHistoryPageModule {}
