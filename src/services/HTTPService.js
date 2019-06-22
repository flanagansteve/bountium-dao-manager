let fetchHost = "http://localhost:8080";

if (window.location.href.includes("heroku")) {
    fetchHost = "https://bountium-user-server.herokuapp.com";
}

// Services for HTTP management and creating new Users.
export default class HTTPService {

    static myInstance = null;

    static getInstance() {
        if (HTTPService.myInstance == null) {
            HTTPService.myInstance =
                new HTTPService();
        }
        return this.myInstance;
    }

    // ==================================================================

    // Register a new user with the HTTP and also creates a new User.
    registerUser = (user) => {

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

    // --------------------------------------------------------------------

    // Logs in a user to the HTTP for the website
    loginUser = (user) => {

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

    // Gets the current session user for profile activities
    receiveSessionProfile = () => {

        return fetch(`${fetchHost}/api/profile`, {
                credentials: 'include'
            }
        )
            .then(response => response.json());
    };

    //--------------------------------------------------------------------

    // Logs out the current HTTP user session
    logOutUser = () => {

        return fetch(`${fetchHost}/api/logout`, {
                credentials: 'include'
            }
        )
    };
}
