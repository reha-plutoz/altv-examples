/// <reference types="@altv/types-server" />
import * as alt from 'alt-server'
import * as dimensions from '../configuration/dimensions'

alt.on('playerConnect', (player) => {
  alt.log(`${player.name} is connecting`);
  player.dimension = dimensions.joinDimension;
});

alt.onClient('connectionCompleted', async (player) => {
  player.spawn(2634.79, -2001.95, 1.59553, 1);
  alt.emitClient(player, 'player:spawned');

    let date = new Date();
    player.setDateTime(
        date.getDay(),
        date.getMonth(),
        date.getFullYear(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    );
});
