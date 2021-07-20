import {Injectable} from "@angular/core";
import { AlertController } from "@ionic/angular";
import {Validator} from "../validator";
import {LogoutProvider} from "./logout";
import {Toast} from "@ionic-native/toast";

const errorMessages = {
  // Alert Provider
  // This is the provider class for most of the success and error messages in the app.
  // If you added your own messages don't forget to make a function for them or add them in the showErrorMessage switch block.

  // Firebase Error Messages
  accountExistsWithDifferentCredential: {
    header: "Account Exists!",
    subHeader: "An account with the same credential already exists."
  },
  invalidCredential: {
    header: "Invalid Credential!",
    subHeader: "An error occured logging in with this credential."
  },
  operationNotAllowed: {
    header: "Login Failed!",
    subHeader:
      "Logging in with this provider is not allowed! Please contact support."
  },
  userDisabled: {
    header: "Account Disabled!",
    subHeader:
      "Sorry! But this account has been suspended! Please contact support."
  },
  userNotFound: {
    header: "Account Not Found!",
    subHeader: "Sorry, but an account with this credential could not be found."
  },
  wrongPassword: {
    header: "Incorrect Password!",
    subHeader: "Sorry, but the password you have entered is incorrect."
  },
  invalidEmail: {
    header: "Invalid Email!",
    subHeader: "Sorry, but you have entered an invalid email address."
  },
  emailAlreadyInUse: {
    header: "Email Not Available!",
    subHeader: "Sorry, but this email is already in use."
  },
  weakPassword: {
    header: "Weak Password!",
    subHeader: "Sorry, but you have entered a weak password."
  },
  requiresRecentLogin: {
    header: "Credential Expired!",
    subHeader: "Sorry, but this credential has expired! Please login again."
  },
  userMismatch: {
    header: "User Mismatch!",
    subHeader: "Sorry, but this credential is for another user!"
  },
  providerAlreadyLinked: {
    header: "Already Linked!",
    subHeader: "Sorry, but your account is already linked to this credential."
  },
  credentialAlreadyInUse: {
    header: "Credential Not Available!",
    subHeader: "Sorry, but this credential is already used by another user."
  },
  // Profile Error Messages
  changeName: {
    header: "Change Name Failed!",
    subHeader: "Sorry, but we've encountered an error changing your name."
  },
  invalidCharsName: Validator.profileNameValidator.patternError,
  nameTooShort: Validator.profileNameValidator.lengthError,
  changeEmail: {
    header: "Change Email Failed!",
    subHeader:
      "Sorry, but we've encountered an error changing your email address."
  },
  invalidProfileEmail: Validator.profileEmailValidator.patternError,
  changePhoto: {
    header: "Change Photo Failed!",
    subHeader: "Sorry, but we've encountered an error changing your photo."
  },
  passwordTooShort: Validator.profilePasswordValidator.lengthError,
  invalidCharsPassword: Validator.profilePasswordValidator.patternError,
  passwordsDoNotMatch: {
    header: "Change Password Failed!",
    subHeader: "Sorry, but the passwords you entered do not match."
  },
  updateProfile: {
    header: "Update Profile Failed",
    subHeader: "Sorry, but we've encountered an error updating your profile."
  },
  usernameExists: {
    header: "Username Already Exists!",
    subHeader: "Sorry, but this username is already taken by another user."
  },
  phoneNumberExists: {
    header: "Phone Number Already Exists!",
    subHeader: "Sorry, but this phone number is already taken by another user."
  },
  // Image Error Messages
  imageUpload: {
    header: "Image Upload Failed!",
    subHeader: "Sorry but we've encountered an error uploading selected image."
  },
  // Group Error Messages
  groupUpdate: {
    header: "Update Group Failed!",
    subHeader: "Sorry, but we've encountered an error updating this group."
  },
  groupLeave: {
    header: "Leave Group Failed!",
    subHeader: "Sorry, but you've encountered an error leaving this group."
  },
  groupDelete: {
    header: "Delete Group Failed!",
    subHeader: "Sorry, but we've encountered an error deleting this group."
  }
};

const successMessages = {
  passwordResetSent: {
    header: "Password Reset Sent!",
    subHeader: "A password reset email has been sent to: "
  },
  profileUpdated: {
    header: "Profile Updated!",
    subHeader: "Your profile has been successfully updated!"
  },
  phoneNumberUpdated: {
    header: "Phone Number Updated!",
    subHeader: "Your phone number has been successfully updated!"
  },
  emailVerified: {
    header: "Email Confirmed!",
    subHeader: "Congratulations! Your email has been confirmed!"
  },
  emailVerificationSent: {
    header: "Email Confirmation Sent!",
    subHeader: "An email confirmation has been sent to: "
  },
  accountDeleted: {
    header: "Account Deleted!",
    subHeader: "Your account has been successfully deleted."
  },
  passwordChanged: {
    header: "Password Changed!",
    subHeader: "Your password has been successfully changed."
  },
  friendRequestSent: {
    header: "Friend Request Sent!",
    subHeader: "Your friend request has been successfully sent!"
  },
  friendRequestRemoved: {
    header: "Friend Request Deleted!",
    subHeader: "Your friend request has been successfully deleted."
  },
  groupUpdated: {
    header: "Group Updated!",
    subHeader: "This group has been successfully updated!"
  },
  groupLeft: {
    header: "Leave Group",
    subHeader: "You have successfully left this group."
  }
};


@Injectable({
  providedIn: 'root'
})
export class AlertProvider {
  private alert;

  constructor(
    public alertCtrl: AlertController,
    public logoutProvider: LogoutProvider,
    private toast: Toast
  ) {}

  // Show profile updated
  async showProfileUpdatedMessage() {
    this.alert = (await this.alertCtrl
        .create({
            header: successMessages.profileUpdated["title"],
            subHeader: successMessages.profileUpdated["subHeader"],
            buttons: ["OK"]
        }))
      .present();
  }

  async showPhoneNumberUpdatedMessage() {
    this.alert = (await this.alertCtrl
        .create({
            header: successMessages.phoneNumberUpdated["title"],
            subHeader: successMessages.phoneNumberUpdated["subHeader"],
            buttons: ["OK"]
        }))
      .present();
  }

  // Show password reset sent
  async showPasswordResetMessage(email) {
    this.alert = (await this.alertCtrl
        .create({
            header: successMessages.passwordResetSent["title"],
            subHeader: successMessages.passwordResetSent["subHeader"] + email,
            buttons: ["OK"]
        }))
      .present();
  }

  // Show email verified and redirect to homePage
  async showEmailVerifiedMessageAndRedirect(navCtrl) {
    this.alert = (await this.alertCtrl
        .create({
            header: successMessages.emailVerified["title"],
            subHeader: successMessages.emailVerified["subHeader"],
            buttons: [
                {
                    text: "OK",
                    handler: () => {
                        //navCtrl.setRoot(Login.homePage);
                    }
                }
            ]
        }))
      .present();
  }

  // Show email verification sent
  async showEmailVerificationSentMessage(email) {
    this.alert = (await this.alertCtrl
        .create({
            header: successMessages.emailVerificationSent["title"],
            subHeader: successMessages.emailVerificationSent["subHeader"] + email,
            buttons: ["OK"]
        }))
      .present();
  }

  // Show account deleted
  async showAccountDeletedMessage() {
    this.alert = (await this.alertCtrl
        .create({
            header: successMessages.accountDeleted["title"],
            subHeader: successMessages.accountDeleted["subHeader"],
            buttons: ["OK"]
        }))
      .present();
  }

  // Show password changed
  async showPasswordChangedMessage() {
    this.alert = (await this.alertCtrl
        .create({
            header: successMessages.passwordChanged["title"],
            subHeader: successMessages.passwordChanged["subHeader"],
            buttons: ["OK"]
        }))
      .present();
  }
  // show alert
  async showAlert(title, subHeader) {
    this.alert = (await this.alertCtrl
        .create({
            header: title,
            subHeader: subHeader,
            buttons: ["OK"]
        }))
      .present();
  }

  // Show friend request sent
  async showFriendRequestSent() {
    this.alert = (await this.alertCtrl
        .create({
            header: successMessages.friendRequestSent["title"],
            subHeader: successMessages.friendRequestSent["subHeader"],
            buttons: ["OK"]
        }))
      .present();
  }

  // Show friend request removed
  async showFriendRequestRemoved() {
    this.alert = (await this.alertCtrl
        .create({
            header: successMessages.friendRequestRemoved["title"],
            subHeader: successMessages.friendRequestRemoved["subHeader"],
            buttons: ["OK"]
        }))
      .present();
  }

  // Show group updated.
  async showGroupUpdatedMessage() {
    this.alert = (await this.alertCtrl
        .create({
            header: successMessages.groupUpdated["title"],
            subHeader: successMessages.groupUpdated["subHeader"],
            buttons: ["OK"]
        }))
      .present();
  }

  // Show error messages depending on the code
  // If you added custom error codes on top, make sure to add a case block for it.
  async showErrorMessage(code) {
    switch (code) {
      // Firebase Error Messages
      case "auth/account-exists-with-different-credential":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.accountExistsWithDifferentCredential["title"],
                subHeader: errorMessages.accountExistsWithDifferentCredential["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "auth/invalid-credential":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.invalidCredential["title"],
                subHeader: errorMessages.invalidCredential["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "auth/operation-not-allowed":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.operationNotAllowed["title"],
                subHeader: errorMessages.operationNotAllowed["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "auth/user-disabled":
        this.alert = this.alertCtrl.create({
          header: errorMessages.userDisabled["title"],
          subHeader: errorMessages.userDisabled["subHeader"],
          buttons: ["OK"]
        });
        this.alert.present();
        break;
      case "auth/user-not-found":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.userNotFound["title"],
                subHeader: errorMessages.userNotFound["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "auth/wrong-password":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.wrongPassword["title"],
                subHeader: errorMessages.wrongPassword["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "auth/invalid-email":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.invalidEmail["title"],
                subHeader: errorMessages.invalidEmail["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "auth/email-already-in-use":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.emailAlreadyInUse["title"],
                subHeader: errorMessages.emailAlreadyInUse["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "auth/weak-password":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.weakPassword["title"],
                subHeader: errorMessages.weakPassword["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "auth/requires-recent-login":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.requiresRecentLogin["title"],
                subHeader: errorMessages.requiresRecentLogin["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "auth/user-mismatch":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.userMismatch["title"],
                subHeader: errorMessages.userMismatch["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "auth/provider-already-linked":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.providerAlreadyLinked["title"],
                subHeader: errorMessages.providerAlreadyLinked["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "auth/credential-already-in-use":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.credentialAlreadyInUse["title"],
                subHeader: errorMessages.credentialAlreadyInUse["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      // Profile Error Messages
      case "profile/error-change-name":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.changeName["title"],
                subHeader: errorMessages.changeName["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "profile/invalid-chars-name":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.invalidCharsName["title"],
                subHeader: errorMessages.invalidCharsName["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "profile/name-too-short":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.nameTooShort["title"],
                subHeader: errorMessages.nameTooShort["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "profile/error-change-email":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.changeEmail["title"],
                subHeader: errorMessages.changeEmail["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "profile/invalid-email":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.invalidProfileEmail["title"],
                subHeader: errorMessages.invalidProfileEmail["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "profile/error-change-photo":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.changePhoto["title"],
                subHeader: errorMessages.changePhoto["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "profile/password-too-short":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.passwordTooShort["title"],
                subHeader: errorMessages.passwordTooShort["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "profile/invalid-chars-password":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.invalidCharsPassword["title"],
                subHeader: errorMessages.invalidCharsPassword["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "profile/passwords-do-not-match":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.passwordsDoNotMatch["title"],
                subHeader: errorMessages.passwordsDoNotMatch["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "profile/error-update-profile":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.updateProfile["title"],
                subHeader: errorMessages.updateProfile["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "profile/error-same-username":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.usernameExists["title"],
                subHeader: errorMessages.usernameExists["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "profile/error-same-phoneNumber":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.phoneNumberExists["title"],
                subHeader: errorMessages.phoneNumberExists["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      //Image Error Messages
      case "image/error-image-upload":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.imageUpload["title"],
                subHeader: errorMessages.imageUpload["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      // Group Error MEssages
      case "group/error-update-group":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.groupUpdate["title"],
                subHeader: errorMessages.groupUpdate["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "group/error-leave-group":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.groupLeave["title"],
                subHeader: errorMessages.groupLeave["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
      case "group/error-delete-group":
        this.alert = (await this.alertCtrl
            .create({
                header: errorMessages.groupDelete["title"],
                subHeader: errorMessages.groupDelete["subHeader"],
                buttons: ["OK"]
            }))
          .present();
        break;
    }
  }
  showToast(msg) {
    this.toast.show(msg, "5000", "bottom").subscribe(toast => {});
  }
}
