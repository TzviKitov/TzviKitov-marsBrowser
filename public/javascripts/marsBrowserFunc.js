/* your JS code here */
"use strict";
/**
 * Module for all String validations and selections - before searching the images on the server
 * @type {{isManifestsDate: ((function(*, *=): ({isValid: boolean, message: string}))|*), hasDateFormat: (function(*=): {isValid, message: string}), isDate: (function(*=): {isValid, message: string}), isNotEmpty: (function(*): {isValid: boolean, message: string})}}
 */
const validatorModule = (function () {
    /**checks if a string is empty - assumes str is not null or undefined
     * @param str - the input string
     * @returns {{isValid: boolean, message: string}} - a boolean and message ins case validation failed
     */
    const isNotEmpty = function (str) {
        return {
            isValid: (str.length !== 0),
            message: 'input is required here'
        };
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
        hasDateFormat: hasDateFormat,
        isDate: isDate,
        isManifestsDate: isManifestsDate
    }
})();

/**
 * A module that contains 2 classes: one manages the display of the images in HTML and the management of a list of saved images.
 * The second class contains an image with all its details and the view of an image saved in HTML.
 * @type {{}}
 */
const imagesModule = (function () {


//Detailed image department for saving and displaying the details

//Returns a string to display the class image in HTML according to the class information
    const savedImgToHtmlUl = function (image) {
        return `
              <li class="saveImage"> 
                  image id:<a href= "${image.img_src}"  target="_blank" class="imageId">${image.imgID}</a>
                   <button type="button" class="btn btn-outline-danger">x</button><br>
                  Earth date: ${image.earth_date}, Sol: ${image.sol}, Camera: ${image.camera.name}</li>`;
    }

    /**
     * Class for displaying an images in HTML and managing a list of saved images and carousel
     * @type {classes.listManager}
     */


    /**
     * carousel string for display in HTML
     * @param img  Image object received from NASA server - assumes img is not null or undefined
     * @returns {string} Returns a string to display
     */
    const imgToHtmlCarousel = function (image) {
        return `
             <div class="carousel-item">
                <img src="${image.img_src}" class="d-block w-100" alt="...">
                 <div class="carousel-caption d-none d-md-block">
                     <h5>NAVCAM</h5>
                     <p>${image.earth_date}</p>
                     <p>${image.imgID}</p>
                     <a href= "${image.img_src}" class="btn btn-primary" target="_blank">Fule size</a>
                 </div>
              </div>`;
    }

    /**
     *  card for display image in HTML
     * @param img - Image object received from NASA server - assumes img is not null or undefined
     * @returns {string} Returns a string to display
     */
    const imgToHtmlCard = function (image) {
        return `
            <div class="col imageCard">
               <div class="card" style="width: 18rem;">
                  <img src="${image.img_src}" class="card-img-top" alt="mars img">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item d-none">${image.id}</li>
                    <li class="list-group-item">Earth date: ${image.earth_date}</li>
                    <li class="list-group-item">Sol: ${image.sol}</li>
                    <li class="list-group-item">Camera: ${image.camera.name}</li>
                    <li class="list-group-item">Mission: ${image.rover.name}</li>
                  </ul>
                  <div class="card-body">
                     <button class="btn btn-primary">Save</button>
                     <a href= "${image.img_src}" class="btn btn-primary" target="_blank">Fule size</a>
                  </div>
                </div>
            </div>`;
    }


    const deleteListener = (event) => {
        let imgID = event.target.previousElementSibling.textContent;
        deleteImage(imgID);
        event.target.parentElement.remove();
    }

    /**
     * Add an image to the DB of saved images
     * @param img - Image object received from NASA server - assumes img is not null or undefined
     */
    const save = function (image) {
        let loadingElm = document.getElementById("loadingGif");

        //this.savedList.push(new imagesModule.image(img));
        console.log("11111111111111111111111111111111111");
        loadingElm.classList.remove('d-none');
        fetch("/logged/api/image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(image)
        }).then(function (response) {
            return response.json();
        }).then(function (res) {
            if(res==7) {
                console.log("******** in")
                document.getElementById("referLoginPage").submit();
            }
            console.log(res);

        }).catch(function (error) {
            error.json;
            if(error==='1')
                document.getElementById('referLoginPage').click();
        }).finally(function () {
            loadingElm.classList.add('d-none');
        });
    }


    //const params = new URLSearchParams();
    //             params.append('sol', dateInput.value.trim());
    const deleteImage = function (imgID) {
        // const params = new URLSearchParams();
        //params.append('imgID', imgID.toString());
        let loadingElm = document.getElementById("loadingGif");

        loadingElm.classList.remove('d-none');
        fetch("/logged/api/image/delete/" + imgID.toString())
            .then(function (response) {
                return response.json();
            }).then(function (res) {
            console.log(res);
            if(res==7) {
                console.log("******** in")
                document.getElementById("referLoginPage").submit();
            }
        }).catch(function (error) {
            //if(error==='1')
              //  document.getElementById('referLoginPage').click();
            console.log("not delete image");

        }).finally(function () {
            loadingElm.classList.add('d-none');
        });
    }

    const deleteAllImage = function () {
        let savedImagesOl = document.getElementsByClassName('saveImage');
        let loadingElm = document.getElementById("loadingGif");

        loadingElm.classList.remove('d-none');
        fetch("/logged/api/allImages/delete")
            .then(function (response) {
                return response.json();
            }).then(function (res) {
            if(res==7) {
                console.log("******** in")
                document.getElementById("referLoginPage").submit();
            }
           else if (res)
                for (let i = savedImagesOl.length - 1; i >= 0; i--)
                    savedImagesOl[i].remove();
        }).catch(function (error) {
            error.json;
            if(error==='1')
                document.getElementById('referLoginPage').click();
            console.log("not delete image");
        }).finally(function () {
            loadingElm.classList.add('d-none');
        });

    }

    /**
     * Finds if an identified image already exists in the saved image list
     * @param myImgID - string of img id from text content of image HTML card
     * @returns {*} - returns undefined if img not found (Or the image itself if found)
     */
    const search = function (myImgID) {
        //return this.savedList.find((img) => img.id == myImgID);
        let idNumbers = document.getElementsByClassName('imageId');
        for (const id of idNumbers) {
            //console.log("****11111  " + Number(id.textContent) + ',  ' + Number(myImgID));
            if (Number(id.textContent) === Number(myImgID)) {
                //console.log("****222222  " + Number(id.textContent) + ',  ' + Number(myImgID))
                //console.log("****  same!!!!!!!!!!!!11");
                return true;
            }
        }
        return false;
        //  .find((img) => img.children[1].textContent == myImgID)
    }

    const viewSavedImages = function () {
        let savedShowElm = document.getElementById('savedShow');
        let loadingElm = document.getElementById("loadingGif");

        loadingElm.classList.remove('d-none');
        fetch('/logged/api/allImages')
            //.then(status)
            // .then(function (response) {
            .then(function (response) {
                return response.json();
            }).then(function (images) {
            if(images==7) {
                console.log("******** in")
                document.getElementById("referLoginPage").submit();
            }
        else if (images)
                for (const image of images) {
                    savedShowElm.children[4].insertAdjacentHTML('beforeend', savedImgToHtmlUl(image));//ol element inr savedShowElm
                    savedShowElm.children[4].lastElementChild.addEventListener('click', deleteListener);
                }//console.log('');
        }).catch(function (error) {
            error.json;
            if(error==='1')
                document.getElementById('referLoginPage').click();
            console.log(error);
        }).finally(function () {
            loadingElm.classList.add('d-none');
        });
    }

    const viewCarouselImages = function () {
        let carouselElm = document.getElementById("carouselInner");
        let loadingElm = document.getElementById("loadingGif");

        loadingElm.classList.remove('d-none');
        fetch('/logged/api/allImages')
            //.then(status)
            // .then(function (response) {
            .then(function (response) {
                return response.json();
            }).then(function (images) {
            if(images==7) {
                console.log("******** in")
                document.getElementById("referLoginPage").submit();
            }
            else if (images)
                for (let i = 0; i < images.length; i++) {          //Displays the carousel images from the data structure "listManager.savedList"
                    carouselElm.insertAdjacentHTML('beforeend', imgToHtmlCarousel(images[i]));
                    if (i == 0)
                        carouselElm.firstElementChild.classList.add('active');
                }
        }).catch(function (error) {
            error.json;
            if(error==='1')
                document.getElementById('referLoginPage').click();
            console.log(error);
        }).finally(function () {
            loadingElm.classList.add('d-none');
        });
    }

   const  stopCarouselImages= function (){
       let carouselElm = document.getElementById("carouselInner");
        for (let i = carouselElm.children.length - 1; i >= 0; i--)
            carouselElm.children[i].remove();
    }

    /**
     * View an image in HTML and connect the save button,
     * @param img - Image object received from NASA server - assumes img is not null or undefined
     * @param imagesShowElm - HTML element of image cards
     * @param savedShowElm - HTML element of  saved image list
     */
    const appendImgElem = function (image, imagesShowElm, savedShowElm) {
        imagesShowElm.insertAdjacentHTML('beforeend', imgToHtmlCard(image));
        image.imgID = image.id;
        let saveBtn = imagesShowElm.lastElementChild.firstElementChild.children[2].children[0];
        //let imgID =image.id;
        // Listening function, to the save button. If the image is not saved it will be saved in the list and displayed on the page, if already saved it will run the error message
        saveBtn.addEventListener('click', (ev) => {
            // let imgID = ev.target.parentElement.parentElement.children[1].children[0].textContent; // the ID from the Of the image card you clicked on
            if (!search(image.id)) {
                save(image);
                savedShowElm.children[4].insertAdjacentHTML('beforeend', savedImgToHtmlUl(image));//ol element inr savedShowElm
                savedShowElm.children[4].lastElementChild.addEventListener('click', deleteListener);
            } else {
                document.getElementById("duplicateMessage").click();
            }
        });
    }

    return {
        //imgToHtmlCarousel: imgToHtmlCarousel,
        appendImgElem: appendImgElem,
        viewSavedImages: viewSavedImages,
        deleteAllImage: deleteAllImage,
        viewCarouselImages: viewCarouselImages,
        stopCarouselImages: stopCarouselImages
    };
})();

//general closer
(function () {
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
     *Displays general errors on the page, (server communication or no images)
     * @param str - The particular error theorem - assumes str is not null or undefined
     */
    function generalError(str) {
        let errorElement = document.getElementById("gError");
        errorElement.innerHTML = str;
    }

    /**
     * Performs basic validation of the date (blank input, format and date validity) in a graded and conditional manner
     * @param dateInput - string input date - assumes str is not null or undefined
     * @returns {boolean|*|boolean} - if the input is valid
     */
    function baseValidateDate(dateInput) {
        let v1 = false, v2 = false, v3 = false;
        v1 = validateInput(dateInput, validatorModule.isNotEmpty)
        if (v1)
            v2 = validateInput(dateInput, validatorModule.hasDateFormat);
        if (v2)
            v3 = validateInput(dateInput, validatorModule.isDate);
        return v1 && v2 && v3;
    }

    /**
     * hecks the date input element if Suitable for manifests dates returns whether valid or places a message marked on the input page
     * @param manifests - from Nasa server
     * @param dateInput - from validatorModule
     * @returns {boolean|*} - if the input is valid
     */
    function validateManifests(manifests, dateInput) {
        let errorElement = dateInput.nextElementSibling; // the error message div
        let v = validatorModule.isManifestsDate(manifests, dateInput.value.trim());
        errorElement.innerHTML = v.isValid ? '' : v.message; // display the error message
        v.isValid ? dateInput.classList.remove("is-invalid") : dateInput.classList.add("is-invalid");
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

    /** Clears: All errors, input markings, and image cards already found */
    const clearAll = () => {
        document.querySelectorAll(".is-invalid").forEach((e) => e.classList.remove("is-invalid"));
        document.querySelectorAll(".errormessage").forEach((e) => e.innerHTML = "");
        let imagesCard = document.getElementById("imagesShow").children;
        for (let i = imagesCard.length - 1; i >= 0; i--)
            imagesCard[i].remove();
    }


    document.addEventListener('DOMContentLoaded', function () {
        imagesModule.viewSavedImages();
        //let listManager = new imagesModule.listManager();


        document.getElementById("clearBtn").addEventListener("click", clearAll);
        document.getElementById("deleteSavesBtn").addEventListener("click", imagesModule.deleteAllImage);
        document.getElementById("startSlideBtn").addEventListener("click", imagesModule.viewCarouselImages);
        document.getElementById("stopSlideBtn").addEventListener("click", imagesModule.stopCarouselImages);

        document.getElementById("searchForm").addEventListener("submit", (event) => {
            clearAll();
            event.preventDefault();
            let imagesShowElm = document.getElementById("imagesShow");
            let savedShowElm = document.getElementById('savedShow');
            let dateInput = document.getElementById("dateInput");
            let selectCamera = document.getElementById("SelectCameraInput");
            let selectRover = document.getElementById("SelectRoverInput");
            let loadingElm = document.getElementById("loadingGif");
            let vCamera = validateInput(selectCamera, validatorModule.isNotEmpty);
            let vRover = validateInput(selectRover, validatorModule.isNotEmpty);
            if (!(baseValidateDate(dateInput) && vRover)) return; //If there is no ROVER or an incorrect date there is no point in continuing to contact the server For the manifestos
            const params = new URLSearchParams();
            params.append('sol', dateInput.value.trim());
            params.append('camera', selectCamera.value);
            params.append('api_key', 'RQq5lNhl9KkkjUMZwqObwLCYrMZOLaAHhd7lRSkN');
            loadingElm.classList.remove('d-none');
            fetch('https://api.nasa.gov/mars-photos/api/v1/manifests/' + selectRover.value + '?api_key=RQq5lNhl9KkkjUMZwqObwLCYrMZOLaAHhd7lRSkN')
                .then(status)
                .then(res => res.json())
                .then(json => {
                    return {
                        landing_date: json.photo_manifest.landing_date,
                        max_date: json.photo_manifest.max_date,
                        max_sol: json.photo_manifest.max_sol
                    };
                }).then(manifests => {
                if (validateManifests(manifests, dateInput) && vCamera) { //Only if the date and also a camera is selected does it make sense to contact the server To search for images
                    fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/' + selectRover.value + '/photos?' + params.toString())
                        .then(status)
                        .then(res => res.json())
                        .then(json => {
                            //document.querySelector("#data").innerHTML = `Found ${json.collection.metadata.total_hits} images`; // remove the loading message
                            if (json.photos.length > 0)
                                for (const img of json.photos)
                                    imagesModule.appendImgElem(img, imagesShowElm, savedShowElm);
                            else
                                generalError('No photos found!');
                        })
                        .catch(function (err) {
                            generalError('22222NASA servers are not available right now! please try to search again later');
                        }).finally(function () {
                    })
                }
            })
                .catch(function (err) {
                    generalError('11111NASA servers are not available right now! please try again later');
                }).finally(function () {
                loadingElm.classList.add('d-none');
            })
        })
    })
})();
