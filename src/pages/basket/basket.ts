import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ToastController,
  App,
  LoadingController
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { ConfigProvider } from "../../providers/config/config";

/**
 * Generated class for the BasketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-basket",
  templateUrl: "basket.html"
})
export class BasketPage {
  dataInBasket: any = null;
  totalPoints: any = 0;
  myPoints: number;

  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private configProvider: ConfigProvider
  ) {
  }

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
    this.rewardsInBasket();
  }

  rewardsInBasket() {
    this.storage.get("basket").then(val => {
      val = JSON.parse(val);
      if (val != null && val != "") {
        this.configProvider.inBasket(val).subscribe(
          res => {
            this.dataInBasket = res;
            this.calculatePoints();
          },
          err => console.log(err)
        );
      } else {
        this.calculatePoints();
      }
    });
  }

  calculatePoints() {
    this.totalPoints = 0;
    if (this.dataInBasket != null) {
      for (let i = 0; i < this.dataInBasket.length; i++) {
        this.totalPoints =
          this.totalPoints +
          this.dataInBasket[i]["rewards_points"] * this.dataInBasket[i]["amount"];
      }
    }
  }

  increase(i) {
    this.dataInBasket[i]["amount"] =
      parseInt(this.dataInBasket[i]["amount"]) + 1;
    this.storage.set("basket", JSON.stringify(this.dataInBasket));
    this.calculatePoints();
  }

  decrease(i) {
    this.dataInBasket[i]["amount"] =
      parseInt(this.dataInBasket[i]["amount"]) - 1;
    this.storage.set("basket", JSON.stringify(this.dataInBasket));
    this.calculatePoints();
  }

  removeRewards(i) {
    this.dataInBasket.splice(i, 1);
    this.storage.set("basket", JSON.stringify(this.dataInBasket));
    this.rewardsInBasket();
    let toast = this.toastCtrl.create({
      message: 'ลบของรางวัลออกจากตะกร้าเรียบร้อย',
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }

  exchangeRewards() {
    this.storage.get("basket").then(val => {
      if (val != null && val != "[]") {
        let alert = this.alertCtrl.create({
          title: "แลกของรางวัล",
          message: "คุณแน่ใจหรือไม่ ว่าจะทำรายการแลกนี้?",
          buttons: [
            {
              text: "ใช่",
              handler: () => {
                let loader = this.loadingCtrl.create({
                  content: "กำลังดำเนินการ..."
                });
                loader.present();

                this.storage.get("logged_user").then(valUser => {
                  let user = JSON.parse(valUser);

                  this.configProvider
                    .exchangeRewards(user["user_id"], JSON.parse(val))
                    .subscribe(
                      res => {
                        loader.dismiss();

                        if (res['message'] == "0") {
                          let toast = this.toastCtrl.create({
                            message: "มีบางรายการไม่สามารถแลกได้",
                            duration: 3000,
                            position: "top"
                          });
                          toast.present();
                        } else if (res['message'] == "1") {
                          let toast = this.toastCtrl.create({
                            message: 'คะแนนของคุณไม่เพียงพอ',
                            duration: 3000,
                            position: 'top'
                          });
                          toast.present();
                        } else if (res['message'] == "2") {
                          let toast = this.toastCtrl.create({
                            message: res['name'] + ' มีจำนวนไม่เพียงพอ',
                            duration: 3000,
                            position: 'top'
                          });
                          toast.present();
                        } else {
                          let toast = this.toastCtrl.create({
                            message: "ทำรายการเสร็จสิ้น",
                            duration: 3000,
                            position: "top"
                          });
                          toast.present();
                          this.configProvider.findUser(user["user_id"]).subscribe(
                            res => {
                              this.storage.set("basket", "[]");
                              this.storage.set("logged_user", JSON.stringify(res));
                              this.rewardsInBasket();
                              this.appCtrl.getRootNav().pop();
                            },
                            err => console.log(err)
                          );
                        }
                      },
                      () => {
                        let toast = this.toastCtrl.create({
                          message: "เกิดข้อผิดพลาดในระบบ",
                          duration: 3000,
                          position: "top"
                        });

                        loader.dismiss();
                        toast.present();
                      }
                    );
                });
              }
            },
            {
              text: "ไม่"
            }
          ]
        });
        alert.present();
      }
    });
  }

  doRefresh(refresher) {
    this.ionViewDidEnter() 
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
}
