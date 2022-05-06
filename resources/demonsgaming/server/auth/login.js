/// <reference types="@altv/types-server" />
import alt from 'alt-server';
import Sql from '../database/db';
import bcrypt from 'bcryptjs';
import * as Administration from '../administration/index.js';

const db = new Sql();

alt.onClient('loginUser', async (player, username, password) => {
  let loggedAccount = alt.Player.all.find((p) => p.loggedInAs === username);

  if (loggedAccount) {
    alt.emitClient(player, 'auth:closeLogin');
    return Administration.kick(player, `Der Spielername ${p.loggedInAs} wird bereits von einem anderem Spieler verwendet! Bitte ändere deinen Namen und verbinde dich erneut zum Server.`);
  }

  let accounts = await db.query('SELECT * FROM `account` WHERE `mail` = ? OR `username` = ?', [username, username]);

  if (0 === accounts.length) {
    alt.emitClient(player, 'notification:fromServer', {text: 'Bitte überprüfe deine Eingaben!', time: 5000, type: 'warning'})
  } else {
    let account = accounts[0];

    bcrypt.compare(password, account.password, function (err, res) {
      if (res) {
        if(0 === account.whitelist)
        {
          alt.emitClient(player, 'notification:fromServer', {
            text: 'Du befindest dich nicht auf der Whitelist!',
            time: 5000,
            type: 'warning'
          })
            //
          return;
        }

        player.setSyncedMeta('account', {
          id: account.id,
          username: account.username,
          socialid: account.social_id,
          hwid: account.hwid,
          adminlevel: account.adminlevel,
          whitelist: account.whitelist,
        });
        alt.emitClient(player, 'auth:closeLogin');
        alt.emit('character:init', player)
        alt.emit('sync:Player', player);
      } else {
        alt.emitClient(player, 'notification:fromServer', {
          text: 'Bitte überprüfe deine Eingaben!',
          time: 5000,
          type: 'warning'
        })
      }
    });
  }
});
