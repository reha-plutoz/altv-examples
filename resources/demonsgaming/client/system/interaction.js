/// <reference types="@altv/types-client"/>
/// <reference types="@altv/types-natives" />
import * as alt from 'alt'
import * as native from 'natives';

alt.onServer('interaction:loadMarkers', interactions => {
    interactions.forEach(item => {
        alt.log(item.pos.x)
        alt.log(item.pos.y)
        alt.log(item.pos.z)
        native.drawMarker(
          1,
          item.pos.x,
          item.pos.y,
          item.pos.z,
          0,         // dirX
          0,         // dirY
          0,         // dirZ
          0,         // rotX
          0,         // rotY
          0,         // rotZ
          3,         // scaleX
          3,         // scaleY
          3,         // scaleZ
          255,         // R
          255,         // G
          255,       // B
          100,       // A
          false,     // bobUpAndDown ?
          false,     // faceCamera ?
          2,         // p19 ?
          false,     // rotate ?
          undefined, // textureDict ?
          undefined, // textureName ?
          false      // drawOnEnts ?
        );
    })
})
