/// <reference types="@altv/types-server" />
import alt from 'alt-server';
import SQL from '../database/db';
import { config } from '../configuration/config';
import * as dimensions from '../configuration/dimensions';
import { interactions } from '../util/interaction'

const db = new SQL(); // Get DB Reference

let lastUpdate = 0;

alt.on('character:init', async (player) => {
  let playerAccount = player.getSyncedMeta('account');
  let character = await db.fetchRow(
    'SELECT * FROM `character` WHERE `account_id` = ?',
    [playerAccount.id]
  );
  if ('undefined' !== typeof character) {
    let factions = await db.fetchAll(
      'SELECT f.key, f.title, cf.rank, fr.name AS `rank_name`, cf.on_duty FROM character_faction as cf LEFT JOIN faction as f ON cf.faction_id = f.id LEFT JOIN faction_rank as fr ON cf.faction_id = fr.faction_id AND cf.rank = fr.rank WHERE cf.character_id = ?;',
      [character.id]
    );
    console.log(factions);
    const characterData = {
      id: character.id,
      accountId: character.account_id,
      name: character.name,
      surname: character.surname,
      birthDate: character.birthDate,
      bodySize: character.bodySize,
      playtime: character.playtime,
      lastPosition: JSON.parse(character.last_position),
      health: character.health,
      armour: character.armour,
      cash: character.cash,
      bank: character.bank,
      gender: character.gender,
      face: JSON.parse(character.face),
      mask: JSON.parse(character.mask),
      hair: JSON.parse(character.hair),
      torso: JSON.parse(character.torso),
      pants: JSON.parse(character.pants),
      bag: JSON.parse(character.bag),
      shoes: JSON.parse(character.shoes),
      neck: JSON.parse(character.neck),
      shirt: JSON.parse(character.shirt),
      vest: JSON.parse(character.vest),
      torso2: JSON.parse(character.torso2),
      factions: factions,
    };

    let characterComponents = [
      characterData.face,
      characterData.mask,
      characterData.hair,
      characterData.torso,
      characterData.pants,
      characterData.bag,
      characterData.shoes,
      characterData.neck,
      characterData.shirt,
      characterData.vest,
      { item: 0, color: 0 },
      characterData.torso2,
    ];

    player.health = characterData.health;
    player.armour = characterData.armour;
    player.pos = characterData.lastPosition;
    player.dimension = dimensions.playDimension;

    setShit(player, characterData.gender, characterComponents);

    player.setSyncedMeta('character', characterData);
    alt.emit('PlayerLoggedIn', player);
    alt.emitClient(player, 'SaltyChat_OnConnected');
    alt.emitClient(player, 'interaction:loadMarkers', interactions)
    alt.emitClient(player, 'character:loaded');
  } else {
    // location mugshot / char creation
    player.dimension = parseInt(Math.random() * (32000 - 1) + 1);
    player.pos = { x: 402.80438232421875, y: -996.2901000976562, z: -100.0 };
    alt.emitClient(player, 'character:create');
  }
});

alt.onClient('character:createWithLayout', async (player, data) => {
  let playerAccount = player.getSyncedMeta('account');

  let lastPosition = JSON.stringify({
    x: config.defaultSpawnPoint.x,
    y: config.defaultSpawnPoint.y,
    z: config.defaultSpawnPoint.z,
  });

  let health = 200;
  let armour = 0;
  let cash = 0;
  let bank = 10000;

  let face = JSON.stringify(data.layout[0]);
  let mask = JSON.stringify(data.layout[1]);
  let hair = JSON.stringify(data.layout[2]);
  let torso = JSON.stringify(data.layout[3]);
  let pants = JSON.stringify(data.layout[4]);
  let bag = JSON.stringify(data.layout[5]);
  let shoes = JSON.stringify(data.layout[6]);
  let neck = JSON.stringify(data.layout[7]);
  let shirt = JSON.stringify(data.layout[8]);
  let vest = JSON.stringify(data.layout[9]);
  let torso2 = JSON.stringify(data.layout[11]);

  await db.insert(
    'INSERT INTO `character` (`id`,`account_id`,`name`,`surname`,`birth_date`,`body_size`,`playtime`,`last_position`,`health`,`armour`,`cash`,`bank`,`gender`,`face`,`mask`,`hair`,`torso`,`pants`,`bag`,`shoes`,`neck`,`shirt`,`vest`,`torso2`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [
      0,
      playerAccount.id,
      data.name,
      data.surname,
      data.birthDate,
      data.bodySize,
      0,
      lastPosition,
      health,
      armour,
      cash,
      bank,
      data.gender,
      face,
      mask,
      hair,
      torso,
      pants,
      bag,
      shoes,
      neck,
      shirt,
      vest,
      torso2,
      null,
    ]
  );

  player.setSyncedMeta('character', {
    id: 0,
    account_id: playerAccount.id,
    name: data.name,
    surname: data.surname,
    birthDate: data.birthDate,
    bodySize: data.bodySize,
    playtime: 0,
    last_position: lastPosition,
    health: health,
    armour: armour,
    cash: cash,
    bank: bank,
    gender: data.gender,
    face: face,
    mask: mask,
    hair: hair,
    torso: torso,
    pants: pants,
    bag: bag,
    shoes: shoes,
    neck: neck,
    shirt: shirt,
    vest: vest,
    torso2: torso2,
    factions: [],
  });
  player.spawn(
    config.defaultSpawnPoint.x,
    config.defaultSpawnPoint.y,
    config.defaultSpawnPoint.z,
    1
  );
  player.dimension = dimensions.playDimension;
  alt.emit('PlayerLoggedIn', player);
  alt.emitClient(player, 'SaltyChat_OnConnected');
  alt.emitClient(player, 'character:close');
});

alt.onClient('character:previewLayout', (player, gender, data) => {
  setShit(player, gender, data);
});

alt.onClient('character:save', (player) => {
  savePlayer(player, false);
});

alt.on('character:save', (player) => {
  savePlayer(player, true);
});

function savePlayer(player, force) {
  if (!player) {
    return;
  }

  let now = Date.now();

  if (force || now - lastUpdate > 60) {
    // handle saves
    let character = player.getSyncedMeta('character');

    if (character) {
      db.update(
        'UPDATE `character` SET `health`=?, `armour`=?, `last_position`=? WHERE `id`=?;',
        [player.health, player.armour, JSON.stringify(player.pos), character.id]
      ).then();
    }
  }
}

function setShit(player, gender, data) {
  player.model = 1 === gender ? 'mp_m_freemode_01' : 'mp_f_freemode_01';
  data.forEach((obj, index) => {
    if (0 === index) {
      alt.emitClient(player, 'character:setFace', data[0]);
    } else if (2 === index) {
      alt.emitClient(player, 'character:setHair', data[2]);
    } else {
      alt.emitClient(
        player,
        'character:setComponent',
        index,
        obj.item,
        obj.color
      );
    }
  });
}
