/// <reference types="@altv/types-client"/>
/// <reference types="@altv/types-natives" />
import * as alt from 'alt'
import * as native from 'natives';

export function enterVehicle (vehicle) {
    if (vehicle === null || !vehicle.valid) {
        return
    }

    let interval = alt.setInterval(() => {
        if (vehicle === alt.Player.local.vehicle) {
            alt.clearInterval(interval)
        }

        native.setPedIntoVehicle(alt.Player.local.scriptID, vehicle.scriptID, -1);
    }, 0)
}

alt.onServer('vehicle:spawned', vehicle => {
    enterVehicle(vehicle)
})
