/// <reference types="@altv/types-client" />
import alt from 'alt-client';
import * as native from 'natives';

let webview;

alt.onServer('initLogin', callLogin);
alt.onServer('initRegister', callRegister);

export function callLogin() {
  getWebview('http://resource/client/auth/ui/login.html')
  alt.showCursor(true);
}

export function callRegister() {
  getWebview('http://resource/client/auth/ui/register.html')
}

function getWebview(url)
{
  if (!webview) {
    webview = new alt.WebView(url);
  } else {
    webview.url = url;
  }

  webview.focus();

  webview.on('auth:login', (player, username, pass) => {
    alt.emitServer('loginUser', player, username, pass);
  });

  webview.on('view:toRegister', () => {
    callRegister();
  });

  webview.on('auth:register', (player, mail, username, pass) => {
    alt.emitServer('registerUser', player, mail, username, pass);
  });

  webview.on('view:toLogin', () => {
    callLogin();
  });
}

alt.onServer('auth:closeLogin', () => {
  webview.unfocus();
  webview.destroy();
  webview = undefined;

  alt.showCursor(false);
  native.displayHud(true);
  native.displayRadar(true);
  alt.toggleGameControls(true);
});
