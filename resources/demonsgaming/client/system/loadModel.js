/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import alt from 'alt-client';
import * as game from 'natives';

function loadModelAsync(model) {
    return new Promise((resolve, reject) => {
        if (typeof model === 'string') {
            model = game.getHashKey(model);
        }

        if (!game.isModelValid(model))
            return resolve(false);

        if (game.hasModelLoaded(model))
            return resolve(true);

        game.requestModel(model);

        let interval = alt.setInterval(() => {
            if (game.hasModelLoaded(model)) {
                alt.clearInterval(interval);
                return resolve(true);
            }
        }, 0);
    });
}