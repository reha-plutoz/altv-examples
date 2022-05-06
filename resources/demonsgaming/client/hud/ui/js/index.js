alt.on('hud:character', (data) => {
    $('#cash').text(data.cash);
    $('#bank').text(data.bank);
});

alt.on('hud:vehicle', (data) => {
    if(data.vehicle)
    {
        $('#vehicle').show();
        $('#speed').text(data.speed);
    } else {
        $('#vehicle').hide();
    }
});
