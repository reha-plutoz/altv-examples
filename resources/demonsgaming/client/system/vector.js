/// <reference types="@altv/types-client"/>
/// <reference types="@altv/types-natives" />
import * as alt from 'alt-client';
import * as native from 'natives';

/**
 * Calculates Position between entities.
 *
 * @export
 * @param {Vector3} vector1
 * @param {Vector3} vector2
 * @returns
 */
export function distance(vector1, vector2) {
    if (vector1 === undefined || vector2 === undefined) {
        throw new Error('AddVector => vector1 or vector2 is undefined');
    }

    return Math.sqrt(
        Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2) + Math.pow(vector1.z - vector2.z, 2)
    );
}

/**
 * Loads Animation
 *
 * @export
 * @param {string} dict
 * @returns
 */
export async function loadAnim(dict) {
    return new Promise(resolve => {
        native.requestAnimDict(dict);

        let count = 0;
        let inter = alt.setInterval(() => {
            if (count > maxCountLoadTry) {
                alt.clearInterval(inter);
                return;
            }

            if (native.hasAnimDictLoaded(dict)) {
                resolve(true);
                alt.clearInterval(inter);
                return;
            }

            count += 1;
        }, 5);
    });
}

export class Vector3 {
    x;
    y;
    z;

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
