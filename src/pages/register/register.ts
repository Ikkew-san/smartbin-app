import {
  Component,
} from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from "ionic-angular";
import {
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";


@IonicPage()
@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage {
  public registerForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authProvider: AuthProvider,
    public formBuilder: FormBuilder
  ) {
    this.registerForm = formBuilder.group({
      firstname: ["", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Zก-๏]+$")])],
      lastname: ["", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Zก-๏]+$")])],
      username: ["",
        Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(6),
          Validators.pattern("[A-Za-z0-9._]+"),
          Validators.required
        ]),
      ],
      password: [
        "",
        Validators.compose([
          Validators.minLength(6),
          Validators.pattern("[A-Za-z0-9]+"),
          Validators.required
        ])
      ],
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      ]
    });
  }

  gotoLoginPage() {
    this.navCtrl.pop();
  }

  onSubmit() {
    let loader = this.loadingCtrl.create({
      content: "กำลังดำเนินการ..."
    });
    loader.present();

    let params = {
      firstname: this.registerForm.value.firstname,
      lastname: this.registerForm.value.lastname,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password,
      email: this.registerForm.value.email
    };
    this.authProvider.setRegister(params).subscribe(
      res => {
        loader.dismiss();

        if (res == 'username') {
          let alert = this.alertCtrl.create({
            title: "เกิดข้อผิดพลาด",
            subTitle: "ชื่อผู้ใช้นี้มีผู้ใช้แล้ว",
            buttons: ["ตกลง"]
          });
          alert.present();
        }
        else if (res == 'email') {
          let alert = this.alertCtrl.create({
            title: "เกิดข้อผิดพลาด",
            subTitle: "อีเมลนี้มีผู้ใช้แล้ว",
            buttons: ["ตกลง"]
          });
          alert.present();
        }
        else {
          let alert = this.alertCtrl.create({
            title: "แจ้งเตือน",
            subTitle: "ทำการสมัครสมาชิกเรียบร้อย",
            buttons: ["ตกลง"]
          });
          alert.present();
          this.navCtrl.pop();
        }
      },
      err => {
        loader.dismiss();
        let alert = this.alertCtrl.create({
          title: "เกิดข้อผิดพลาด",
          subTitle: "เกิดข้อผิดพลาดในระบบ",
          buttons: ["ตกลง"]
        });
        alert.present();
        console.log(err)
      }
    );
  }
}
