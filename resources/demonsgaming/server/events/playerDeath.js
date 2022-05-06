/// <reference types="@altv/types-server" />
import alt from 'alt-server';
import * as configurationHospitals from '../locations/hospitals';
import { distance } from '../util/vector.js';

alt.on('playerDeath', (player) => {
    let closestHospital = configurationHospitals.Locations[0];
    let lastDistance = 0;

    configurationHospitals.Locations.forEach((hospital) => {
      const dist = distance(hospital, player.pos);

      if (lastDistance === 0) {
        lastDistance = distance(hospital, player.pos);
        return;
      }

      if (lastDistance > dist) {
        lastDistance = dist;
        closestHospital = hospital;
      }
    });

    player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
    player.health = 200;
    player.armour = 0;
});
