import '../content/css/newProfilePic.css';
import { baseUserEndpoint, baseImgurEndpoint, imgurClientId } from '../utils/api';
import { getLoggedInUserIdFromChromeStorage, getLoggedInEmailFromChromeStorage } from '../utils/userAuth';

const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/json';
const backBtn = document.getElementById('go-back');

backBtn.addEventListener('click', function() {
    window.location = "../popupMenu/popupMenu.html";
});

async function readUserDetails(email) {
    let res = {};
    try {
        const response = await axios.get(
            baseUserEndpoint, {
                params: {
                    user_email: email
                }
            });
        res = response.data;
    } catch (e) {
        console.log("Error reading the data . " + e)
    }
    return res;
}

async function generatePage() {
    const user_email = await getLoggedInEmailFromChromeStorage();
    const imgRed = await readUserDetails(user_email);
    const img = imgRed[0].img;
    setImg(img);
    const imgUploadButton = document.querySelector("#imgur-upload");
    imgUploadButton.addEventListener("change", uploadImgToImgur);
}

async function uploadImgToImgur(event) {
    const authHeader = {
        'Authorization': imgurClientId
    };
    const imgFile = event.target.files[0];
    const requestFormData = new FormData();
    requestFormData.append('image', imgFile);
    try {
        const imgurResponse = await axios.post(
            baseImgurEndpoint,
            requestFormData, { headers: authHeader });
        const newImgUrl = imgurResponse.data.data.link;
        //Change current img src
        setImg(newImgUrl);
        await uploadImgToDb(newImgUrl);
    } catch (e) {
        console.log(e);
    }
}

async function uploadImgToDb(imgUrl) {
    try {
        const userId = await getLoggedInUserIdFromChromeStorage();
        await axios.put(
            `${baseUserEndpoint}/updateImgByUserId`, { user_id: userId, img: imgUrl }
        );
    } catch (e) {
        console.log(e);
    }
}

function setImg(imgUrl) {
    const imgPlace = document.querySelector("#current-picture");
    imgPlace.setAttribute("src", imgUrl);
}

async function setPageElements() {
    await generatePage()
}

addEventListener('DOMContentLoaded', setPageElements);