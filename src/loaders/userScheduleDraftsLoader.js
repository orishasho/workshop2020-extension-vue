import { baseUserScheduleDraftEndpoint } from '../utils/api';
import { getLoggedInUserIdFromChromeStorage } from '../utils/userAuth';

const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default class UserScheduleDraftsLoader {

    async getUserScheduleDraftNames() {
        try {
            const loggedUserId = await getLoggedInUserIdFromChromeStorage();
            const response = await axios.get(`${baseUserScheduleDraftEndpoint}/allNames?user_id=${loggedUserId}`);
            const userScheduleDraftNames = response.data;
            return userScheduleDraftNames;
        } catch (e) {
            console.log(e);
        }
    }

    async getUserScheduleDraftByName(draft_name) {
        try {
            const loggedUserId = await getLoggedInUserIdFromChromeStorage();
            const response = await axios.get(`${baseUserScheduleDraftEndpoint}/byName?user_id=${loggedUserId}&draft_name=${draft_name}`);
            const userScheduleDrafts = response.data;
            return userScheduleDrafts;
        } catch (e) {
            console.log(e);
        }
    }

    async storeDraft(draft_name, draft) {
        try {
            const loggedUserId = await getLoggedInUserIdFromChromeStorage();
            await axios.post(
                `${baseUserScheduleDraftEndpoint}/all`, { user_id: loggedUserId, draft_name: draft_name, draft: draft }
            );
        } catch (error) {
            console.log(error);
        }
    }

    async updateDraft(draft_name, draft) {
        try {
            const loggedUserId = await getLoggedInUserIdFromChromeStorage();
            await axios.put(
                `${baseUserScheduleDraftEndpoint}/byName`, { user_id: loggedUserId, draft_name: draft_name, draft: draft }
            );
        } catch (error) {
            console.log(error);
        }
    }

    async finalizeDraft(draft_name) {
        try {
            const loggedUserId = await getLoggedInUserIdFromChromeStorage();
            await axios.put(
                `${baseUserScheduleDraftEndpoint}/finalizeByName`, { user_id: loggedUserId, draft_name: draft_name }
            );
        } catch (error) {
            console.log(error);
        }
    }

}