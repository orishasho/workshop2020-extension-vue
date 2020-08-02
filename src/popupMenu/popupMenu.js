import '../content/css/popupMenu.css';

const logoutMenuItem = document.getElementById('logout-li');

function resize() {
    document.getElementById('body').style.width = document.getElementById('main-dropdown').style.width;
    document.getElementById('body').style.height = document.getElementById('main-dropdown').style.height;
}

function setMenu(loggedInEmail) {
    if (loggedInEmail != "") {
        //remove option of login
        const loginMenuItem = document.getElementById("login-li")
        if (loginMenuItem) {
            loginMenuItem.parentNode.removeChild(loginMenuItem);
        }
    } else {
        //remove option of logout
        const logoutMenuItem = document.getElementById("logout-li")
        if (logoutMenuItem) {
            logoutMenuItem.parentNode.removeChild(logoutMenuItem);
        }
    }
}

function refreshMeidaNet() {
    chrome.tabs.query({ status: 'complete' }, (tabs) => {
        tabs.forEach((tab) => {
            if (tab.url.match(/mtamn\.mta\.ac\.il/)) {
                console.log(tab.url);
                chrome.tabs.reload(tab.id);
            }
        });
    });
}


addEventListener('DOMContentLoaded', resize);

logoutMenuItem.addEventListener('click', (e) => {
    chrome.storage.sync.set({ 'loggedEmail': "", 'loggedUserId': "" }, function() {
        alert("התנתקת מהתוסף");
        refreshMeidaNet();
        window.close();
    })
});


let loggedInEmail = "";
chrome.storage.sync.get('loggedEmail', function(data) {
    loggedInEmail = data.loggedEmail;
    setMenu(loggedInEmail); // All your code is contained here, or executes later that this
});