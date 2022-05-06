/// <reference types="@altv/types-client" />
import alt from 'alt-client';

alt.onServer('administration:kick', showKicked);

function showKicked (reason = 'Gekickt von Admin') {
    new alt.WebView(encodeURI(`http://resource/client/administration/ui/kicked.html?reason=${reason}`));
}
