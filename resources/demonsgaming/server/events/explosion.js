/// <reference types="@altv/types-server" />
import alt from 'alt-server';

alt.on('explosion', (source, type, pos, fx) => {
  return false;
});
