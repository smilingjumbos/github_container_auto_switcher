function localStorageRead(key) {
    const value = localStorage.getItem(key);

    return value === null ? false : value;
}

function localStorageWrite(key, value) {
    return localStorage.setItem(key, value);
}

function localStorageDelete(key) {
    return localStorage.removeItem(key);
}

function checkIfRepoExistsAsPrivate(githubKey, url) {
    const path = new URL(url).pathname;
    const pathSplit = path.split("/");
    const ownerSlashRepo = `${pathSplit[1]}/${pathSplit[2]}`;

    const myHeaders = new Headers();
    myHeaders.append("X-GitHub-Api-Version", "2022-11-28");
    myHeaders.append("Accept", "application/vnd.github+json");
    myHeaders.append("Authorization", `Bearer ${githubKey}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const serviceUrl = `https://api.github.com/repos/${ownerSlashRepo}`;

    return fetch(serviceUrl, requestOptions)
        .then((response) => {
            if (response.status >= 400) {
                let errorMsg = "Unknown error from github API";

                if (response.status === 401) {
                    errorMsg = "Github PAT key is invalid!";
                    localStorageWrite(
                        "recentError",
                        "Given key is invalid, check instructions"
                    );
                    localStorageDelete("githubKey");

                    throw Error(errorMsg);
                } else if (response.status === 404) {
                    console.info("Repo does not exist");
                    return { 404: true };
                } else {
                    throw Error(errorMsg);
                }
            } else {
                return response.json();
            }
        })
        .then((result) => {
            if (Object.keys(result).includes("private") && result["private"]) {
                return true;
            } else if (result["404"]) {
            } else {
                console.log(`${serviceUrl}\n${JSON.stringify(result)}`);
                return false;
            }
        })
        .catch((error) => console.log(error));
}

function currentTabIsAlreadyGithubContainer(cookieStoreId) {
    return browser.tabs
        .query({
            currentWindow: true,
            active: true,
        })
        .then((tabs) =>
            browser.tabs
                .get(tabs[0].id)
                .then((tab) => tab.cookieStoreId === cookieStoreId)
        );
}

function changeContainerManually(cookieStoreId, url) {
    browser.tabs
        .query({
            currentWindow: true,
            active: true,
        })
        .then((tabs) => {
            browser.tabs.get(tabs[0].id).then((tab) => {
                browser.tabs.create({
                    url: url,
                    cookieStoreId: cookieStoreId,
                    index: tab.index + 1,
                    pinned: tab.pinned,
                });

                browser.tabs.remove(tabs[0].id);
            });
        });
}

console.log("background script started");

chrome.webRequest.onCompleted.addListener(
    async (details) => {
        const githubContainer = JSON.parse(localStorageRead("githubContainer"));
        const githubKey = localStorageRead("githubKey");

        const cookieStoreId = githubContainer.cookieStoreId;
        if (!cookieStoreId) {
            console.error("cookieStoreId not found in githubContainer!");
            console.error(`githubContainer: ${githubContainer}`);
            return;
        }

        if (!githubContainer) {
            console.error("Github container not set!");
            return;
        } else if (!githubKey) {
            console.error("Github key not set!");
            return;
        }

        try {
            if (new URL(details.url).hostname === "github.com") {
                if (
                    !(await currentTabIsAlreadyGithubContainer(
                        cookieStoreId
                    )) &&
                    details.statusCode === 404
                ) {
                    console.info("404 detected on github.com:", details.url);

                    if (
                        await checkIfRepoExistsAsPrivate(githubKey, details.url)
                    ) {
                        console.info(
                            `Repo exists but is private, switching to githubContainer: ${cookieStoreId}`
                        );
                        changeContainerManually(cookieStoreId, details.url);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to parse URL:", error);
        }
    },
    { urls: ["*://github.com/*"] }
);
