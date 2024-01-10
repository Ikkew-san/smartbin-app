import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, App, ToastController, LoadingController } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { ConfigProvider } from "../../providers/config/config";
import { Camera, CameraOptions } from "@ionic-native/camera";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  image_url = "../assets/imgs/avatar.svg";
  user_id: any;
  username: any;
  firstname: any;
  lastname: any;
  birthday: any;
  gender: any;

  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private camera: Camera,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private configProvider: ConfigProvider
  ) {
    this.user_id = navParams.get("id");
  }

  ionViewDidLoad() {
    this.getProfile();
  }

  doRefresh(refresher) {
    this.getProfile();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  getProfile() {
    this.configProvider.findUser(this.user_id).subscribe(
      res => {
        this.username = res["user_username"];
        this.firstname = res["user_firstname"];
        this.lastname = res["user_lastname"];
        this.birthday = res["user_birthday"];
        this.gender = res["user_gender"];
        if (res["image_url"] != null) {
          this.image_url = res["image_url"];
        }
      },
      err => console.log(err)
    );
  }

  gotoEditPage(page) {
    let originalData = {
      firstname: this.firstname,
      lastname: this.lastname
    };

    let params = {
      titlePage: page,
      originalData: originalData
    };

    this.appCtrl.getRootNav().push("UserEditPage", { params });
  }

  setBirthday(event) {
    const day: number = event.day;
    const month: number = event.month;
    const year: number = event.year;
    
    let params = {
      action: "birthday",
      birthday: year + "-" + month + "-" + day
    };
    
    if (params != null) {
      let loader = this.loadingCtrl.create({
        content: "กำลังดำเนินการ..."
      });
      loader.present();
      
      this.storage.get("logged_user").then(valUser => {
        valUser = JSON.parse(valUser);
        this.configProvider.editProfile(valUser["user_id"], params).subscribe(
          () => {
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

  setGender(event) {
    
    let params = {
      action: "gender",
      gender: event
    };
    
    if (params != null) {
      let loader = this.loadingCtrl.create({
        content: "กำลังดำเนินการ..."
      });
      loader.present();

      this.storage.get("logged_user").then(valUser => {
        valUser = JSON.parse(valUser);
        this.configProvider.editProfile(valUser["user_id"], params).subscribe(
          () => {
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

  getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit: true,
      targetWidth: 512,
      targetHeight: 512
    };

    this.camera.getPicture(options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        let loader = this.loadingCtrl.create({
          content: "กำลังดำเนินการ..."
        });
        loader.present();

        this.image_url = "data:image/jpeg;base64," + imageData;

        let imageFile = this.b64toBlob(imageData, "image/jpeg");
        let param = new FormData();
        param.append("image", imageFile);
        this.configProvider.editImageProfile(this.user_id, param).subscribe(
          () => {
            let toast = this.toastCtrl.create({
              message: "บันทึกเสร็จสิ้น",
              duration: 3000,
              position: "top"
            });
            loader.dismiss();
            toast.present();
          },
          err => {
            console.log(err);
            let toast = this.toastCtrl.create({
              message: "เกิดข้อผิดพลาดในระบบ",
              duration: 3000,
              position: "top"
            });
            loader.dismiss();
            toast.present();
          }
        );
      },
      err => {
        // Handle error
      }
    );
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || "";
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
