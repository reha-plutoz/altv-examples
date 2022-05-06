/// <reference types="@altv/types-server" />
import alt from 'alt-server';

import * as dimensions from '../configuration/dimensions';

export function kick (player, reason = '') {
    alt.emitClient(player, 'administration:kick', reason);

    setTimeout(() => {
        player.dimension = dimensions.departureDimension;
        player.kick();
    }, 10000);
}

export function ban (player, reason = '') {
    alt.emitClient(player, 'administration:ban', reason);

    setTimeout(() => {
        player.dimension = dimensions.departureDimension;
        player.kick();
    }, 10000);
}
