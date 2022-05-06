/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import alt from 'alt-client';
import * as native from 'natives';
import * as NativeUI from '../NativeUI/NativeUi';
import * as config from './config';

const Menu = NativeUI.Menu;
const UIMenuItem = NativeUI.UIMenuItem;
const Point = NativeUI.Point;

let walkingstyles = null;
let currentWalkIndex = 0;

const menu = new Menu('Gehstile', '', new Point(50, 50));
menu.Visible = false;

async function setWalkType(index, type) {
  if (index === 0)
    return native.resetPedMovementClipset(alt.Player.local.scriptID, 0.0);

  if (!native.hasClipSetLoaded(type)) {
    await native.requestClipSet(type);
    native.setPedMovementClipset(alt.Player.local.scriptID, type, 1.0);
    return;
  }

  native.setPedMovementClipset(alt.Player.local.scriptID, type, 1.0);
}

menu.ItemSelect.on((item, index) => {
  setWalkType(index, menu.MenuItems[currentWalkIndex].Data);

  menu.MenuItems[currentWalkIndex].SetRightLabel('');
  item.SetRightLabel('Aktiv');

  currentWalkIndex = index;
});

alt.on('addWalkingStyles', (json) => {
  walkingstyles = JSON.parse(json);
  for (let i = 0; i < walkingstyles.length; i++)
    menu.AddItem(
      new UIMenuItem(walkingstyles[i].name, '', walkingstyles[i].anim)
    );

  menu.MenuItems[0].SetRightLabel('Aktiv');
  menu.Visible = true;
});

alt.on('keyup', (key) => {
  if (key === 0x71) {
    if (walkingstyles) {
      menu.Visible = !menu.Visible;
      console.log(walkingstyles);
    } else {
      alt.emit('addWalkingStyles', [JSON.stringify(config.walkingstyles)]);
    }
  }
});
