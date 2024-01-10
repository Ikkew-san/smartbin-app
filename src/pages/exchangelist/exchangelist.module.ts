import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ExchangelistPage } from "./exchangelist";

@NgModule({
  declarations: [ExchangelistPage],
  imports: [IonicPageModule.forChild(ExchangelistPage)],
  exports: [ExchangelistPage]
})
export class ExchangelistPageModule {}
