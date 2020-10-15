$( document ).ready(function() {
    window.onscroll = function() {
        if(document.documentElement.scrollTop> 50){
            $('#top-header').css('background','#d3d3d3');
            $('.header').css('margin-top','0.3em');
        } else {
            $('#top-header').css('background','transparent');
            $('.header').css('margin-top','2.3em');
        };   
    };
});