/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import alt from 'alt-client';
import * as native from 'natives';

alt.log('Loaded Keybinds');

let handled = true;

alt.on('keyup', (key) => {
    if(!handled)
    {
        return;
    }

    handled = false;

    // M Key
    if (key === 77) {
        let vehicle = native.getVehiclePedIsIn(alt.Player.local.scriptID, false);

        if(native.doesEntityExist(vehicle) && !native.isEntityDead(vehicle) && native.getPedInVehicleSeat(vehicle, -1) === native.playerPedId())
        {
            let model = native.getEntityModel(vehicle);

            if(native.isThisModelACar(model))
            {
                let engineOn = native.getIsVehicleEngineRunning(vehicle);

                native.setVehicleEngineOn(vehicle, !engineOn, false, true);
            }
        }
    }

    // E Key
    if (key === 69) {
        alt.emitServer('keyPress');
    }

    alt.setTimeout(() => {
        handled = true;
    }, 200)
});
