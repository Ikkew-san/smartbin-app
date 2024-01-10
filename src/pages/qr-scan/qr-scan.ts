import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, App, ToastController, LoadingController } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner";
import { ConfigProvider } from "../../providers/config/config";

/**
 * Generated class for the QrScanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-qr-scan",
  templateUrl: "qr-scan.html"
})
export class QrScanPage {
  private light: boolean = false;
  private frontCamera: boolean = false;
  private scanSub: any;

  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private qrScanner: QRScanner,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private configProvider: ConfigProvider
  ) {}

  ionViewWillEnter() {
    this.setupScanner();
  }

  ionViewWillLeave() {
    this.qrScanner.hide();
    this.scanSub.unsubscribe();
  }

  setupScanner() {
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.scanSub = this.qrScanner.scan().subscribe((text: string) => {

          let loader = this.loadingCtrl.create({
            content: "กำลังดำเนินการ..."
          });
          loader.present();

            this.storage.get("logged_user").then(val => {
              let user = JSON.parse(val);
              let params = {
                user_id: user["user_id"]
              };
              this.configProvider.qrLogged(text, params).subscribe(
                res => {
                  loader.dismiss();
                  if (res["status"] == 1) {
                    let messageAlert = "ทำการเข้าสู่ระบบเรียบร้อย";
                    this.presentToast(messageAlert);
                    this.appCtrl.getRootNav().push("PointsViewPage");
                  } else if (res["status"] == 2) {
                    let messageAlert = "คุณได้ทำการเข้าสู่ระบบอยู่แล้ว";
                    this.presentToast(messageAlert);
                    this.setupScanner();
                  } else if (res["status"] == 3) {
                    let messageAlert = "เครื่องนี้มีผู้เข้าใช้อยู่";
                    this.presentToast(messageAlert);
                    this.setupScanner();
                  } else if (res["status"] == 4) {
                    let messageAlert = "ไม่พบข้อมูล";
                    this.presentToast(messageAlert);
                    this.setupScanner();
                  }
                },
                err => {
                  loader.dismiss();
                  let messageAlert = "เกิดข้อผิดพลาดในระบบ";
                  this.presentToast(messageAlert);
                  console.log(err)
                }
              );
            });
          });
          this.qrScanner.show();
        } else if (status.denied) {
          console.log("Camera permission denied");
        } else {
          console.log("Permission denied for this runtime.");
        }
      })
      .catch((e: any) => console.log("Error is", e));
  }

  toggleCamera() {
    this.frontCamera = !this.frontCamera;

    if (this.frontCamera) {
      this.qrScanner.useFrontCamera();
    } else {
      this.qrScanner.useBackCamera();
    }
  }

  toggleLight() {
    this.light = !this.light;

    if (this.light) {
      this.qrScanner.enableLight();
    } else {
      this.qrScanner.disableLight();
    }
  }

  presentToast(messageAlert) {
    let toast = this.toastCtrl.create({
      message: messageAlert,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }
}
