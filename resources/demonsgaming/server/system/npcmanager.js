/// <reference types="@altv/types-server" />
import alt from 'alt-server';
import Sql from '../database/db';
import { PedManager } from './pedmanager'
const db = new Sql();

let garages = {};

class NpcManager {
    constructor() {
        this.garages = {};
        this.registerEvents();
    }

    registerEvents() {}

    initialize() {
        db.query('SELECT * FROM npc WHERE `active`=1', (err, rows) => {
            if (err) {
                alt.log(`> Garage loading failed: ${err.message}`);
            } else {
                rows.forEach(row => {
                    this.createColshape(row.id, { x: row.x, y: row.y, z: row.z }, row.type, row.model, row.options);
                });
                alt.log(`> Loaded ${rows.length} garage(s).`);
            }
        });
    }

    createColshape(id, position, type, model, options) {
        let colShape = new alt.ColshapeCylinder(position.x, position.y, position.z - 1, 2, 2);
        colShape.cid = id;
        colShape.playersOnly = true;
        colShape.nameType = type;

        new PedManager(model, {x: position.x, y: position.y, z: position.z - 0.6 }, 0);
        
        garages[id] = {
            colShape
        };
    }

    deleteGarage(id) {
        alt.log('deleteGarage called');
    }
}

export var NPC = new NpcManager();

NPC.initialize();
