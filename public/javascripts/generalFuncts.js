"use strict";

/**
 * A module that counts validation functions for input in all forms of the program
 * @type {{hasLetter: (function(*=): {isValid: boolean, message: string}), areEqual: (function(*, *): {isValid: boolean, message: string}), isManifestsDate: ((function(*, *=): ({isValid: boolean, message: string}|{isValid: boolean}))|*), lengthLeast8: (function(*): {isValid: boolean, message: string}), hasDateFormat: (function(*=): {isValid, message: string}), isDate: (function(*=): {isValid, message: string}), isNotEmpty: (function(*): {isValid: boolean, message: string}), hasEmailAddress: (function(*=): {isValid: boolean, message: string})}}
 */
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
            message: 'text must contain (english) letters only'
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


const utilitiesModule =  (function () {

    /**
     * Checks an input element with a validated function, returns whether valid or places a message marked on the input page
     * @param inputElement - (date,rover or camera)
     * @param validateFunc - from validatorModule
     * @returns {boolean|*} if the input is valid
     */
    const validateInput = (inputElement, validateFunc) => {
        let errorElement = inputElement.nextElementSibling; // the error message div
        let v = validateFunc(inputElement.value.trim()); // call the validation function
        errorElement.innerHTML = v.isValid ? '' : v.message; // display the error message
        v.isValid ? inputElement.classList.remove("is-invalid") : inputElement.classList.add("is-invalid");
        return v.isValid;
    }

    /**
     * Checking communication errors with the server throws an error if the status is incorrect
     * @param response - promise object received from the server
     * @returns {Promise<never>|Promise<unknown>} - promise object received or status error
     */
    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }

    return {validateInput: validateInput, status: status}

})();
