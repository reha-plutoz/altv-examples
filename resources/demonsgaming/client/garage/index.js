/// <reference types="@altv/types-client" />
import alt from 'alt-client';
import { showCursor } from '../system/lib';

let view;

alt.onServer('view:garage', handleGarage);
function handleGarage(data) {
    if (!view) {
        view = new alt.WebView('http://resource/client/garage/ui/index.html');

        view.on('garage.ready', () =>  view.emit('vehicleSpawner:data', data));

        view.on('vehicleSpawner:close', () => {
            view.destroy();
            view = null;
            alt.toggleGameControls(true);
            showCursor(false);
        });
    }

    view.focus();
    alt.toggleGameControls(false);
    showCursor(true);
}
