/// <reference types="@altv/types-server" />
import alt from 'alt-server';

alt.onClient('keyPress', (player) => {
    let col = player.getMeta('currentColShape');
    if (!col || col.nameType !== 'garage') {
        return;
    }

    alt.emitClient(player, 'view:garage');
});

alt.on('entityEnterColshape', (colshape, entity) => {
    if (entity instanceof alt.Player) {
        if (colshape.nameType === 'garage') {
            entity.setMeta('currentColShape', colshape);
            entity.showNotification('Druecke ~INPUT_CONTEXT~ um die Garage zu öffnen');
        } else if(colshape.nameType === 'cop_duty') {
            entity.setMeta('currentColShape', colshape);
            entity.showNotification('Druecke ~INPUT_CONTEXT~ um Cop Shop zu öffnen');

            //do stuff

        }
    }
});
