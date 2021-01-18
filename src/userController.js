const usersDataKey = "mining_tracker.users"
const currentUserKey = "mining_tracker.user";


export default class UserController {
    constructor()
    {
        var userData = localStorage.getItem(usersDataKey);
        if(userData)
        {
          this.users = JSON.parse(userData);
        }
        else {
          this.users = [];
        }
    }

    storeUser(userName)
    {
        this.users.push(userName)
        localStorage.setItem(usersDataKey, JSON.stringify(this.users));
    }

    hasUser(userName)
    {
        return this.users.includes(userName);
    }

    setUser(userName)
    {
        localStorage.setItem(currentUserKey, userName);
    }

    removeUser(userName)
    {
        const index = this.users.indexOf(userName);
        if(index > -1) {
            this.users.splice(index, 1);
        }
        localStorage.setItem(usersDataKey, JSON.stringify(this.users));
        // clear out
        localStorage.removeItem(currentUserKey);
    }

    getCurrentUser()
    {
        return localStorage.getItem(currentUserKey);
    }

    getUsers() {
        return this.users;
    }
}
