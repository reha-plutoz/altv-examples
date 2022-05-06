import * as alt from 'alt-client';
/// <reference types="@altv/types-natives" />
import * as native from 'natives';
import { distance, loadAnim } from '../system/vector';

const pedStreams = [];

alt.on('peds:Delete', () => {
    pedStreams.forEach(pedStream => {
        if (!pedStream.id) {
            return;
        }

        native.deleteEntity(pedStream.id);
    });
});

/* 
    Creates the Ped.
*/
export class PedStream {
    constructor(hash, position, heading = 0) {
        this.scriptID = undefined;
        this.hash = hash;
        this.position = position;
        this.heading = heading;
        pedStreams.push(this);
    }

    addIdleAnimation(dict, name) {
        this.idleAnimation = {
            dict,
            name
        };
    }

    playAnimation(dict, name, duration = -1) {
        native.taskPlayAnim(this.scriptID, dict, name, 1, -1, duration, 1, 1.0, false, false, false);
    }

    render() {
        this.create();
    }

    create() {
        if (this.scriptID) {
            const dist = distance(this.position, native.getEntityCoords(this.scriptID, false));
            if (dist <= 2) {
                return;
            }

            native.deleteEntity(this.scriptID);
        }

        this.scriptID = native.createPed(
            1,
            this.hash,
            this.position.x,
            this.position.y,
            this.position.z - 0.4,
            this.heading,
            false,
            false
        );
        native.taskSetBlockingOfNonTemporaryEvents(this.scriptID, 1);
        native.setBlockingOfNonTemporaryEvents(this.scriptID, 1);
        native.setPedFleeAttributes(this.scriptID, 0, 0);
        native.setPedCombatAttributes(this.scriptID, 17, 1);
        native.setEntityInvincible(this.scriptID, true);
        native.freezeEntityPosition(this.scriptID, true);
        native.setEntityAsMissionEntity(this.scriptID, true, false); // make sure its not despawned by game engine
        native.setBlockingOfNonTemporaryEvents(this.scriptID, true); // make sure ped doesnt flee etc only do what its told
        native.setPedCanBeTargetted(this.scriptID, false);
        native.setPedCanBeKnockedOffVehicle(this.scriptID, 1);
        native.setPedCanBeDraggedOut(this.scriptID, false);
        native.setPedSuffersCriticalHits(this.scriptID, false);
        native.setPedDropsWeaponsWhenDead(this.scriptID, false);
        native.setPedDiesInstantlyInWater(this.scriptID, false);
        native.setPedCanRagdoll(this.scriptID, false);
        native.setPedDiesWhenInjured(this.scriptID, false);
        native.taskSetBlockingOfNonTemporaryEvents(this.scriptID, true);
        native.setPedFleeAttributes(this.scriptID, 0, false);
        native.setPedConfigFlag(this.scriptID, 32, false); // ped cannot fly thru windscreen
        native.setPedConfigFlag(this.scriptID, 281, true); // ped no writhe
        native.setPedGetOutUpsideDownVehicle(this.scriptID, false);
        native.setPedCanEvasiveDive(this.scriptID, false);
        alt.setTimeout(() => {
            if (this.scriptID) {
                // Handle Animation
                if (!this.idleAnimation) {
                    return;
                }

                const loadAnimation = loadAnim(dict);
                loadAnimation.then(() => {
                    this.playAnimation(this.idleAnimation.dict, this.idleAnimation.name, -1);
                });
            }
        }, 1000);
    }
}

alt.setInterval(() => {
    if (pedStreams.length <= 0) return;
    pedStreams.forEach(pedStream => {
        pedStream.render();
    });
}, 1500);

alt.onServer('pedstream:Append', pedJson => {
    const data = JSON.parse(pedJson);
    if (!data) {
        return;
    }

    if (data.length <= 0) {
        return;
    }

    data.forEach(stream => {
        const hash = native.getHashKey(stream.model);
        native.requestModel(hash);
        alt.loadModel(hash);

        new PedStream(hash, stream.pos, stream.heading);
    });
});
