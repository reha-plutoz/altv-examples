/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import alt from 'alt-client';
import * as native from 'natives';
import {
  atm,
  hospital,
  police_station,
  lsc,
  car_shop,
  luxus_car_shop,
  bank,
  garage,
  clothing,
  barber,
  shop,
} from './locations.js';

alt.log('Loaded: blips.js');

let categories = {};

// Used to create blips for the player to see.
export function createBlip(
  category,
  pos,
  sprite,
  color,
  label,
  size = 0.8,
  display = 2
) {
  if (!pos || !category || !sprite) {
    return;
  }

  const blip = native.addBlipForCoord(pos.x, pos.y, pos.z);
  native.setBlipAsShortRange(blip, true);
  native.setBlipSprite(blip, sprite);
  native.setBlipColour(blip, color);
  native.beginTextCommandSetBlipName('STRING');
  native.addTextComponentSubstringPlayerName(label);
  native.endTextCommandSetBlipName(blip);
  native.setBlipDisplay(blip, display);
  native.setBlipScale(blip, size);

  const keys = Object.keys(categories);
  let index = keys.findIndex((key) => key === category);
  if (index <= -1) {
    categories[category] = [blip];
  } else {
    categories[category].push(blip);
  }

  return blip;
}

export function setBlipCategoryState(name, state) {
  if (!categories[name]) return;
  categories[name].forEach((blip) => {
    const toggleState = state ? 2 : 0;
    native.setBlipDisplay(blip, toggleState);
  });
}

// Load Bank Blips
bank.forEach((bank) => {
  createBlip('bank', bank, 434, 2, 'Bank');
});

hospital.forEach((hospital) => {
  createBlip('hospital', hospital, 153, 43, 'Hospital');
});

police_station.forEach((PoliceStations) => {
  createBlip('police', PoliceStations, 60, 29, 'Polizei Station');
});

car_shop.forEach((carshops) => {
  createBlip('carshop', carshops, 225, 4, 'Car Dealer');
});

luxus_car_shop.forEach((luxus_shop) => {
  createBlip('luxus', luxus_shop, 523, 4, 'Luxus Car Dealer');
});

lsc.forEach((lsc) => {
  createBlip('lsc', lsc, 402, 4, 'Los Santos Custom');
});

garage.forEach((garage) => {
  createBlip('garage', garage, 50, 29, 'Garage');
});

barber.forEach((barber) => {
  createBlip('barber', barber, 71, 4, 'Friseur');
});

clothing.forEach((clothing) => {
  createBlip('clothing', clothing, 73, 4, 'Kleiderladen');
});

shop.forEach((shop) => {
  createBlip('shop', shop, 52, 2, 'Shop');
});
