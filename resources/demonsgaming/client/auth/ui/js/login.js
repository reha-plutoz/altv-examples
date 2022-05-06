function login() {
    if ('alt' in window) {
        let name = $('#username').val();
        let password = $('#password').val();

        if (name.length > 0 && password.length > 0) {
            alt.emit('auth:login', name, password);
        }
    }
}

function toRegister () {
    if ('alt' in window) {
        alt.emit('view:toRegister');
    }
}
