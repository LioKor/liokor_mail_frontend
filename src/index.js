import './styles/page.styl';
import './styles/formControls.styl';
import './styles/popupMessages.styl';
import './styles/profile.styl';
import './styles/messages.styl';

import { registerSW } from './sw-installer.js';
import App from './modules/app.js';

/**
 * Main function (entry point) of a frontend
 *
 */
async function main() {
    registerSW();

    const { hostname, host } = window.location;
    let apiUrl = 'https://api.mail.liokor.ru';
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        apiUrl = `http://${host}/api`;
    }
    const app = new App('LioKor', apiUrl, 'app', 'popupMessages');

    const response = await app.apiGet('/user');
    if (response.ok) {
        // authenticated => redirecting to profile
        const { username, avatarUrl } = await response.json();
        app.updateStorage(username, avatarUrl);

        if (location.pathname === '/') {
            await app.goto('/messages');
            return;
        }
        await app.goto(location.pathname + location.search);
        return;
    }

    if (location.pathname === '/') {
        await app.goto('/auth');
        return;
    }
    await app.goto(location.pathname + location.search);
}

main();
