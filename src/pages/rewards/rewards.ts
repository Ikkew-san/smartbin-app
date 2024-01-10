import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  App,
  ToastController,
  LoadingController
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { ConfigProvider } from "../../providers/config/config";

@IonicPage()
@Component({
  selector: "page-rewards",
  templateUrl: "rewards.html"
})
export class RewardsPage {
  dataRewards: any;
  basket: any;
  myPoints: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private configProvider: ConfigProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public appCtrl: App,
    private storage: Storage,
  ) {}

  doRefresh(refresher) {
    this.ionViewDidEnter()
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }


  ionViewDidEnter() {
    this.getRewards();
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

  getRewards() {
    this.configProvider.getRewards().subscribe(
      res => {
        this.dataRewards = res;
      },
      err => console.log(err)
    );
  }

  onSelect(id) {
    let loader = this.loadingCtrl.create({
      content: "กำลังดำเนินการ..."
    });
    loader.present();

    this.configProvider.checkRewards(id).subscribe(
      res => {
        this.storage.get("basket").then(val => {
          loader.dismiss();
          if (val) {
            let add = false;
            let basket = JSON.parse(val);
            for (let i = 0; i < basket.length; i++) {
              if (res[0]["rewards_id"] == basket[i]["rewards_id"]) {
                basket[i]["amount"]++;
                add = true;
                let toast = this.toastCtrl.create({
                  message: "เพิ่มจำนวนของรางวัลในตะกร้าเรียบร้อย",
                  duration: 1000,
                  position: "top"
                });
                toast.present();
              }
            }

            if (add == false) {
              res[0]["amount"] = 1;
              basket[basket.length] = res[0];
              let toast = this.toastCtrl.create({
                message: "เพิ่มของรางวัลลงในตะกร้าเรียบร้อย",
                duration: 1000,
                position: "top"
              });
              toast.present();
            }
            this.storage.set("basket", JSON.stringify(basket));
          } else {
            res[0]["amount"] = 1;
            this.storage.set("basket", JSON.stringify(res));
            let toast = this.toastCtrl.create({
              message: "เพิ่มของรางวัลลงในตะกร้าเรียบร้อย",
              duration: 1000,
              position: "top"
            });
            toast.present();
          }
        });
      },
      err => console.log(err)
    );
  }

  gotoBasketPage() {
    this.appCtrl.getRootNav().push("BasketPage");
  }
}
  