/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import alt from 'alt-client';
import * as native from 'natives';

alt.log('Loaded: events->update.js');
alt.on('meta:Changed', loadInterval);

const [_, width, height] = native.getActiveScreenResolution(0, 0);
const noAmmoWeapons = [-1569615261, 911657153];

// Only starts the interval after the player has logged in.
function loadInterval(key) {
  alt.off('meta:Changed', loadInterval);

  const intervalID = alt.setInterval(drawPlayerNames, 0);
  alt.log(`update.js ${intervalID}`);
}

function drawPlayerNames() {
  native.hideHudComponentThisFrame(2);
  native.hideHudComponentThisFrame(6);
  native.hideHudComponentThisFrame(8);
  //native.disableControlAction(0, 200, true);
  native.setPedConfigFlag(alt.Player.local.scriptID, 429, 1);
  native.setPedConfigFlag(alt.Player.local.scriptID, 184, 1);
  native.setPedConfigFlag(alt.Player.local.scriptID, 35, 0);

  if (alt.Player.local.getSyncedMeta('dead')) {
    native.setPedToRagdoll(alt.Player.local.scriptID, -1, -1, 0, 0, 0, 0);
  }

  if (native.isPlayerFreeAiming(alt.Player.local)) {
    const [_unk, wepHash] = native.getCurrentPedWeapon(
      alt.Player.local.scriptID,
      0,
      1
    );
    if (!noAmmoWeapons.includes(wepHash)) {
      const [_unk2, clipCount] = native.getAmmoInClip(
        alt.Player.local.scriptID,
        wepHash,
        0
      );
      const totalAmmo = native.getAmmoInPedWeapon(
        alt.Player.local.scriptID,
        wepHash
      );
      if (clipCount !== 0) {
        const hand = native.getPedBoneCoords(
          alt.Player.local.scriptID,
          6286,
          0,
          0,
          0.15
        );

        text.drawText3d(
          `${totalAmmo} ~o~${clipCount}`,
          hand.x,
          hand.y,
          hand.z,
          0.5,
          4,
          255,
          255,
          255,
          125,
          true,
          false,
          99
        );
      }
    }
  }

  if (alt.Player.local.vehicle) {
    const ped = native.getPedInVehicleSeat(
      alt.Player.local.vehicle.scriptID,
      0,
      0
    );
    if (ped === alt.Player.local.scriptID && native.getIsTaskActive(ped, 165)) {
      native.setPedIntoVehicle(ped, alt.Player.local.vehicle.scriptID, 0);
    }
  }

  if (alt.Player.all.length <= 1) return;
}
