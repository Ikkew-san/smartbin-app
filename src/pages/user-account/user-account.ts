import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, App, LoadingController } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { ConfigProvider } from "../../providers/config/config";

/**
 * Generated class for the UserAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-user-account",
  templateUrl: "user-account.html"
})
export class UserAccountPage {
  dataUser: any[];
  image_url = "../assets/imgs/avatar.svg";

  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private configProvider: ConfigProvider
  ) { }

  doRefresh(refresher) {
    this.ionViewDidEnter()
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  ionViewDidEnter() {
    this.getDetailUser();
  }

  getDetailUser() {
    this.storage.get("logged_user").then(valUser => {
      valUser = JSON.parse(valUser);
      this.configProvider.findUser(valUser["user_id"]).subscribe(
        res => {
          this.dataUser = [res];
          if (res["image_url"] != null) {
            this.image_url = res["image_url"];
          }
        },
        err => console.log(err)
      );
    });
  }

  gotoProfilePage(data) {
    let id = data["user_id"]
    this.appCtrl.getRootNav().push("ProfilePage", { id });
  }

  gotoEditPage(page, data) {
    let params = {
      titlePage: page,
      originalData: data
    };
    this.appCtrl.getRootNav().push("UserEditPage", { params });
  }

  logout() {
    let loader = this.loadingCtrl.create({
      content: "กำลังดำเนินการ..."
    });
    loader.present();

    this.storage.clear();
    this.appCtrl.getRootNav().setRoot("LoginPage");
    loader.dismiss();
  }
}
