import * as alt from 'alt-client';
import * as native from 'natives';
import * as intro from './intro/index';
import './auth/index';
import './administration/index';
import './character/index';
import './map/blips';
import './hud/index';
import './nativemenus/walkingMenu';
import './events/connComplete';
import './events/playerDisconnect';
import './events/keybinds';
import './events/update';
import './map/ipls';
import './vehicle/index';
import './ped/index';
import './system/notification';
import './system/interaction';
import './system/camera';
import './system/cameraobj';
import './garage/index';

alt.onServer('teleportToWaypoint', (callbackName) => {
    if (!native.isWaypointActive()) {
        alt.emitServer(callbackName, callbackName, undefined);
        return;
    }

    const wp = native.getFirstBlipInfoId(8);
    const coords = native.getBlipInfoIdCoord(wp);
    native.setEntityAlpha(alt.Player.local.scriptID, 0, false);

    let start = 1200;
    const timeout = alt.setInterval(() => {
        if (start <= 0) {
            alt.emitServer(callbackName, callbackName, undefined);
            alt.clearInterval(timeout);
            native.freezeEntityPosition(alt.Player.local.scriptID, false);
            native.setEntityAlpha(alt.Player.local.scriptID, 255, false);
            return;
        }

        native.startPlayerTeleport(
            alt.Player.local.scriptID,
            coords.x,
            coords.y,
            start,
            0,
            true,
            true,
            false
        );

        native.freezeEntityPosition(alt.Player.local.scriptID, true);
        native.requestCollisionAtCoord(coords.x, coords.y, start);
        const [_found, zValue] = native.getGroundZFor3dCoord(
            coords.x,
            coords.y,
            start
        );
        if (!_found) {
            start -= 5;
            return;
        }

        alt.emitServer(callbackName, callbackName, {
            x: coords.x,
            y: coords.y,
            z: zValue,
        });

        native.setEntityAlpha(alt.Player.local.scriptID, 255, false);
        native.freezeEntityPosition(alt.Player.local.scriptID, false);
        alt.clearInterval(timeout);
    }, 5);
});

let date = new Date();
native.setClockDate(date.getDay(), date.getMonth(), date.getFullYear());
native.setClockTime(date.getHours(), date.getMinutes(), date.getSeconds());
alt.setMsPerGameMinute(60000);

intro.callIntro();

alt.onServer('player:spawned', () => {
    native.displayHud(false);
    native.displayRadar(false);
    alt.toggleGameControls(false);
    native.switchOutPlayer(alt.Player.local.scriptID, 1, 1);
});
