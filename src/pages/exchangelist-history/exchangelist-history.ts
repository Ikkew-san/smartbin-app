import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { ConfigProvider } from "../../providers/config/config";

/**
 * Generated class for the ExchangelistHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-exchangelist-history",
  templateUrl: "exchangelist-history.html"
})
export class ExchangelistHistoryPage {
  status: any = "4"
  dataExchangeHistory: any;
  exchangeStatus = ["ยกเลิก", "รอการอนุมัติ", "อนุมัติ", "รับของ", "ตัดสิทธิ์"];
  exchangelistStatus = ["ยกเลิก", "รอการอนุมัติ", "อนุมัติ"];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private configProvider: ConfigProvider) { }

  ionViewWillEnter() {
    this.selectedStatus()
  }

  selectedStatus() {
    this.storage.get("logged_user").then(val => {
      val = JSON.parse(val);
      let param = {
        status: this.status
      }
      this.configProvider.getExchange_Status(val["user_id"], param).subscribe(
        res => {
          this.dataExchangeHistory = res;
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
