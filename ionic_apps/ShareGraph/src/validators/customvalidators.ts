export class ValidationService {

    emailValidator(control) {
        // RFC 2822 compliant regex
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    passwordValidator(control) {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        //if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
        if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%&'*+/=?^_`{|}~-]{6,100}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }

    verificationCodeValidator(control) {
        if (control.value.match(/^([0-9]){6}$/)) {
            return null;
        } else {
            return { 'invalidVerificationCode': true };
        }
    }

    confirmPassValidator(controlGroup) {
        let pass = controlGroup.controls["Password"];
        let rePass = controlGroup.controls["ConfirmPassword"];
        if (pass.valid && rePass.value.trim().length > 0) {
            if (pass.value.trim() != rePass.value.trim())
                return { 'passwordMismatch': true };
        }
        return null;
        //if (controlGroup.controls["Password"].value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
        //    let rePass = controlGroup.controls["ConfirmPassword"].value;
        //    if(rePass.trim() == controlGroup.controls["Password"].value.trim())
        //        return null;
        //    else

        //} else {
        //    return { 'invalidPassword': true };
        //}
    }
}