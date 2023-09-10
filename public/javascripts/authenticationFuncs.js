"use strict";

(function () {
    /**
     * Performs 6 validations: for the three inputs checks that the input is not empty, and also checks that both names are only letters and that the email input is a valid address
     * @param emailElm
     * @param fNameElem
     * @param lNameElem
     * @returns {*|boolean}Returns truth Only with all validations returned truth
     */
    const validateRegisterForm = (emailElm, fNameElem, lNameElem) => {
        let v1 = utilitiesModule.validateInput(fNameElem, validatorModule.isNotEmpty) && utilitiesModule.validateInput(fNameElem, validatorModule.hasLetter);
        let v2 = utilitiesModule.validateInput(lNameElem, validatorModule.isNotEmpty) && utilitiesModule.validateInput(lNameElem, validatorModule.hasLetter);
        let v3 = utilitiesModule.validateInput(emailElm, validatorModule.isNotEmpty) && utilitiesModule.validateInput(emailElm, validatorModule.hasEmailAddress);
        return v1 && v2 && v3;
    }

    /**
     *Activates the validation functions on the input in the password form, and depending on the result activates the next step or displays an error
     * @param event
     */
    function passwordRegistration(event) {
        event.preventDefault();
        let password1 = document.getElementById('password1');
        let password2 = document.getElementById('password2');
        let v1 = utilitiesModule.validateInput(password1, validatorModule.lengthLeast8);
        let v2 = utilitiesModule.validateInput(password2, validatorModule.lengthLeast8);
        if (v1 && v2) {
            let v3 = validatorModule.areEqual(password1.value.trim(), password2.value.trim());
            if (!v3.isValid) {
                password2.nextElementSibling.innerHTML = v3.message;
                password2.classList.add("is-invalid")
            } else {
                event.target.submit();
            }
        }
    }

    /**
     * Activates the validation functions on the input in the details registration form.
     * In addition, it sends all the input to the server for safekeeping in case everything is fine, as well as checking the email at the server against the database to prevent duplication.
     * and depending on the result activates the next step or displays an error
     * @param event
     */
    function detailsRegistration(event) {
        const duplicateMessage = "this email is already in use, please choose another one";
        event.preventDefault();
        let emailInput = document.getElementById("emailInput");
        let fNameInput = document.getElementById("fNameInput");
        let lNameInput = document.getElementById("lNameInput");
        let v = validateRegisterForm(emailInput, fNameInput, lNameInput);
        if (v) {
            let loadingElm = document.getElementById("loadingGif");
            loadingElm.classList.remove('d-none');
            fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "email": emailInput.value.trim(),
                    "firsName": fNameInput.value.trim(),
                    "lastName": lNameInput.value.trim()
                })
            }).then(utilitiesModule.status)
                .then(function (response) {
                    return response.json();
                }).then(function (ok) {
                console.log(ok);
                if (ok)
                    event.target.submit();
                else {
                    emailInput.nextElementSibling.innerHTML = duplicateMessage;
                    emailInput.classList.add("is-invalid")
                }
            })
                .catch(function (error) {
                    console.log(error);
                }).finally(function () {
                loadingElm.classList.add('d-none');
            });
        }
    }

    document.addEventListener("DOMContentLoaded", function () {

        document.getElementById("registerForm")?.addEventListener("submit", detailsRegistration);
        document.getElementById("passwordForm")?.addEventListener("submit", passwordRegistration);
    });
})();

