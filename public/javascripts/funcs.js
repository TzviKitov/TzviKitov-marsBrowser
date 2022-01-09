"use strict";


const validatorModule = (function () {
    const isNotEmpty = function (str) {
        return {
            isValid: (str.length !== 0),
            message: 'please enter a non empty text'
        };
    }
    const lengthLeast8 = function (str) {
        return {
            isValid: str.length >= 8,
            message: 'please enter least 8 characters'
        };
    }

    const hasLetter = function (str) {
        return {
            isValid: /^[a-zA-Z]+$/.test(str),
            message: 'text must contain letter only'
        }
    }
    const hasEmailAddress = function (str) {
        return {
            isValid: /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(str),
            message: 'text must be a valid email address'
        }
    }

    const areEqual = function (str1, str2) {
        return {
            isValid: str1 === str2,
            message: 'The passwords are not the same, please try again.'
        }
    }

    return {
        isNotEmpty: isNotEmpty,
        lengthLeast8: lengthLeast8,
        hasLetter: hasLetter,
        hasEmailAddress: hasEmailAddress,
        areEqual: areEqual
    }
})();

const validateInput = (inputElement, validateFunc) => {
    let errorElement = inputElement.nextElementSibling; // the error message div
    let v = validateFunc(inputElement.value.trim()); // call the validation function
    errorElement.innerHTML = v.isValid ? '' : v.message; // display the error message
    v.isValid ? inputElement.classList.remove("is-invalid") : inputElement.classList.add("is-invalid");
    return v.isValid;
}

const validateRegisterForm = (emailElm, fNameElem, lNameElem) => {
    let v1 = validateInput(fNameElem, validatorModule.isNotEmpty) && validateInput(fNameElem, validatorModule.hasLetter);
    let v2 = validateInput(lNameElem, validatorModule.isNotEmpty) && validateInput(lNameElem, validatorModule.hasLetter);
    let v3 = validateInput(emailElm, validatorModule.isNotEmpty) && validateInput(emailElm, validatorModule.hasEmailAddress);
    return v1 && v2 && v3;
}

function passwordRegistration(event) {
    event.preventDefault();
    let password1 = document.getElementById('password1');
    let password2 = document.getElementById('password2');
    let v1 = validateInput(password1, validatorModule.lengthLeast8);
    let v2 = validateInput(password2, validatorModule.lengthLeast8);
    if (v1 && v2) {
        let v3 = validatorModule.areEqual(password1.value.trim(), password2.value.trim());
        if (!v3.isValid) {
            password2.nextElementSibling.innerHTML = v3.message;
            password2.classList.add("is-invalid")
        } else{

        } //event.target.submit();
    }
}

function detailsRegistration(event) {
    event.preventDefault();
    let emailInput = document.getElementById("emailInput");
    let v = validateRegisterForm(emailInput, document.getElementById("fNameInput"),
        document.getElementById("lNameInput"));
    if (v) {
        fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": emailInput.value.trim()
            })
        }).then(function (response) {
            return response.json();
        }).then(function (ok) {
            if (ok)
                event.target.submit();
            else {
                const duplicateMessage = "this email is already in use, please choose another one";
                emailInput.nextElementSibling.innerHTML = duplicateMessage;
                emailInput.classList.add("is-invalid")
            }
        })
            .catch(function (error) {
                console.log(error);
            });
    }
}


     document.addEventListener("DOMContentLoaded", function () {

        document.getElementById("registerForm")?.addEventListener("submit", detailsRegistration);
         document.getElementById("passwordForm")?.addEventListener("submit", passwordRegistration);
});

