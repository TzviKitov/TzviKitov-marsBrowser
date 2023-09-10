"use strict";

/**
 * A module that Responsible for dealing with images: all different types of views in html,
 * as well as managing all references to the database of saved images
 * @type {{}}
 */
const imagesModule = (function () {

    const savedImgToHtmlUl = function (image) {
        return `
              <li class="saveImage"> 
                  image id:<a href= "${image.img_src}"  target="_blank" class="imageId">${image.imgID}</a>
                   <button type="button" class="btn btn-outline-danger">x</button><br>
                  Earth date: ${image.earth_date}, Sol: ${image.sol}, Camera: ${image.camera.name}</li>`;
    }

    /**
     * carousel string for display in HTML
     * @param image  Image object received from NASA server - assumes img is not null or undefined
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
     * @param image - Image object received from NASA server - assumes img is not null or undefined
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

    /**
     * A function that listens to the delete button ('x) of 1 images
     * @param event
     */
    const deleteListener = (event) => {
        let imgID = event.target.previousElementSibling.textContent;
        deleteImage(imgID);
        event.target.parentElement.remove();
    }

    /**
     * Add an image to the DB of saved images.
     * In case an offline user tries to access the database (error code "7"), the function blocks access and redirects it to the login page
     * @param image - Image object received from NASA server - assumes img is not null or undefined
     */
    const save = function (image) {
        let loadingElm = document.getElementById("loadingGif");
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
            if(res==7)
                document.getElementById("referLoginPage").submit();
        }).catch(function (error) {
            error.json;
            console.log(error);
        }).finally(function () {
            loadingElm.classList.add('d-none');
        });
    }

    /**
     * A function that addresses the server to delete a single image from the database.
     * In case an offline user tries to access the database (error code "7"), the function blocks access and redirects it to the login page
     * @param imgID from event-target.
     */
    const deleteImage = function (imgID) {
        let loadingElm = document.getElementById("loadingGif");
        loadingElm.classList.remove('d-none');
        fetch("/logged/api/image/delete/" + imgID.toString())
            .then(function (response) {
                return response.json();
            }).then(function (res) {
            if(res==7)
                document.getElementById("referLoginPage").submit();
        }).catch(function (error) {
            error.json;
        }).finally(function () {
            loadingElm.classList.add('d-none');
        });
    }

    /**
     *The function handles the click of a button to delete all the saved images. It clears the page and turns to the server to clear the database.
     In case an offline user tries to access the database (error code "7"), the function blocks access and redirects it to the login page.
     */
    const deleteAllImage = function () {
        let savedImagesOl = document.getElementsByClassName('saveImage');
        let loadingElm = document.getElementById("loadingGif");
        loadingElm.classList.remove('d-none');
        fetch("/logged/api/allImages/delete")
            .then(function (response) {
                return response.json();
            }).then(function (res) {
            if(res==7)
                document.getElementById("referLoginPage").submit();
           else if (res)
                for (let i = savedImagesOl.length - 1; i >= 0; i--)
                    savedImagesOl[i].remove();
        }).catch(function (error) {
            error.json;
        }).finally(function () {
            loadingElm.classList.add('d-none');
        });
    }

    /**
     * Finds if an identified image already exists in the saved image list
     * @param myImgID - string of img id from text content of image HTML card
     * @returns {*} - Returns a Boolean variable that indicates if the image is already on the page
     */
    const search = function (myImgID) {
        let idNumbers = document.getElementsByClassName('imageId');
        for (const id of idNumbers) {
            if (Number(id.textContent) === Number(myImgID)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Displays the saved images of the user from the response received from the server (database), immediately after logging in to the site.
     *  In case an offline user tries to access the database (error code "7"), the function blocks access and redirects it to the login page.
     */
    const viewSavedImages = function () {
        let savedShowElm = document.getElementById('savedShow');
        let loadingElm = document.getElementById("loadingGif");
        loadingElm.classList.remove('d-none');
        fetch('/logged/api/allImages')
            .then(function (response) {
                return response.json();
            }).then(function (images) {
            if(images==7)
                document.getElementById("referLoginPage").submit();
        else if (images)
                for (const image of images) {
                    savedShowElm.children[4].insertAdjacentHTML('beforeend', savedImgToHtmlUl(image));//ol element inr savedShowElm
                    savedShowElm.children[4].lastElementChild.addEventListener('click', deleteListener);
                }
        }).catch(function (error) {
            error.json;
        }).finally(function () {
            loadingElm.classList.add('d-none');
        });
    }
    /**
     * Displays in the carousel the saved images of the user from the answer received from the server (database).
     * In case an offline user tries to access the database (error code "7"), the function blocks access and redirects it to the login page.
     */
    const viewCarouselImages = function () {
        let carouselElm = document.getElementById("carouselInner");
        let loadingElm = document.getElementById("loadingGif");
        loadingElm.classList.remove('d-none');
        fetch('/logged/api/allImages')
            .then(function (response) {
                return response.json();
            }).then(function (images) {
            if(images==7)
                document.getElementById("referLoginPage").submit();
            else if (images)
                for (let i = 0; i < images.length; i++) {
                    carouselElm.insertAdjacentHTML('beforeend', imgToHtmlCarousel(images[i]));
                    if (i == 0)
                        carouselElm.firstElementChild.classList.add('active');
                }
        }).catch(function (error) {
            error.json;
        }).finally(function () {
            loadingElm.classList.add('d-none');
        });
    }
    /**
     * Deletes the carousel photos from the page
     */
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
        saveBtn.addEventListener('click', (ev) => {
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
        appendImgElem: appendImgElem,
        viewSavedImages: viewSavedImages,
        deleteAllImage: deleteAllImage,
        viewCarouselImages: viewCarouselImages,
        stopCarouselImages: stopCarouselImages
    };
})();


(function () {
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
        v1 = utilitiesModule.validateInput(dateInput, validatorModule.isNotEmpty)
        if (v1)
            v2 = utilitiesModule.validateInput(dateInput, validatorModule.hasDateFormat);
        if (v2)
            v3 = utilitiesModule.validateInput(dateInput, validatorModule.isDate);
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

        document.getElementById("clearBtn").addEventListener("click", clearAll);
        document.getElementById("deleteSavesBtn").addEventListener("click", imagesModule.deleteAllImage);
        document.getElementById("startSlideBtn").addEventListener("click", imagesModule.viewCarouselImages);
        document.getElementById("stopSlideBtn").addEventListener("click", imagesModule.stopCarouselImages);

        document.getElementById("searchForm").addEventListener("submit", (event) => {
            const manifestServerError ='NASA servers are not available right now! please try again later';
            const searchServerError ='NASA servers are not available to searching right now! please try to search again later';
            const notImages= 'No photos found!';
            clearAll();
            event.preventDefault();
            let imagesShowElm = document.getElementById("imagesShow");
            let savedShowElm = document.getElementById('savedShow');
            let dateInput = document.getElementById("dateInput");
            let selectCamera = document.getElementById("SelectCameraInput");
            let selectRover = document.getElementById("SelectRoverInput");
            let loadingElm = document.getElementById("loadingGif");
            let vCamera = utilitiesModule.validateInput(selectCamera, validatorModule.isNotEmpty);
            let vRover = utilitiesModule.validateInput(selectRover, validatorModule.isNotEmpty);
            //If there is no ROVER or an incorrect date there is no point in continuing to contact the server For the manifestos,
            //But if Rover is selected (even if no camera is selected), contact the server for Rover's dates to update a possible error on the entered date.
            if (!(baseValidateDate(dateInput) && vRover)) return;
            const params = new URLSearchParams();
            params.append('sol', dateInput.value.trim());
            params.append('camera', selectCamera.value);
            params.append('api_key', 'RQq5lNhl9KkkjUMZwqObwLCYrMZOLaAHhd7lRSkN');
            loadingElm.classList.remove('d-none');
            fetch('https://api.nasa.gov/mars-photos/api/v1/manifests/' + selectRover.value + '?api_key=RQq5lNhl9KkkjUMZwqObwLCYrMZOLaAHhd7lRSkN')
                .then(utilitiesModule.status)
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
                        .then(utilitiesModule.status)
                        .then(res => res.json())
                        .then(json => {
                            if (json.photos.length > 0)
                                for (const img of json.photos)
                                    imagesModule.appendImgElem(img, imagesShowElm, savedShowElm);
                            else
                                generalError(notImages);//The error string is a single use, and is sent as a parameter to a function that displays the errors
                        })
                        .catch(function (err) {
                            generalError(searchServerError);
                        }).finally(function () {
                    })
                }
            })
                .catch(function (err) {
                    generalError(manifestServerError);
                }).finally(function () {
                loadingElm.classList.add('d-none');
            })
        })
    })
})();
