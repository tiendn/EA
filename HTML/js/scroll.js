$(document).ready(function(){
    $('.back-to-top').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
    $('.back-to-top').tooltip('show');
});