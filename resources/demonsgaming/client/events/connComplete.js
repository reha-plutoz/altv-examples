/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import alt from 'alt-client';
import * as native from 'natives';

alt.log('connection event loaded');

alt.on('connectionComplete', () => {
  alt.emitServer('connectionCompleted');
  alt.loadModel('mp_f_freemode_01');
  alt.loadModel('mp_m_freemode_01');
  alt.emit('load:Interiors');
  native.displayRadar(true);
  native.setMinimapComponent(15, true);

  //max stats
  alt.setStat('stamina', 100);
  alt.setStat('strength', 100);
  alt.setStat('lung_capacity', 100);
  alt.setStat('wheelie_ability', 100);
  alt.setStat('flying_ability', 100);
  alt.setStat('shooting_ability', 100);
  alt.setStat('stealth_ability', 100);
  alt.getStat('stamina');
  alt.resetStat('stamina');
});
