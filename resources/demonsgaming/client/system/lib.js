/// <reference types="@altv/types-client" />
import alt from 'alt-client';

let cursorCount = 0;

export function showCursor(state = false) {
    if (state) {
        cursorCount += 1;
        try {
            alt.showCursor(true);
        } catch (err) {}
    } else {
        for (let i = 0; i < cursorCount; i++) {
            try {
                alt.showCursor(false);
            } catch (err) {}
        }

        cursorCount = 0;
    }
}
