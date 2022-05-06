import alt from 'alt-server';
import Sql from './database/db';
import fs from 'fs';
import path from 'path';
import Sentry from '@sentry/node';

let isConnectionReady = false;

// Start Sentry
Sentry.init({
    dsn: 'https://7085da9d842442e2a49febbabd4b415e@sentry.demons-gaming.cc/2',
});

alt.log('Sentry started');

// Setup Database Connection
new Sql();

alt.on('ConnectionComplete', () => {
    if (isConnectionReady) {
        return;
    }

    isConnectionReady = true;
});

const startupInterval = setInterval(() => {
    alt.log('Checking if connection is ready...');
    if (isConnectionReady) {
        clearInterval(startupInterval);
        LoadFiles();
    }
}, 1000);

function LoadFiles() {
    let filesLoaded = 0;
    const folders = fs.readdirSync(
        path.join(alt.rootDir, '/resources/demonsgaming/server/')
    );
    const filterFolders = folders.filter((x) => !x.includes('.js'));
    for (let i = 0; i < filterFolders.length; i++) {
        const folder = filterFolders[i];
        const files = fs.readdirSync(
            path.join(alt.rootDir, `/resources/demonsgaming/server/${folder}`)
        );
        const filterFiles = files.filter((x) => x.endsWith('.js'));
        for (let f = 0; f < filterFiles.length; f++) {
            const newPath = `./${folder}/${filterFiles[f]}`;
            import(newPath)
                .catch((err) => {
                    console.log('\r\n\x1b[31m[ERROR IN LOADED FILE]');
                    console.log(err);
                    alt.log(`\r\n --> File that couldn't load: ${newPath}`);
                    alt.log(
                        '\r\n\x1b[31mKilling process; failed to load a file. \r\n'
                    );
                    process.exit(1);
                })
                .then((loadedResult) => {
                    if (loadedResult) {
                        filesLoaded += 1;
                        alt.log(`[${filesLoaded}] Loaded: ${newPath}`);
                    } else {
                        alt.log(`Failed to load: ${newPath}`);
                        alt.log('Killing process; failed to load a file.');
                        process.exit(1);
                    }
                });
        }
    }

    setTimeout(() => {
        alt.log('DemonsGaming Ready\r\n');
    }, 500);
}

function stop() {
    alt.logWarning('> Exiting server...');

    try {
        alt.Player.all.forEach((e) => {
            e.kick('Server Restart');
            alt.log(`> Kicked ${e.name} from the server.`);
        });
    } catch (err) {
        console.log(err);
        alt.logError(err);
    }

    alt.logWarning('> Shutting down.');
    setTimeout(() => process.exit(0), 500);
}

/**
 *  Hook NodeJS processes to gamemode handler
 */
process.stdin.resume();
process.on('SIGINT', stop);
