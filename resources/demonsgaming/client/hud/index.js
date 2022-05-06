/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import alt from 'alt-client';
import * as native from 'natives';

const electric = [
    2445973230, // neon
    1560980623, // airtug
    1147287684, // caddy
    3164157193, // dilettante
    2400073108, // surge
    544021352, // khamelion
    2672523198, // voltic
    1031562256, // tezeract
    1392481335, // cyclone
    2765724541, // raiden
];

let webview;
let cInterval;
let vTick;

export function show() {
    if(webview) {
        webview.destroy();
    }
    webview = new alt.WebView('http://resource/client/hud/ui/index.html');
    cInterval = alt.setInterval(() => {
        let character = alt.Player.local.getSyncedMeta('character');
        let cash      = character ? character.cash : 0;
        let bank      = character ? character.bank : 0;

        webview.emit('hud:character', {
            cash: cash,
            bank: bank,
        });
    }, 2000);
    vTick = alt.everyTick(() => {
        let vehicle   = alt.Player.local.vehicle;
        let isVehicle = !!vehicle;
        let speed     = 0;

        if(isVehicle)
        {
            speed = parseInt(
              (native.getEntitySpeed(vehicle.scriptID) * 3.6).toFixed(0)
            );
        }

        webview.emit('hud:vehicle', {
            speed: speed,
            vehicle: isVehicle,
        });
    })
}

export function hide() {
    webview.destroy();
    alt.clearInterval(cInterval);
    alt.clearEveryTick(vTick);
}

export function hasHud() {
    return !!webview;
}
