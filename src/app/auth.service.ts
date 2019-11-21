import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
@Injectable({
  providedIn: "root"
})
export class AuthService {
  currentUser: string = "";
  issessionValid: boolean = false;
  attributeList: string[] = [];
  poolData = {
    UserPoolId: "see email",
    ClientId: "see email",
    AppWebDomain: "https://localhost:4200"
  };
  userPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolData);

  constructor(private route: Router) {}

  addAttributes(name: string, value: string) {
    try {
      this.attributeList.push(
        new AmazonCognitoIdentity.CognitoUserAttribute({
          Name: name,
          Value: value
        })
      );
      console.log(this.attributeList);
    } catch (e) {
      console.log(e);
    }
  }

  updateUserAttributes(name: string, value: string) {
    try {
      let attributeList = [];
      let user = this.userPool.getCurrentUser();

      user.getSession(function(err, result) {
        if (err) {
          console.log(err);
        }
        var attribute = {
          Name: name,
          Value: value
        };
        var newAttr = new AmazonCognitoIdentity.CognitoUserAttribute(attribute);
        console.log(newAttr);
        attributeList.push(newAttr);

        user.updateAttributes(attributeList, function(err, result) {
          console.log("this is running");
          if (err) {
            console.log(err);
            return;
          }
          console.log("attributes updated?: " + result);
        });

        //hard set to email, replace with 'name' argument if needed
        user.getAttributeVerificationCode("email", {
          onSuccess: function(result) {
            console.log("call result: " + result);
          },
          onFailure: function(err) {
            console.log(err);
          },
          inputVerificationCode: function() {
            var verificationCode = prompt(
              "Please input verification code: ",
              ""
            );
            user.verifyAttribute("email", verificationCode, this);
          }
        });

        attributeList = [];
      });
    } catch (e) {
      console.log(e);
    }
  }

  signUp(username: string, password: string) {
    try {
      this.userPool.signUp(
        username,
        password,
        this.attributeList,
        null,
        function(err, result) {
          if (err) {
            console.log(err);
            return;
          }
          let newUser = result.user;
          console.log(`user name is ${newUser.getUsername()}`);
        }
      );
      this.attributeList = [];
    } catch (e) {
      console.log(e);
    }
  }

  signIn(username: string, password: string) {
    try {
      let authDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: username,
        Password: password
      });
      let userData = {
        Username: username,
        Pool: this.userPool
      };
      this.signInHelper(authDetails, userData);
    } catch (e) {
      console.log(e);
    }
  }

  signInHelper(authDetails, userData) {
    try {
      let sessionValid;
      let returningUser = new AmazonCognitoIdentity.CognitoUser(userData);
      console.log(returningUser);
      this.currentUser = returningUser.username;
      returningUser.authenticateUser(authDetails, {
        onSuccess: result => {
          console.log(result);
          let accessToken = result.getAccessToken().getJwtToken();
          console.log("accessToken: ", accessToken);
          /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
          let idToken = result.idToken.jwtToken;
          console.log("idToken: ", idToken);

          this.localStorageUser(userData, sessionValid);
        },
        onFailure: err => {
          console.log(err);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  signOut() {
    try {
      let user = this.userPool.getCurrentUser();
      if (user != null) {
        user.signOut();
        this.issessionValid = false;
        console.log(`${this.currentUser} has signed out`);
        this.currentUser = "";
      }
    } catch (e) {
      console.log(e);
    }
  }

  deleteUser() {
    try {
      let user = this.userPool.getCurrentUser();
      user.getSession(function(err, session) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(session);
        user.deleteUser(function(err, result) {
          if (err) {
            console.log(err);
            return;
          }
          console.log("user deleted = ", result);
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  forgotPassword() {
    try {
      let user = this.userPool.getCurrentUser();
      user.forgotPassword({
        onSuccess: function(result) {
          console.log("call result: " + result);
        },
        onFailure: function(err) {
          console.log(err);
        },
        inputVerificationCode() {
          var verificationCode = prompt("Please input verification code ", "");
          var newPassword = prompt("Enter new password ", "");
          user.confirmPassword(verificationCode, newPassword, this);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  changePassword(oldPw, newPw) {
    try {
      let user = this.userPool.getCurrentUser();
      user.getSession(function(err, result) {
        if (err) {
          console.log(err);
          return;
        }

        user.changePassword(oldPw, newPw, function(err, result) {
          if (err) {
            console.log(err);
            return;
          }
          console.log("call result: " + result);
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  //Gets current user from local storage. Checks if session is valid.
  localStorageUser(userData, sessionValid) {
    try {
      let user = userData.Pool.getCurrentUser();
      console.log("current user: ", user.username);
      user.getSession(function(err, result) {
        if (err) {
          console.log(err);
          return;
        }
        sessionValid = result.isValid();
      });
      this.issessionValid = sessionValid;
      this.route.navigate(["/protected"]);
    } catch (e) {
      console.log(e);
    }
  }
}
