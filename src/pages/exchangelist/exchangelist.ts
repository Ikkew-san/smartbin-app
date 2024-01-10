import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { ConfigProvider } from "../../providers/config/config";

/**
 * Generated class for the ExchangelistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-exchangelist",
  templateUrl: "exchangelist.html"
})
export class ExchangelistPage {
  status: any = "0"
  dataExchange: any;
  exchangeStatus = ["ยกเลิก", "รอการอนุมัติ", "อนุมัติ", "รับของ"];
  exchangelistStatus = ["ยกเลิก", "รอการอนุมัติ", "อนุมัติ"];


  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private configProvider: ConfigProvider) { }

  ionViewWillEnter() {
    this.selectedStatus()
  }

  doRefresh(refresher) {
    this.selectedStatus()
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  selectedStatus() {
    this.storage.get("logged_user").then(val => {
      val = JSON.parse(val);
      if (this.status == 0) {
        this.configProvider.getExchange_All(val["user_id"]).subscribe(
          res => {
            this.dataExchange = res;
          },
          err => console.log(err)
        );
      } else {
        let param = {
          status: this.status
        }
        this.configProvider.getExchange_Status(val["user_id"], param).subscribe(
          res => {
            this.dataExchange = res;
          },
          err => console.log(err)
        );
      }
    });
  }

  gotoHistoryPage() {
    this.appCtrl.getRootNav().push("ExchangelistHistoryPage");
  }
}
