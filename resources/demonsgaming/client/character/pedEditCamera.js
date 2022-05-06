/// <reference types="@altv/types-client" />
import alt from 'alt-client';
import * as native from 'natives';

let cameraControlsInterval;
let camera;
let fov = 70;
let startPosition;
let startCamPosition;
let timeBetweenAnimChecks = Date.now() + 100;

export function createPedEditCamera() {
    startPosition = { ...alt.Player.local.pos };
    if (!camera) {
        const forwardVector = native.getEntityForwardVector(alt.Player.local.scriptID);
        const forwardCameraPosition = {
            x: startPosition.x + forwardVector.x * 1.2,
            y: startPosition.y + forwardVector.y * 1.2,
            z: startPosition.z
        };

        fov = 70;
        startCamPosition = forwardCameraPosition;

        camera = native.createCamWithParams(
          'DEFAULT_SCRIPTED_CAMERA',
          forwardCameraPosition.x,
          forwardCameraPosition.y,
          forwardCameraPosition.z,
          0,
          0,
          0,
          fov,
          true,
          0
        );

        native.pointCamAtCoord(camera, startPosition.x, startPosition.y, startPosition.z);
        native.setCamActive(camera, true);
        native.renderScriptCams(true, false, 0, true, false);
    }

    if (!cameraControlsInterval) {
        cameraControlsInterval = alt.setInterval(handleControls, 0);
    }
}

export function focusPedEditCamera (type) {
    if(camera) {
        const forwardVector = native.getEntityForwardVector(alt.Player.local.scriptID);

        let x = startPosition.x + forwardVector.x * 2;
        let y = startPosition.y + forwardVector.y * 2;
        let z = startPosition.z;

        if('head' === type)
        {
            x = startPosition.x + forwardVector.x * 0.6;
            y = startPosition.y + forwardVector.y * 0.6;
            z = startPosition.z + 0.6;
        } else if('torso' === type) {
            x = startPosition.x + forwardVector.x * 0.8;
            y = startPosition.y + forwardVector.y * 0.8;
            z = startPosition.z + 0.2;
        } else if('legs' === type) {
            x = startPosition.x + forwardVector.x * 0.8;
            y = startPosition.y + forwardVector.y * 0.8;
            z = startPosition.z - 0.5;
        } else if('shoes' === type) {
            x = startPosition.x + forwardVector.x * 0.8;
            y = startPosition.y + forwardVector.y * 0.8;
            z = startPosition.z - 0.7;
        }

        native.setCamCoord(camera, x, y, z);
        native.pointCamAtCoord(camera, x, y, z);
    }
}

export function destroyPedEditCamera() {
    if (cameraControlsInterval) {
        alt.clearInterval(cameraControlsInterval);
        cameraControlsInterval = null;
    }

    if (camera) {
        camera = null;
    }

    native.destroyAllCams(true);
    native.renderScriptCams(false, false, 0, false, false);
}

function handleControls() {
    native.disableControlAction(0, 24, true);
    native.disableControlAction(0, 25, true);
    native.disableControlAction(0, 32, true); // w
    native.disableControlAction(0, 33, true); // s
    native.disableControlAction(0, 34, true); // a
    native.disableControlAction(0, 35, true); // d

    if (Date.now() > timeBetweenAnimChecks) {
        timeBetweenAnimChecks = Date.now() + 1500;
        if (!native.isEntityPlayingAnim(alt.Player.local.scriptID, 'nm@hands', 'hands_up', 3)) {
            alt.emit('animation:Play', {
                dict: 'nm@hands',
                name: 'hands_up',
                duration: -1,
                flag: 2
            });
        }
    }
}
