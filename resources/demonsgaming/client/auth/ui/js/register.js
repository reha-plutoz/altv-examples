function register() {
    if ('alt' in window) {
        let mail = $('#mail').val();
        let name = $('#username').val();
        let password = $('#password').val();
        let passwordRepeat = $('#password_repeat').val();

        if(password !== passwordRepeat)
        {
            $('#password_repeat').closest('.mdl-textfield__error').text('Test');
        } else if (mail.length > 0 && name.length > 0 && password.length > 0) {
            alt.emit('auth:register', mail, name, password);
        }
    }
}

function toLogin () {
    if ('alt' in window) {
        alt.emit('view:toLogin');
    }
}
