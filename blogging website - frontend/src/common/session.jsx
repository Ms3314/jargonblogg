const storeinSession = (key, value) => {
    sessionStorage.setItem(key, value);
};

const lookInSession = (key) => {
    return sessionStorage.getItem(key);
};

const removeFromSession = (key) => {
    sessionStorage.removeItem(key);
};

export { storeinSession, lookInSession, removeFromSession };