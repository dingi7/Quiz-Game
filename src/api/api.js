const appId = 'gaLDyBkRAncIn4FQu1FJer9r5AMp7MSfHsRnJgta'
const restAPIKey = '76N3IhMOvINAZiWUo2XqlXyKG0FcZ2cgl8LU4an7'
const masterKey = 'KHg5EIkyJzUNsBHfFghiTPX3hcXb354Sqg8edHju'

async function request(url, options) {
    try {
        // Send request with appropriate methods, headers and body (if any)
        const response = await fetch(url, options);

        // Handle errors
        if (response.ok == false) {
            const error = await response.json();
            throw new Error(error.message);
        }

        // Return result
        try {
            // Parse response (if needed)
            const data = await response.json();
            return data;

        } catch (err) {
            return response;
        }

    } catch (err) {
        alert(err.error);
        throw err;
    }
}

// Function that creates headers, bases on application state and body
function createOptions(method = 'get', body) {
    const options = {
        method,
        headers: {
            "X-Parse-Application-Id": appId,
            "X-Parse-REST-API-Key": restAPIKey,
            "X-Parse-Master-Key": masterKey,
            "X-Parse-Revocable-Session": 1
        }
    }
    
    const user = sessionStorage.authToken;
    if (user) {
        options.headers['X-Parse-Session-Token'] = user;
    }

    if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    return options;
}

// Decorator function for all REST methods
export async function get(url) {
    return await request(url, createOptions());
}

export async function post(url, data) {
    return await request(url, createOptions('post', data));
}

export async function put(url, data) {
    return await request(url, createOptions('put', data));
}

export async function del(url) {
    return await request(url, createOptions('delete'));
}

// Authentication function (login/register/logout)
export async function login(username, password) {
    const result = await post('https://parseapi.back4app.com/login', { username , password });
    setUserData(result);
    return result;
}

export async function register(username, email, password) {
    const result = await post('https://parseapi.back4app.com/users', { username, email, password });
    setUserData(result);
    return result;
}

export function logout() {
    const result = post('https://parseapi.back4app.com/logout');
    clearUserData(); 
    return result;
}

export function setUserData(data) {
    sessionStorage.setItem('authToken', data.sessionToken);
    sessionStorage.setItem('userId', data.objectId);
    sessionStorage.setItem('username', data.username);
    sessionStorage.setItem('email', data.email)
}

export function clearUserData(){
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
}