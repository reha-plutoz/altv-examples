/// <reference types="@altv/types-server" />
import alt from 'alt-server';
import * as chat from 'chat';
import { weaponList } from './wep.js';
import sql from '../database/db';
import * as vehicleTool from '../util/vehicle';

const db = new sql();

chat.registerCmd('veh', async (player, args) => {
    try {
        const vehicle = new alt.Vehicle(
            args[0],
            player.pos.x + 2,
            player.pos.y,
            player.pos.z,
            0,
            0,
            0
        );
        vehicle.numberPlateText = vehicleTool.generatePlate();
        alt.emitClient(player, 'vehicle:spawned', vehicle);
    } catch (err) {
        console.log(err);
        chat.send(player, 'Something went wrong.');
    }
});

chat.registerCmd('wep', (player, arg) => {
    const weaponName = arg[0].toLowerCase();

    if (!weaponList[weaponName])
        return chat.send(player, '{FF0000}Weapon type is not valid.');

    player.giveWeapon(weaponList[weaponName], arg[1] ? arg[1] : 9999, true);
});

chat.registerCmd('tpwp', (player) => {
    const callbackName = `${player.name}tpwp`;
    alt.onClient(callbackName, teleportToWaypoint);
    alt.emitClient(player, 'teleportToWaypoint', callbackName);
});

function teleportToWaypoint(player, callbackName, coords) {
    alt.onClient(callbackName, teleportToWaypoint);
    if (!coords) {
        chat.send(player, 'Could not parse coords.');
        return;
    }

    chat.send(player, 'You were teleported.');
    player.pos = coords;
}

chat.registerCmd('coord', (player, args) => {
    if (args.length <= 2) {
        chat.send(player, 'Usage: /coord (x, y, z)');
        return;
    }

    player.pos = {
        x: args[0],
        y: args[1],
        z: args[2],
    };
});

chat.registerCmd('coords', (player) => {
    chat.send(player, JSON.stringify(player.pos));
    console.log(JSON.stringify(player.pos));
});

chat.registerCmd('revive', (player, args) => {
    if (args.length !== 1) {
        chat.send(player, `/revive <id>`);
        return;
    }

    const _id = args[0];
    const id = parseInt(_id);
    const target = alt.Player.all.find((target) => target.id === id);
    if (!target) {
        chat.send(
            player,
            `{FF0000}Der Spieler mit der ID: ${id} ist nicht mehr Online`
        );
        return;
    }

    target.setHealth = 200;
    target.armour = 5;

    chat.send(player, `{FFF000}Du hast ${target.name} wiederbelebt`);
});

chat.registerCmd('id', (player) => {
    chat.send(player, `Deine ID: ${player.id}`);
});
