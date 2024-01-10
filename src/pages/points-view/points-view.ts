import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, App, AlertController, LoadingController } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { ConfigProvider } from "../../providers/config/config";

/**
 * Generated class for the PointsViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-points-view",
  templateUrl: "points-view.html"
})
export class PointsViewPage {
  smartbin_id: any;
  user_id: any;
  bottle: any;
  newPoints: number = 0;
  myPoints: number;
  pointsBottle: number;
  firstname: any;
  lastname: any;
  image_url: any = "../assets/imgs/avatar.svg";

  timer: any;
  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage,
    private configProvider: ConfigProvider
  ) {
  }

  ionViewDidEnter() {
    this.newPoints = 0;
    this.myPoints = 0;
    this.pointsBottle = 0;
    this.storage.get("logged_user").then(valUser => {
      valUser = JSON.parse(valUser);
      this.configProvider.onPoints(valUser["user_id"]).subscribe(
        res => {
          this.user_id = res[0]["user_id"];
          this.smartbin_id = res[0]["smartbin_id"];
          this.firstname = res[0]["user_firstname"];
          this.lastname = res[0]["user_lastname"];
          this.myPoints = parseInt(res[0]["user_points"]);
          if (res[0]["image_url"] != null) {
            this.image_url = res[0]["image_url"];
          }
          this.pointsBottle = res[0]["system_points"];
          this.amountBottle(this.smartbin_id)
        },
        err => console.log(err)
      );
    });
  }

  amountBottle(id) {
    this.timer = setInterval(() => {
      this.configProvider.getAmountBottle(id).subscribe(
      res => {
        if (res['user_id'] != null) {
          this.bottle = res['smartbin_bottle']
          this.newPoints = this.bottle * this.pointsBottle;
        } else { 
          let loader = this.loadingCtrl.create({
            content: "กำลังดำเนินการ..."
          });
          loader.present();

          if (this.newPoints != 0) {
            let alert = this.alertCtrl.create({
              title: "แจ้งเตือน",
              subTitle: "คุณได้รับคะแนนสะสม " + this.newPoints + " คะแนน",
              buttons: ["ตกลง"]
            });
            alert.present();
          }
          clearInterval(this.timer)
          loader.dismiss();
          this.navCtrl.setRoot("TabsPage");
        }
      },
      err => console.log(err)
    )}, 500)
  }


  logoutPoints() {
    let loader = this.loadingCtrl.create({
      content: "กำลังดำเนินการ..."
    });
    loader.present();

    let params = {
      id: this.smartbin_id,
    };
    this.configProvider.logoutSmartbin(params).subscribe(
      () => {
        clearInterval(this.timer)
        loader.dismiss();
        if (this.newPoints != 0) {
          let alert = this.alertCtrl.create({
            title: "แจ้งเตือน",
            subTitle: "คุณได้รับคะแนนสะสม " + this.newPoints + " คะแนน",
            buttons: ["ตกลง"]
          });
          alert.present();
        }
        this.navCtrl.setRoot("TabsPage");
      },
      err => console.log(err)
    );
  }
}
