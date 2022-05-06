/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import alt from 'alt-client';
import * as native from 'natives';
import * as auth from '../auth/index';

let webview;

let url = 'http://resource/client/intro/ui/intro.html';

export function callIntro () {
    if (!webview) {
        webview = new alt.WebView(url);
    } else {
        webview.url = url;
    }

    webview.focus();

    webview.on('menu:close', () => {
        webview.unfocus();
        webview.destroy();
        webview = undefined;

        auth.callLogin();
    });
}
