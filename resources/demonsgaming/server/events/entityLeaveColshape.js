/// <reference types="@altv/types-server" />
import alt from 'alt-server';

alt.on('entityLeaveColshape', (colshape, entity) => {
    entity.setMeta('currentColShape', undefined);
});
