/// <reference types="@altv/types-server" />
import alt from 'alt-server';

alt.onClient('consoleCommand', (command, ...args) => {
  alt.log(command, args);
  console.log(command, args);
});
