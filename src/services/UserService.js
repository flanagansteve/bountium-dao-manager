let fetchHost = "http://localhost:8080";

if (window.location.href.includes("heroku")) {
    fetchHost = "https://bountium-user-server.herokuapp.com";
}

export default class UserService {

    static myInstance = null;


    static getInstance() {
        if (UserService.myInstance == null) {
            UserService.myInstance =
                new UserService();
        }
        return this.myInstance;
    }

    //=================================================================


    createUser = (user) => {

        return fetch(`${fetchHost}/api/users`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(response => response.json());
    };

    //--------------------------------------------------------------------

    deleteUser = (userId) => {

        return fetch(`${fetchHost}/api/users/${userId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
    };

    //--------------------------------------------------------------------

    findAllUsers = () => {

        return fetch(`${fetchHost}/api/users`)
            .then(response => response.json());
    };

    //--------------------------------------------------------------------

    findUserById = (userId) => {

        return fetch(`${fetchHost}/api/users/${userId}`)
            .then(response => response.json());
    };

    //--------------------------------------------------------------------

    updateUser = (user) => {

        let userId = user.id;

        return fetch(`${fetchHost}/api/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(response => response.json())
    };

    //===================================================================

    findOtherProfile = (profileId) => {

        return fetch(`${fetchHost}/api/profile/${profileId}`)
            .then(response => response.json())
    };

}