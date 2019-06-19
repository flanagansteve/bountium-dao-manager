export default class HTTPService {

    static myInstance = null;

    static getInstance() {
        if (HTTPService.myInstance == null) {
            HTTPService.myInstance =
                new HTTPService();
        }
        return this.myInstance;
    }

    //--------------------------------------------------------------------

    registerUser = (user) => {
        let pathSplit = window.location.href.split("/");
        let host = pathSplit[2];
        let fetchHost;
        if (host === "localhost:3000") {
            fetchHost = "http://localhost:8080"
        } else {
            fetchHost = "https://wbdv-server-as4.herokuapp.com"
        }

        return fetch(`${fetchHost}/api/register`, {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(response => response.json());
    };

    //--------------------------------------------------------------------

    loginUser = (user) => {
        let pathSplit = window.location.href.split("/");
        let host = pathSplit[2];
        let fetchHost;
        if (host === "localhost:3000") {
            fetchHost = "http://localhost:8080"
        } else {
            fetchHost = "https://wbdv-server-as4.herokuapp.com"
        }

        return fetch(`${fetchHost}/api/login`, {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(response => response.json());
    };

        //-------------------------------------------------------------------

    receiveSessionProfile = () => {
        let pathSplit = window.location.href.split("/");
        let host = pathSplit[2];
        let fetchHost;
        if (host === "localhost:3000") {
            fetchHost = "http://localhost:8080"
        } else {
            fetchHost = "https://wbdv-server-as4.herokuapp.com"
        }

        return fetch(`${fetchHost}/api/profile`, {
            credentials: 'include'
        }
    )
            .then(response => response.json());
    };

    //--------------------------------------------------------------------

    logOutUser = () => {
        let pathSplit = window.location.href.split("/");
        let host = pathSplit[2];
        let fetchHost;
        if (host === "localhost:3000") {
            fetchHost = "http://localhost:8080"
        } else {
            fetchHost = "https://wbdv-server-as4.herokuapp.com"
        }

        return fetch(`${fetchHost}/api/logout`, {
                credentials: 'include'
            }
        )
            .then(response => response.json());
    };
}