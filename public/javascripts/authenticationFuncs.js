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
    /**
     * checks if a string of date or sol input is a format YYYY-MM-DD or a non negative number SOL
     * @param str - the input string.  assumes str is not null or undefined
     * @returns {{isValid: (boolean|boolean), message: string}} - a boolean and message ins case validation failed
     */
    const hasDateFormat = function (str) {
        return {
            isValid: (!isNaN(Number(str)) && Number(str) > -1) || /^[0-9]{4}(-[0-9]{2}){2}$/.test(str),
            message: 'please enter a SOL number (Non-negative) or valid format date'
        }
    }
    /**
     * checks if a string of input date is a existing date (based on a JS DATE object)
     * @param str - the input string.  assumes str is not null or undefined
     * @returns {{isValid: boolean, message: string}} - a boolean and message ins case validation failed
     */
    const isDate = function (str) {
        return {
            isValid: !isNaN(Date.parse(str)),
            message: 'please enter a Sol number ,or valid date'
        }
    }
    /**
     * checks if a string of input date is in accordance with manifests images dates of NASA server
     * @param manifests - string date manifest Of the selected NASA rover assumes str is not null or undefined
     * @param str the input string.  assumes str is not null or undefined
     * @returns {{isValid: boolean, message: string}|{isValid: boolean}} - a boolean and message ins case validation failed (-if not valid, or only true if  is valid)
     */
    const isManifestsDate = function (manifests, str) {
        if (!isNaN(Number(str)))
            return {
                isValid: Number(str) <= Number(manifests.max_sol),
                message: `the mission you've selected requires a sol under ${manifests.max_sol}`
            };
        if (Number(Date.parse(str)) < Number(Date.parse(manifests.landing_date)))
            return {
                isValid: false,
                message: `the mission you've selected requires a date after ${manifests.landing_date}`
            };
        if (Number(Date.parse(str)) > Number(Date.parse(manifests.max_date)))
            return {
                isValid: false,
                message: `the mission you've selected requires a date before ${manifests.max_date}`
            };
        return {isValid: true};
    }

    return {
        isNotEmpty: isNotEmpty,
        lengthLeast8: lengthLeast8,
        hasLetter: hasLetter,
        hasEmailAddress: hasEmailAddress,
        areEqual: areEqual,
        hasDateFormat: hasDateFormat,
        isDate: isDate,
        isManifestsDate: isManifestsDate
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
   // let v1 = validateInput(password1, validatorModule.lengthLeast8);
    //let v2 = validateInput(password2, validatorModule.lengthLeast8);
    if (1/*v1 && v2*/) {
        let v3 = validatorModule.areEqual(password1.value.trim(), password2.value.trim());
        if (!v3.isValid) {
            password2.nextElementSibling.innerHTML = v3.message;
            password2.classList.add("is-invalid")
        } else {
            let formElem = event.target;
            formElem.submit();

        } //event.target.submit();
    }
}

function detailsRegistration(event) {
    const duplicateMessage = "this email is already in use, please choose another one";

    event.preventDefault();
    let emailInput = document.getElementById("emailInput");
    let fNameInput = document.getElementById("fNameInput");
    let lNameInput = document.getElementById("lNameInput");
    let v = validateRegisterForm(emailInput, fNameInput, lNameInput);
    if (v) {
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
        }).then(function (response) {
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
            });
    }
}

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("registerForm")?.addEventListener("submit", detailsRegistration);
    document.getElementById("passwordForm")?.addEventListener("submit", passwordRegistration);
    //document.getElementById("passwordForm")?.addEventListener("submit", passwordRegistration);
});

// formElem.action = "/api/password";
// formElem.headers = {"Content-Type": "application/json"};
// formElem.body = JSON.stringify({"password": password1.value.trim()});


// fetch("/api/password", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//         "password": password1.value.trim()
//     })
// }).then(function (response) {
//     return response.json();
// }).then(function (ok) {
//     if(ok)event.target.submit();
//     else {event.target.action='/register';//console.log('not ok');
//         event.target.submit();}
// })
//     .catch(function (error) {
//         console.log(error);
//     });

