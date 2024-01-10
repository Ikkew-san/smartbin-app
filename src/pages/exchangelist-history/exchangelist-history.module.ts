import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ExchangelistHistoryPage } from "./exchangelist-history";

@NgModule({
  declarations: [ExchangelistHistoryPage],
  imports: [IonicPageModule.forChild(ExchangelistHistoryPage)],
  exports: [ExchangelistHistoryPage]
})
export class ExchangelistHistoryPageModule {}
