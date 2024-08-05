# GitHub Container Auto Switcher

<h1 align="center">
<sub>
<img src="https://github.com/gorhill/uBlock/blob/master/src/img/logo.svg" height="38" width="38">
</sub>
Github Container Auto Switcher
</h1>

---

<p align="center">
<a href="https://addons.mozilla.org/addon/github-container-auto-switcher/"><img src="https://user-images.githubusercontent.com/585534/107280546-7b9b2a00-6a26-11eb-8f9f-f95932f4bfec.png" alt="Get Github Container Auto Switcher for Firefox"></a>
</p>

---

The GitHub Container Auto Switcher is a Firefox add-on designed to ease the use of Firefox Containers with GitHub for privacy-conscious users. It is intended for those GitHub users who prefer to browse public repositories while being logged out to prevent GitHub from tracking their visits.

When accessing a private repository while logged out, GitHub returns a 404 Not Found error. The above said users then have to switch the current tab to a designated GitHub container manually or using an add-on such as [Switch Container](https://addons.mozilla.org/en-US/firefox/addon/switch-container/). This add-on automates this switching if it detects that the private repository is accessible to the logged-in user in the designated GitHub container.

## Usage

Step 1: [Enable Firefox Containers](https://support.mozilla.org/en-US/kb/how-use-firefox-containers) and create a designated container for GitHub at [Firefox Settings -> General](about:preferences#containers)

Step 2: Logout of GitHub

Step 3: Create a new tab in the designated container and login to GitHub in this container tab

Step 4: Find the add-on in the add-ons list and click on it. Select your designated Firefox container for GitHub.

Step 5: Create a GitHub Personal Access Token with "repo" scope. Ref: [GitHub's official documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic).

Step 6: Paste the obtained token (the one that is prefixed with `ghp_`) in the addon and click "SAVE".

Step 7: Test the add-on by attempting to browse to a private repository in a non-containerized tab. The add-on should detect the repository being private and should switch the current tab to the designated GitHub container.

## Features

-   **Automatic Container Switching:** This add-on activates exclusively on GitHub pages (`github.com/*`). If you encounter a 404 error on a GitHub page, it parses the repository by extracting the owner/repo name from the URL, even if you're on a subpage like issues or pull requests.

-   **Private Repository Detection:** Using [GitHub API](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository), the add-on fetches the repository's metadata and checks if the repository is private. If so, it automatically switches your tab to the designated GitHub container.

-   **Privacy Preserving:** Apart from the request to the GitHub API, no data leaves your device. The designated GitHub container ID and Personal Access Token are stored locally in the addon's [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

## What's New

-   **Version 0.0.1**
    -- Added private repository detection and automatic switching to designated GitHub container

## Sources

This add-on was built based on the following sources:

-   Forked off the [Switch Container Add-on](https://addons.mozilla.org/en-US/firefox/addon/switch-container/)

-   Contextual identities handling:

    `https://github.com/mdn/webextensions-examples/blob/master/contextual-identities/context.js`

-   Pop-up html/css:

    `https://github.com/mdn/webextensions-examples/blob/master/contextual-identities/context.html` (html)

    `https://github.com/mdn/webextensions-examples/blob/master/contextual-identities/context.css` (css)

-   Icon:

    `omni.ja\chrome\browser\content\browser\`

## Legal

Disclaimer: This add-on is open source and is not endorsed by Mozilla, MDN, or GitHub, and has no commercial objectives.

This project is licensed under the terms of the [Mozilla Public License Version 2.0](LICENSE).
