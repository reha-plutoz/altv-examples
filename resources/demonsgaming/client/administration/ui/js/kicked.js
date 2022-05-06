'use strict';
(function ($, w) {
    $(document).ready(function () {
        $('#reason').text(new URLSearchParams(window.location.search).get('reason'))
    })
})(jQuery, window);
