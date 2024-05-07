// modified FROM HW4

import bcrypt from 'bcrypt';

const encryptPassword = (password, callback) => {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) {
            callback(err, null); // Pass the error to the callback
            return;
        }
        callback(null, hash); // Pass null for error and hash if successful
    });
};

const isLoggedIn = (str) => {
    if (str == null)
        return false;
    for (var i = 0; i < str.length; i++) {
        if (!/[A-Za-z0-9 \.\?,_]/.test(str[i])) {
            return false;
        }
    }
    return true;
};

const isOK = (str) => {
    if (str == null)
        return false;
    for (var i = 0; i < str.length; i++) {
        if (!/[A-Za-z0-9 \.\?,_]/.test(str[i])) {
            return false;
        }
    }
    return true;
};

export default {
    encryptPassword,
    isOK,
    isLoggedIn,
};

