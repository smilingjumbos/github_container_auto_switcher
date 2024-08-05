/* This Source Code Form is subject to the terms of the Mozilla Public
 - License, v. 2.0. If a copy of the MPL was not distributed with this
 - file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* based on https://github.com/mdn/webextensions-examples/blob/master/contextual-identities/context.js */

function localStorageRead(key) {
    const value = localStorage.getItem(key);

    return value === null ? false : value;
}

function localStorageWrite(key, value) {
    return localStorage.setItem(key, value);
}

function localStorageClear() {
    localStorage.clear();

    return true;
}

function getGithubContainer(root) {
    browser.contextualIdentities.query({}).then((identities) => {
        if (!identities.length) {
            root.innerText = "No container identities available.";
            return;
        }

        root.innerHTML = "";

        for (let identity of identities) {
            const button = document.createElement("a");
            let icon = document.createElement("span");
            const span = document.createElement("span");
            const br = document.createElement("br");

            let colorType = "color";
            if (identity.hasOwnProperty("iconUrl")) {
                icon.style.mask = `url(${identity.iconUrl}) center / contain no-repeat`;
                colorType = "background";
            } else {
                icon.innerHTML = "&#11044";
            }
            icon.className = "icon";
            if (identity.hasOwnProperty("colorCode")) {
                icon.style[colorType] = identity.colorCode;
            } else {
                icon.style[colorType] = identity.color;
            }

            span.className = "identity";
            span.innerText = identity.name;

            button.addEventListener("click", () => {
                localStorageWrite("githubContainer", JSON.stringify(identity));

                githubContainer = identity;

                if (!githubKey) {
                    getGithubKey(root);
                } else {
                    showChosenPrefs(root, githubContainer);
                }
            });

            button.appendChild(icon);
            button.appendChild(span);
            button.appendChild(br);

            root.appendChild(button);
        }
    });
}

function getGithubKey(root) {
    browser.contextualIdentities.query({}).then((identities) => {
        const textbox = document.createElement("input");
        const button = document.createElement("a");
        const span = document.createElement("span");

        textbox.setAttribute("id", "keyInput");
        textbox.setAttribute("type", "password");
        textbox.setAttribute("placeholder", "Github PAT Key");

        const recentError = localStorageRead("recentError");

        span.id = "error";
        span.textContent = recentError ? recentError : "Key cannot be empty";
        span.style.color = "red";
        span.style.display = recentError ? "block" : "none";
        span.style.textAlign = "center";
        span.style.padding = "0.1rem";

        button.textContent = "SAVE";
        button.style.textAlign = "center";
        button.addEventListener("click", () => {
            const value = keyInput.value;

            if (!value) {
                error.style.display = "block";
                return;
            }

            localStorageWrite("githubKey", value);

            githubKey = value;

            showChosenPrefs(root, githubContainer);
        });

        root.innerHTML = "";
        root.appendChild(textbox);
        root.appendChild(button);
        root.appendChild(span);
    });
}

function showChosenPrefs(root, identity) {
    const button = document.createElement("a");
    let icon = document.createElement("span");
    const span = document.createElement("span");
    const span2 = document.createElement("span");
    const br = document.createElement("br");

    let colorType = "color";
    if (identity.hasOwnProperty("iconUrl")) {
        icon.style.mask = `url(${identity.iconUrl}) center / contain no-repeat`;
        colorType = "background";
    } else {
        icon.innerHTML = "&#11044";
    }
    icon.className = "icon";
    if (identity.hasOwnProperty("colorCode")) {
        icon.style[colorType] = identity.colorCode;
    } else {
        icon.style[colorType] = identity.color;
    }

    span.className = "identity";
    span.innerText = identity.name;

    span2.innerText = "READY";
    span2.style.textAlign = "center";

    button.addEventListener("click", () => getGithubContainer(root));

    button.appendChild(icon);
    button.appendChild(span);
    button.appendChild(br);

    /* reset */
    const button2 = document.createElement("a");
    const br2 = document.createElement("br");

    button2.textContent = "RESET";
    button2.style.textAlign = "center";
    button2.addEventListener("click", () => {
        localStorageClear();

        githubContainer = githubKey = false;

        getGithubContainer(root);
    });

    root.innerHTML = "";
    root.appendChild(span2);
    root.appendChild(button);

    root.appendChild(br2);
    root.appendChild(button2);
}

/* GUI */
const root = document.getElementById("root");

let githubContainer = JSON.parse(localStorageRead("githubContainer"));
let githubKey = localStorageRead("githubKey");

if (!githubContainer) {
    getGithubContainer(root);
} else if (!githubKey) {
    getGithubKey(root);
} else {
    showChosenPrefs(root, githubContainer);
}
