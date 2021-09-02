module.exports = (value, modulo, result, options) => {
    if (value % modulo === result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
};