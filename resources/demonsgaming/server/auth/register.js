/// <reference types="@altv/types-server" />
import alt from 'alt-server';
import Sql from '../database/db';
import bcrypt from 'bcryptjs';

const db = new Sql();

alt.onClient('registerUser', async (player, mail, username, password) => {
  let accounts = await db.query('SELECT * FROM `account` WHERE `mail`=? OR `username`=?', [username, username]);

  if (accounts.length > 0) {
    alt.emitClient(player, 'notification:fromServer', 'Es existiert bereits ein Account mit den angegebenen Daten!')
  } else {
    bcrypt.hash(password, 10, async function (err, hash) {
      if (err) return alt.emitClient(player, 'error');

      const data = [
        0,
        mail,
        username,
        hash,
        player.socialId,
        player.hwidHash,
        0
      ];

      await db.insert('INSERT INTO `account` (`id`,`mail`,`username`,`password`,`social_id`,`hwid`,`whitelist`) VALUES (?, ?, ?, ?, ?, ?, ?)', data);
    });
    alt.emitClient(player, 'initLogin');
  }
});
