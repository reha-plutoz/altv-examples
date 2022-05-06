/// <reference types="@altv/types-server" />
import alt from 'alt-server';
import * as chat from 'chat';

alt.on('playerDisconnect', (player, reason) => {
    if (!player) {
        return;
    }

    // log and broadcasts
    alt.log(`${player.name} disconnected, reason: ${reason}`);
    chat.broadcast(`${player.name} left the Server`);

    // save
    alt.emit('character:save', player);
});
