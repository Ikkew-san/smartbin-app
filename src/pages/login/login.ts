import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { NgForm } from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  @ViewChild("f") loginForm: NgForm;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private authProvider: AuthProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ionViewDidLoad() { }

  onSubmit() {
    let loader = this.loadingCtrl.create({
      content: "กำลังเข้าสู่ระบบ..."
    });
    loader.present();

    let params = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
    this.authProvider.getAuth(params).subscribe(
      res => {
        if (res["length"] != 0) {
          if (res == 0) {
            let alert = this.alertCtrl.create({
              title: "เกิดข้อผิดพลาด",
              subTitle: "บัญชีผู้ใช้นี้ไม่สามารถเข้าใช้งานได้",
              buttons: ["ตกลง"]
            });
            loader.dismiss();
            alert.present();
          } else {
            this.storage.set("logged_user", JSON.stringify(res));
            loader.dismiss();
            this.navCtrl.setRoot("TabsPage");
          }
        } else {
          let alert = this.alertCtrl.create({
            title: "เกิดข้อผิดพลาด",
            subTitle: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
            buttons: ["ตกลง"]
          });
          loader.dismiss();
          alert.present();
        }
      },
      err => {
        console.log(err)
        let alert = this.alertCtrl.create({
          title: "เกิดข้อผิดพลาด",
          subTitle: "เกิดข้อผิดพลาดในระบบ",
          buttons: ["ตกลง"]
        });
        loader.dismiss();
        alert.present();
      }
    );
  }

  gotoRegister() {
    this.navCtrl.push("RegisterPage");
  }
}
