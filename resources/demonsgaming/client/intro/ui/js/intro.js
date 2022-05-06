if ('alt' in window) {
    let alt = window.alt;
}

jQuery(document).ready(function () {
    let audio = new Audio('media/MusicStart02.ogg');
    audio.volume = 0.7;
    let musicLoop;
    $('#overlay').fadeOut(3000);

    setTimeout(() => {
        $('#disclaimer').fadeOut(3000);
        setTimeout(() => {
            musicLoop = audio.addEventListener('ended', function() {
                setTimeout(() => {
                    this.currentTime = 0;
                    this.play();
                }, 2000);
            }, false);
            audio.play();
            $('#disclaimer-background').fadeOut(3000);
            setTimeout(() => {
                $('#v-logo').fadeOut(2000);
                setTimeout(() => {
                    $('#dg-logo').fadeIn(3000);
                    setTimeout(() => {
                         $(document).on('keyup', event => {
                             if('Enter' === event.key)
                             {
                                 $(document).off('keyup')
                                 $('#dg-logo').fadeOut(2000);
                                 setTimeout(() => {
                                     $('#overlay').fadeIn(2000);
                                     audio.removeEventListener('ended', musicLoop)
                                     $(audio).animate({volume: 0}, 2000);
                                     setTimeout(() => {
                                         alt && alt.emit('menu:close')
                                     }, 2000)
                                 }, 2000)
                             }
                         })
                    }, 100)
                }, 2000)
            }, 3000)
        }, 3000)
    }, 4000)
});
