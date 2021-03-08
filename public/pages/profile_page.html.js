import { request } from '../modules/requests.js';
import { readImageAsDataURL } from '../modules/images.js';

const html = `
<div class="profile">
    <div class="content">
        <div class="standalone-form profile">
            <div class="title">
                <div class="avatar">
                    <img id="avatarImage" src="../images/avatar.jpg">
                    <div id="avatarChange" class="cover">
                        Изменить
                    </div>
                </div>
                <div class="primary" id="username"></div>
                <div class="secondary" id="email"></div>
            </div>
            <div class="form">
                <form id="editProfileForm">
                    <input name="avatarDataURL" type="hidden" id="avatarDataURL">

                    <div class="form-group" id="fullnameGroup">
                        <label>ПОЛНОЕ ИМЯ<span class="error-text" id="fullnameErrorText"></span></label>
                        <input name="fullname" type="text" class="form-control" id="fullnameInput">
                    </div>
                    <div class="form-group" id="reserveEmailGroup">
                        <label>ЗАПАСНОЙ E-MAIL<span class="error-text" id="reserveEmailErrorText"></span></label>
                        <input name="reserveEmail" type="text" class="form-control" id="reserveEmailInput">
                        <div class="muted">Необходимо будет подтвердить на старом и новом ящиках</div>
                    </div>
                    <div class="form-group">
                        <input type="submit" class="btn" value="Сохранить">
                    </div>
                    <div class="form-group">
                        <LinkButton href="???" class="btn" id="changePasswordButton">Сменить пароль</LinkButton>
                    </div>
                    <div class="form-group">
                        <linkButton href="/auth" class="btn btn-danger" id="logoutButton">Выйти</linkButton>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
`;

export async function source(element, router) {
    document.title = 'LioKor | Профиль';
    element.innerHTML = html;

    let username = '';

    const response = await request('GET', '/api/user');
    if (response.ok) {
        const data = await response.json();

        if (data.avatarUrl) {
            document.getElementById('avatarImage').src = data.avatarUrl;
        }
        document.getElementById('username').innerText = username = data.username;
        document.getElementById('email').innerText = data.username.toLowerCase() + '@liokor.ru';
        document.getElementById('fullnameInput').value = data.fullname;
        document.getElementById('reserveEmailInput').value = data.reserveEmail;
        document.getElementById('changePasswordButton').setAttribute('href', location.pathname + '/' + username + '/password');
    } else {
        router.goto('/auth');
    }

    const editProfileForm = document.getElementById('editProfileForm');
    editProfileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(editProfileForm);
        const avatarUrl = formData.get('avatarDataURL');
        const fullname = formData.get('fullname').trim();
        const reserveEmail = formData.get('reserveEmail').trim();

        const response = await request('PUT', `/api/user/${username}`, { fullname, avatarUrl, reserveEmail });
        if (!response.ok) {
            alert('Не удалось изменить данные!');
        }
    });

    document.getElementById('logoutButton').addEventListener('click', (event) => {
        request('DELETE', '/api/user/session');
    });

    document.getElementById('avatarChange').addEventListener('click', async () => {
        const dataURL = await readImageAsDataURL();
        document.getElementById('avatarImage').src = dataURL;
        document.getElementById('avatarDataURL').value = dataURL;
    });
}
