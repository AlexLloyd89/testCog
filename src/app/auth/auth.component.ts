import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"]
})
export class AuthComponent implements OnInit {
  currentUser: string = "";
  myForm: FormGroup;
  signedIn: boolean = false;
  signinForm: FormGroup;
  signOutForm: FormGroup;
  changePassword: FormGroup;
  changeAttr: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.generateForm();
    this.generateSigninForm();
    this.generateChangePassword();
    this.generateUpdateAttr();
  }

  generateForm() {
    this.myForm = new FormGroup({
      email: new FormControl(""),
      username: new FormControl(""),
      password: new FormControl(""),
      phone_number: new FormControl("")
    });
  }

  generateSigninForm() {
    this.signinForm = new FormGroup({
      username: new FormControl(""),
      password: new FormControl("")
    });
  }

  generateChangePassword() {
    this.changePassword = new FormGroup({
      oldPassword: new FormControl(""),
      newPassword: new FormControl("")
    });
  }

  generateUpdateAttr() {
    this.changeAttr = new FormGroup({
      email: new FormControl("")
    });
  }

  signUp(formData) {
    //add attributes
    //first argument must adhere to Cognito documentation
    this.authService.addAttributes(
      "phone_number",
      `+1${formData.value.phone_number}`
    );
    this.authService.addAttributes("email", formData.value.email);

    //Signup
    this.authService.signUp(formData.value.username, formData.value.password);
  }

  signinSubmit(formData) {
    this.authService.signIn(formData.value.username, formData.value.password);
    this.currentUser = this.authService.currentUser;
  }

  signOutSubmit() {
    this.authService.signOut();
    this.currentUser = this.authService.currentUser;
  }
  deleteSubmit() {
    this.authService.deleteUser();
  }

  changeSubmit(formData) {
    this.authService.changePassword(
      formData.value.oldPassword,
      formData.value.newPassword
    );
  }

  forgotPassword() {
    this.authService.forgotPassword();
  }

  updateAttr(formData) {
    this.authService.updateUserAttributes("email", formData.value.email);
  }
}
