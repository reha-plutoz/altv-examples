import * as alt from 'alt'
import * as native from 'natives'
import * as pedEditCamera from './pedEditCamera.js'
import * as hud from '../hud/index';

const mugshot = { x: 402.80438232421875, y: -996.2901000976562, z: -100.0 }

let inCreator = false
let webview

alt.onServer('character:create', () => {
    inCreator = true

    native.switchOutPlayer(alt.Player.local.scriptID, 1, 0)
    native.switchInPlayer(alt.Player.local.scriptID);
    native.setEntityHeading(alt.Player.local.scriptID, 180);
    native.setEntityCoords(alt.Player.local.scriptID, mugshot.x, mugshot.y, mugshot.z, false, false, false, false);

    native.displayHud(false);
    native.displayRadar(false);
    alt.toggleGameControls(false);

    let interval = alt.setInterval(() => {
        if(!native.isPlayerSwitchInProgress())
        {
            alt.clearInterval(interval)
            initWebview()
        }
    }, 100);

    function initWebview () {
        alt.showCursor(true);

        if (!webview) {
            webview = new alt.WebView('http://resource/client/character/ui/creator.html');
        } else {
            webview.url = 'http://resource/client/character/ui/creator.html';
        }

        webview.focus()

        pedEditCamera.createPedEditCamera()
        pedEditCamera.focusPedEditCamera('all')

        webview.on('character:previewLayout', (player, props) => {
            alt.emitServer('character:previewLayout', player, props)
        })

        webview.on('character:createWithLayout', data => {
            if (0 === data.name.length || 0 === data.surname.length) {
                webview.emit('character:createFailed')
                alt.emit('notification:show', {text: 'Bitte gebe einen Namen an!', time: 5000, type: 'warning'})
                return
            }

            if (0 === data.birthDate.length) {
                webview.emit('character:createFailed')
                alt.emit('notification:show', {text: 'Bitte gebe ein Geburtsdatum an!', time: 5000, type: 'warning' })
                return
            }

            let dateData = data.birthDate.split('.')
            let date = `${dateData[2]}-${dateData[1]}-${dateData[0]}`

            let dateObj = new Date(date)
            let invalidDate = !(dateObj instanceof Date) || !isFinite(dateObj)

            if (invalidDate || 3 !== dateData.length) {
                webview.emit('character:createFailed')
                alt.emit('notification:show', {text: 'Bitte gebe ein gültiges Datum als Geburtsdatum an!', time: 5000, type: 'warning'})
                return
            }

            data.birthDate = date

            if (0 === data.bodySize.length) {
                webview.emit('character:createFailed')
                alt.emit('notification:show', {text: 'Bitte gebe eine Körpergröße an!', time: 5000, type: 'warning'})
                return
            }

            alt.emitServer('character:createWithLayout', data)
        })

        alt.on('character:createFailed', () => {
            webview.emit('character:createFailed')
        })

        webview.on('character:focus', type => {
            pedEditCamera.focusPedEditCamera(type)
        })

        webview.on('character:getRanges', props => {
            webview.emit('character:setRanges', [
                {
                    item: null,
                    color: null,
                },
                {
                    item: native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 1),
                    color: native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 1, props[1].item),
                },
                {
                    item: native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 2),
                    color: native.getNumHairColors(),
                },
                {
                    item: native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 3),
                    color: native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 3, props[3].item),
                },
                {
                    item: native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 4),
                    color: native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 4, props[4].item),
                },
                {
                    item: native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 5),
                    color: native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 5, props[5].item),
                },
                {
                    item: native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 6),
                    color: native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 6, props[6].item),
                },
                {
                    item: native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 7),
                    color: native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 7, props[7].item),
                },
                {
                    item: native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 8),
                    color: native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 8, props[8].item),
                },
                {
                    item: native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 9),
                    color: native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 9, props[9].item),
                },
                {
                    item: null,
                    color: null,
                },
                {
                    item: native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 11),
                    color: native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 11, props[11].item),
                },
            ])
        });
    }
})

alt.onServer('character:setFace', (data) => {
    // SET_PED_HEAD_BLEND_DATA
    native.setPedHeadBlendData(
      alt.Player.local.scriptID,
      data.mother,
      data.father,
      0,
      data.mother,
      data.father,
      0,
      data.face,
      data.skin,
      0.0,
      false
    );
})

alt.onServer('character:setHair', (data) => {
    native.setPedComponentVariation(
      alt.Player.local.scriptID,
      2,
      data.item,
      0,
      0
    );
    // SET_PED_HEAD_BLEND_DATA
    native.setPedHairColor(
      alt.Player.local.scriptID,
      data.color,
      1
    );
})

alt.onServer('character:setComponent', (componentId, drawableId, textureId) => {
    if(inCreator)
    {
        native.setEntityHeading(alt.Player.local.scriptID, 180);
        native.setEntityCoords(alt.Player.local.scriptID, mugshot.x, mugshot.y, mugshot.z, false, false, false, false);
    }
    native.setPedComponentVariation(
      alt.Player.local.scriptID,
      componentId,
      drawableId,
      textureId,
      0
    );
})

alt.onServer('character:setProp', (componentId, drawableId, textureId) => {
    native.setPedPropIndex(
      alt.Player.local.scriptID,
      componentId,
      drawableId,
      textureId,
      false
    )
});

alt.onServer('character:close', () => {
    inCreator = false;
    pedEditCamera.destroyPedEditCamera()
    webview.unfocus();
    webview.destroy();
    webview = undefined;
    alt.showCursor(false);
    native.displayHud(true);
    native.displayRadar(true);
    alt.toggleGameControls(true);
})

alt.onServer('character:loaded', () => {
    native.switchInPlayer(alt.Player.local.scriptID);
    hud.show();
})

alt.setInterval(() => {
    alt.emitServer('character:save');
}, 300000)
