/// <reference types="@altv/types-server" />
import alt from 'alt-server';
import SQL from '../database/db';

// Load the database handler.
const db = new SQL();


alt.Player.prototype.showNotification = function showNotification(message, time = 2000) {
    alt.emitClient(this, 'functions:helpNotification', message, time);
};