export default class UserService {

    static myInstance = null;


    static getInstance() {
        if (UserService.myInstance == null) {
            UserService.myInstance =
                new UserService();
        }
        return this.myInstance;
    }

    //--------------------------------------------------------------------


    createUser = (user) => {
        let pathSplit = window.location.href.split("/");
        let host = pathSplit[2];
        let fetchHost;
        if (host === "localhost:3000") {
            fetchHost = "http://localhost:8080"
        } else {
            fetchHost = "https://wbdv-server-as4.herokuapp.com"
        }

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
        let pathSplit = window.location.href.split("/");
        let host = pathSplit[2];
        let fetchHost;
        if (host === "localhost:3000") {
            fetchHost = "http://localhost:8080"
        } else {
            fetchHost = "https://wbdv-server-as4.herokuapp.com"
        }

        return fetch(`${fetchHost}/api/users/${userId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
    };

    //--------------------------------------------------------------------

    findAllUsers = () => {

        let pathSplit = window.location.href.split("/");
        let host = pathSplit[2];
        let fetchHost;
        if (host === "localhost:3000") {
            fetchHost = "http://localhost:8080"
        } else {
            fetchHost = "https://wbdv-server-as4.herokuapp.com"
        }


        return fetch(`${fetchHost}/api/users`)
            .then(response => response.json());
    };

    //--------------------------------------------------------------------

    findUserById = (userId) => {
        let pathSplit = window.location.href.split("/");
        let host = pathSplit[2];
        let fetchHost;
        if (host === "localhost:3000") {
            fetchHost = "http://localhost:8080"
        } else {
            fetchHost = "https://wbdv-server-as4.herokuapp.com"
        }

        return fetch(`${fetchHost}/api/users/${userId}`)
            .then(response => response.json());
    };

    //--------------------------------------------------------------------

    updateUser = (user) => {

        let pathSplit = window.location.href.split("/");
        let host = pathSplit[2];
        let fetchHost;
        if (host === "localhost:3000") {
            fetchHost = "http://localhost:8080"
        } else {
            fetchHost = "https://wbdv-server-as4.herokuapp.com"
        }

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

        let pathSplit = window.location.href.split("/");
        let host = pathSplit[2];
        let fetchHost;
        if (host === "localhost:3000") {
            fetchHost = "http://localhost:8080"
        } else {
            fetchHost = "https://wbdv-server-as4.herokuapp.com"
        }

        return fetch(`${fetchHost}/api/profile/${profileId}`)
            .then(response => response.json())
    };

}