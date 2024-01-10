import { Component } from "@angular/core";
import { NavController, IonicPage, App } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { ConfigProvider } from "../../providers/config/config";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  myPoints: number = 0;
  dataRewards: any
  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    public appCtrl: App,
    private configProvider: ConfigProvider
  ) { }


  ionViewDidEnter() {
    this.storage.get("logged_user").then(valUser => {
      valUser = JSON.parse(valUser);
      this.configProvider.findUser(valUser["user_id"]).subscribe(
        res => {
          this.myPoints = res["user_points"];
        },
        err => console.log(err)
      );
    });
  }

  doRefresh(refresher) {
    this.ionViewDidEnter()
    this.ionViewDidLoad()
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  ionViewDidLoad() {
    this.latestRewards()
  }

  latestRewards() {
    this.configProvider.latestRewards().subscribe(res => {
      this.dataRewards = res
    }, err => console.log(err))
  }

  goPointsHistory() {
    this.appCtrl.getRootNav().push("PointsHistoryPage");
  }

  gotoQRscan() {
    this.appCtrl.getRootNav().push("QrScanPage");
  }
}
