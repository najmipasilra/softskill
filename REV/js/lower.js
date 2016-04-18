/*
* Listener
*/
jQuery.event.add(window,"load",function() {
    
    if(particles() === true){
        $("#loading").fadeOut(2000);
        //$("#loading").hide();
    }
});
jQuery.event.add(document,"ready",function() {
    test = new prodthumb();
    head = new Header($("[dngData=\"header\"]"), {
        trigger : {
            hover : $(".header-btn"),
            left  : $(".header-btn .header-left") ,
            right : $(".header-btn .header-right")
        }
    });
});