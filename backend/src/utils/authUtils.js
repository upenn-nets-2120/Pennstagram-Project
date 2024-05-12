import bcrypt from 'bcrypt';

const encryptPassword = (password, callback) => {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, hash);
    });
};

const comparePassword = (password, hash, callback) => {
    bcrypt.compare(password, hash, function(err, isMatch) {
        if (err) {
            callback(err, false);
            return;
        }
        callback(null, isMatch);
    });
};

const isOK = (str) => {
    return str != null && /^[A-Za-z0-9 \.\?,_]+$/.test(str);
};

export default {
    encryptPassword,
    comparePassword,
    isOK,
};
