import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { ConfigProvider } from "../../providers/config/config";

/**
 * Generated class for the PointHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-points-history",
  templateUrl: "points-history.html"
})
export class PointsHistoryPage {
  dataCumulative: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private configProvider: ConfigProvider
  ) {}

  ionViewWillEnter() {
    this.storage.get("logged_user").then(val => {
      val = JSON.parse(val);
      this.configProvider.pointsHistory(val["user_id"]).subscribe(
        res => {
          this.dataCumulative = res;
        },
        err => console.log(err)
      );
    });
  }

  doRefresh(refresher) {
    this.ionViewWillEnter() 
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
}
