export function generatePlate () {
    let allowedChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let length = 6;
    let plate = '';

    for (let i = 0; i < length; i++)
    {
        plate += allowedChars.substr(Math.floor(Math.random() * allowedChars.length + 1), 1);
    }

    return plate;
}
