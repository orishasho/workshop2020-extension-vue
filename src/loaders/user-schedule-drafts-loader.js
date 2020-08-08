const axios = require('axios');
const userScheduleDraftBaseApiUrl = 'http://localhost:8080/user_schedule_drafts';

axios.defaults.headers.post['Content-Type'] = 'application/json';

export default class UserScheduleDraftsLoader {

    async getLoggedInUserIdFromChromeStorage() {
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

    async getUserScheduleDraftNames() {
        try {
            const loggedUserId = await this.getLoggedInUserIdFromChromeStorage();
            const response = await axios.get(`${userScheduleDraftBaseApiUrl}/allNames?user_id=${loggedUserId}`);
            const userScheduleDraftNames = response.data;
            return userScheduleDraftNames;
        } catch (e) {
            console.log(e);
        }
    }

    async getUserScheduleDraftByName(draft_name) {
        try {
            const loggedUserId = await this.getLoggedInUserIdFromChromeStorage();
            const response = await axios.get(`${userScheduleDraftBaseApiUrl}/byName?user_id=${loggedUserId}&draft_name=${draft_name}`);
            const userScheduleDrafts = response.data;
            return userScheduleDrafts;
        } catch (e) {
            console.log(e);
        }
    }

    async storeDraft(draft_name, draft) {
        try {
            const loggedUserId = await this.getLoggedInUserIdFromChromeStorage();
            const response = await axios.post(
                `${userScheduleDraftBaseApiUrll}/all`, { user_id: loggedUserId, draft_name: draft_name, draft: draft }
            );
            //TODO: handle response properly
            console.log("going to send this...");
            console.log(response);
        } catch (error) {
            //TODO: handle errors properly
            console.log(error);
        }
    }

}