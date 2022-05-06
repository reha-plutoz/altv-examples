/// <reference types="@altv/types-server" />
import alt from 'alt-server';

const pedStreams = [];

export class PedManager {
    constructor(modelName, position, heading) {
        this.model = modelName;
        this.pos = position;
        this.heading = heading;
        pedStreams.push(this);
    }
}

alt.on('sync:Player', player => {
    const pedStreamJSON = JSON.stringify(pedStreams);
    alt.emitClient(player, 'pedstream:Append', pedStreamJSON);
});
