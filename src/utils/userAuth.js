export async function getLoggedInUserIdFromChromeStorage() {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get('loggedUserId', function(value) {
                resolve(value.loggedUserId);
            })
        } catch (ex) {
            reject(ex);
        }
    });
}

export async function getLoggedInEmailFromChromeStorage() {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get('loggedEmail', function(value) {
                resolve(value.loggedEmail);
            })
        } catch (ex) {
            reject(ex);
        }
    });
}