/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import alt from 'alt-client';
import * as native from 'natives';

alt.on('disconnect', () => {
  native.destroyAllCams(true);
  native.displayRadar(true);
  native.renderScriptCams(false, false, 0, false, false);
  native.triggerScreenblurFadeOut(0);

  //alt.emit('view:DestroyAll');

  // Cleanup Peds
  alt.emit('peds:Delete');
});
