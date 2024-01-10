import { Component } from "@angular/core";
import { IonicPage } from "ionic-angular";

@IonicPage()
@Component({
  templateUrl: "tabs.html"
})
export class TabsPage {
  tab1Root = 'HomePage';
  tab2Root = 'RewardsPage';
  tab3Root = 'ExchangelistPage';
  tab4Root = 'UserAccountPage';

  constructor() {}
}
