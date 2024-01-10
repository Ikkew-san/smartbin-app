import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, App, ToastController, LoadingController } from "ionic-angular";
import { NgForm } from "@angular/forms";
import { Storage } from "@ionic/storage";
import { ConfigProvider } from "../../providers/config/config";
// import { UserAccountPage } from "../user-account/user-account";

/**
 * Generated class for the UserEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-user-edit",
  templateUrl: "user-edit.html"
})
export class UserEditPage {
  @ViewChild("f") profileForm: NgForm;
  title: any = {
    name: "เปลี่ยนชื่อ-นามสกุล",
    email: "เปลี่ยนอีเมล",
    tel: "เปลี่ยนหมายเลขโทรศัพท์",
    pwd: "เปลี่ยนรหัสผ่าน"
  };
  page: any;
  originalData: any;

  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private configProvider: ConfigProvider
  ) {
    let params = navParams.get("params");
    this.page = params["titlePage"];
    this.originalData = params["originalData"];
  }

  onSubmit() {
    
    
    let params;
    if (this.page == "name") {
      params = {
        action: this.page,
        firstname: this.profileForm.value.firstname,
        lastname: this.profileForm.value.lastname
      }
    } else if (this.page == "email") {
      params = {
        action: this.page,
        email: this.profileForm.value.email
      };
    } else if (this.page == "tel") {
      params = {
        action: this.page,
        telephone: this.profileForm.value.telephone
      }
    } else if (this.page == "pwd") {

      if (this.profileForm.value.password == this.profileForm.value.password_confirm) {
        params = {
          action: this.page,
          password: this.profileForm.value.password
        }
      } else {
        let toast = this.toastCtrl.create({
          message: "ยืนยันรหัสผ่านใหม่ไม่ถูกต้อง",
          duration: 3000,
          position: "top"
        });
        toast.present();
        return;
      }
    }
    
    if (params != null) {
      let loader = this.loadingCtrl.create({
        content: "กำลังดำเนินการ..."
      });
      loader.present();
      
      this.storage.get("logged_user").then(valUser => {
        valUser = JSON.parse(valUser);

        this.configProvider.editProfile(valUser["user_id"], params).subscribe(
          () => {
            this.appCtrl.getRootNav().pop();
            let toast = this.toastCtrl.create({
              message: "บันทึกเสร็จสิ้น",
              duration: 3000,
              position: "top"
            });

            loader.dismiss();
            toast.present();
          },
          err => {
            console.log(err)
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
  }
}
