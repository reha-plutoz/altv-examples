/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import alt from 'alt-client';
import * as native from 'natives';

alt.onServer('notification:fromServer', (text) => {
    alt.emit('notification:show', text);
});

alt.onServer('client::updateVoiceRange', (text) =>  alt.emit('native:notification', text));

alt.onServer('functions:helpNotification', handleNotification)
alt.on('native:notification', handleNotification);

function handleNotification(message, time = 2000) {
    try {
        native.beginTextCommandDisplayHelp('STRING');
        native.addTextComponentSubstringPlayerName(message);
        native.endTextCommandDisplayHelp(0, 0, 0, time);
    } catch {}
}