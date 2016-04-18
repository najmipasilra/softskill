/*
* objectlife.js
* ! bukan plugin !
* 
* ditulis oleh Adi Nugraha Yunanda
* nug_9@yahoo.co.id
* http://nagimi.com/
*/

/*
* jQuery versi terakhir sangat diperlukan.
*/

/*
* BETA! artinya masih banyak BUG!
*/

// antisipasi jika easing tidak terlampir
if(!jQuery.easing.easeOutBack || !jQuery.easing.easeInOutExpo){
    // sumber kode : http://gsgd.co.uk/sandbox/jquery/easing/
    jQuery.extend( jQuery.easing, {
        easeOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeInOutExpo: function (x, t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    });
}

// Mulai Program
var prodthumb = (function(a){
    this.obj = [];
    this.deft = {
        trigger : {
            arahKiri:"[dngData=\"left-trig\"]",
            arahKanan:"[dngData=\"right-trig\"]"
        },
        target : {
            cover: "[dngData=\"overflow\"]",   
            wrapper: "[dngData=\"auto-width\"]", 
            content: "prth", // konten
        },
        autorun : true,
        delay : 4000,       // lama autorun
        shift : 0,          // banyaknya spasi setelah item
        gap : 5,            // lebar pemisah
        speed : 350,        // kecepan slide (klik maupun otomatis)
        knockback : 1000    // kecepatan kembali (dari akhir->awal atau awal->akhir)
    };
    this.sys = {
        actualOffset: 0,
        anim  : false,
        width : 0,
        hover : false,
        spaceBefore : 0
    };
    try{
        this.a = jQuery.extend({},this.deft,this.a);
        this.Prepare();
        this.Trigger();
        (this.a.autorun == true) ? this.Autorun() : null;
    }catch(e){
        console.log("%cERROR %s", "color:#f00; font-size: 10px;", e);
    }
}),
Header = (function(object, param){
    this.obj = [object, {
        id      :null,
        class   :null,
        w : 0, h : 0,
        x : 0, y : 0,
        content : [],
        anim    : false,
        hover   : false,
        index   : 0
    }];
    this.a = {
        trigger : {
            left  : null,
            right : null,
            hover : null
        },
        target  : null
    };
    this.a = $.extend({},this.a,param);
    this.Init();
    this.Trigger();
    this.Autorun();
});
prodthumb.prototype.Prepare = function(){
    var 
        target = this.a.target,
        gap    = this.a.gap,
        temp   = {
            object: [],
            konten: $(target.wrapper).find(target.content),
            slide : 0,
            wrap  : 0
        },
        i      = 0;
    $(target.cover).css({overflow : "hidden"});
    $(target.wrapper).css({ width : 
        function(){
            temp.wrap = temp.konten.width() * (temp.konten.length) + (temp.konten.length-1) * gap;
            return temp.wrap;
        },
        position:"relative"
    });
    $(target.wrapper + " " + target.content).each(function(){
        var o = $(this),
            w = o.width(),
            l = o.offset().left - $(target.wrapper).offset().left,
            c = $(this).find("[image]") || [],
            b = c.attr("image") || [],
            j = "";

        for(i=0;i<b.length;i++){
            j += (b[i] == "\\") ? "/" : b[i];
        }
        c.css({
            backgroundImage: "url('" + j  + "')",
            width: "inherit",
            height: "inherit",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
        }).removeAttr("image");;
        temp.object.push({
            id      : o.attr("id"),
            left    : l,
            width   : w,
            visible : null,
            nav     : {
                    next : ((i  >=  temp.konten.length-1) ? 0 : i+1),
                    prev : ((i  ==  0) ? temp.konten.length : i-1)
            },
            html    : o.html()
        });
        if(i>0)
            o.css({marginLeft:gap});
        i++;
        temp.slide = (temp.slide > w) ? temp.slide : w;
    });
    this.sys.width = temp.slide;
    this.obj       = temp.object;
    this.UpdateOffset();
};
prodthumb.prototype.UpdateOffset = function(){
    var a      = this,
        target = this.a.target,
        i = 0;
    $(target.wrapper + " " + target.content).each(function(){
        if( ( (a.obj[i].left + a.obj[i].width) >= $(target.cover).width() ) || ( -a.sys.width >= a.obj[i].left ) ){
            a.obj[i].visible = false;
        }else{
            a.obj[i].visible = true;
        }
        i++;
    });
    this.obj = a.obj;
    this.Centering();
};
prodthumb.prototype.Centering = function(){
    var temp = ($(this.a.target.cover).width() - this.isVisible() * (this.sys.width + this.a.gap) + this.a.gap)/2;
    this.sys.spaceBefore = temp > 0 ? temp : 0;
    this.sys.actualOffset = this.sys.spaceBefore;
    $(this.a.target.wrapper).css({ left : 
        (function(){
            return this.sys.spaceBefore
    }).bind(this)});
};
prodthumb.prototype.Trigger = function(){
    var ths    = this,
        btn    = ths.a.trigger,
        target = ths.a.target;
    $(btn.arahKiri).click((function(){  this.Left()  }).bind(this));
    $(btn.arahKanan).click((function(){ this.Right() }).bind(this));
    $(target.cover + "," + btn.arahKiri + "," + btn.arahKanan).hover(
        (function(){ this.sys.hover = true }).bind(this),
        (function(){ this.sys.hover = false }).bind(this)
    );
};
prodthumb.prototype.Behavior = function(s,e){
    var ths = this,
        p = this.obj.length;
        i = 1;
    if( isNaN(this.sys.actualOffset) )
        throw new Error("Kesalahan sistem, actualOffset tidak terdefinisi.");
    $(this.a.target.wrapper).animate({left: ths.sys.actualOffset}, {
        duration:s,
        easing:((e === undefined) ? "easeOutBack" : e),
        start:(function(){ this.sys.anim = true }).bind(this),
        complete:(function(){
            this.sys.anim = false;
            if(i == p) this.UpdateOffset();
            i++;
        }).bind(this)
    });
};
prodthumb.prototype.Left = function(a){
    if(!this.sys.anim){
        if( this.maxLeft() ){
            this.sys.actualOffset += this.sys.width + this.a.gap;
            this.Behavior(this.a.speed, "easeOutBack");
        }else{
            this.sys.actualOffset += this.sys.width + this.a.gap;
            this.Behavior(this.a.speed);
            this.sys.actualOffset = this.sys.spaceBefore - (this.sys.width + this.a.gap) * (this.obj.length  + this.a.shift - this.isVisible());
            this.Behavior(this.a.knockback, "easeOutBack");
        }
    }else{
        console.log("%cStop Firing like that, senpai! :(", "color:#f00; font-size: 10px;");
    }
    return "Lihat ke Kiri~";
};
prodthumb.prototype.Right = function(a){
    if(!this.sys.anim){
        if( !this.maxRight() ){
            this.sys.actualOffset -= (this.sys.width + this.a.gap);
            this.Behavior(this.a.speed, "easeOutBack");
        }else{
            this.sys.actualOffset -= (this.sys.width + this.a.gap);
            this.Behavior(this.a.speed);
            this.sys.actualOffset = this.sys.spaceBefore + (this.sys.width + this.a.gap) * this.a.shift;
            this.Behavior(this.a.knockback, "easeOutBack");
        }
    }else{
        console.log("%cStop Firing like that, senpai! :(", "color:#f00; font-size: 10px;");
    }
    return "Lihat ke Kanan~";
};
prodthumb.prototype.isVisible = function(a){
    var x = 0;
    for(i=0;i<this.obj.length-1;i++){
        if(a == -1){ 
            if(this.obj[i].visible === false){x++;}
        }else{       
            if(this.obj[i].visible === true){x++;}
        }   
    }
    return x;
};
prodthumb.prototype.maxLeft = function(){  return (($(this.a.target.cover).offset().left - this.a.gap) > ($(this.a.target.wrapper).offset().left - ((this.sys.width - this.a.gap) * this.a.shift)))};
prodthumb.prototype.maxRight = function(){ return (($(this.a.target.cover).offset().left - $(this.a.target.wrapper).offset().left + this.sys.spaceBefore)>(this.isVisible(-1) * (this.sys.width + this.a.gap)))};
prodthumb.prototype.Autorun = function(){  setInterval((function(){ if(!this.sys.hover) this.Right() }).bind(this), this.a.delay)};
Header.prototype.Init = function(){
    var img  = this.obj[0].find(".dng-content"),
        dim  = {w:0 , h:0},
        temp = [],
        i    = 0,
        loc  = 0;
    dim.w  = this.obj[0].width();
    dim.h  = this.obj[0].height();
    this.obj[0].find("[gData=\"bungkus\"]").css({
        width    : (3*dim.w),
        height   : dim.h,
        position : "relative",
        left     : (0-dim.w)
    }).append("<div class=\"clear\"></div>");
    img.each(function(){
        var ur = $(this).attr("gURL"), l = "";
        for( j = 0 ; j < ur.length ; j++ ){
            l += (ur[j] == "\\") ? "/" : ur[j];
        }
        temp.push({
            id  : $(this).attr("id"),
            class: $(this).attr("class"),
            url : l,
            visible : false,
            offsetX : loc,
            link  : {
                next:((i >= img.length-1) ? 0 : (i+1)),
                prev:(i == 0 ? img.length-1 : i-1)
            }
        });
        if(i<3 || i == img.length){
            $(this).css({
                width  : dim.w,
                height : dim.h,
                float:"left",
                backgroundImage : "url(" + l + ")",
                backgroundSize:"cover"
            }).removeAttr("gURL");

        }else{
            $(this).remove();
        }
        loc += dim.w; i++;
    });
    this.obj[1].content = temp;
    this.obj[1].w  = dim.w;
    this.obj[1].h  = dim.h;
    this.obj[1].x = (0-dim.w);
    this.Add((-1))
};
Header.prototype.Add = function(loc){
    var i = this.obj[1].index,
        elem  = (function(par){ return "<div class=\"" + this.obj[1].content[par].class + "\" id=\"" + this.obj[1].content[par].id  + "\" style=\"width:" + this.obj[1].w + "px;height:" + this.obj[1].h + "px;float:left;background-image:url('" + this.obj[1].content[par].url + "');background-size:cover;\"></div>" }).bind(this);
    if(loc == -1){
        this.obj[0].find("[gData=\"bungkus\"]").prepend(elem(this.obj[1].content[i].link.prev));
        this.Remove(this.obj[1].content[this.obj[1].content[i].link.next].link.next);
    }else if(loc == 1){
        this.obj[0].find("div.clear").remove();
        this.obj[0].find("[gData=\"bungkus\"]").append(elem(this.obj[1].content[i].link.next) + "<div class=\"clear\"></div>");
        this.Remove(this.obj[1].content[this.obj[1].content[i].link.prev].link.prev);
    }else console.log("Unknown object Add(" + loc + ");")
};
Header.prototype.Remove = function(i){
    try{ this.obj[0].find("#" + this.obj[1].content[i].id).remove() }catch(e){ console.log("Unknown object Remove(" + i + ");") }
};
Header.prototype.Behavior = function(k, l, m){
    var obj = this.obj[1],
        i   = 0,
        p   = obj.content.length,
        reset = (0-this.obj[1].w),
        anima = (function(a){
            this.obj[1].anim = a;
            if(a === false)  this.obj[1].x = reset
        }).bind(this),
        objdi = (function(x){ this.Add(x, this.obj[1].index) }).bind(this);
    this.obj[0].find("[gData=\"bungkus\"]").animate({ left : obj.x }, {
        duration : l,
        easing   : (m === undefined ? "swing" : m),
        start    :(function(){ anima(true) }),
        complete :(function(){
            anima(false);
            $(this).css({left:reset});
            objdi(k);
            i++;
        })
    });
};
Header.prototype.Trigger = function(){
    this.a.trigger.left.on("click", (function(){  this.Left()  }).bind(this));
    this.a.trigger.right.on("click", (function(){ this.Right() }).bind(this));
    this.a.trigger.hover.hover(
        (function(){ this.obj[1].hover = true  }).bind(this),
        (function(){ this.obj[1].hover = false }).bind(this)
    );
};
Header.prototype.Left = function(){
    if(!this.obj[1].anim){
        this.obj[1].index = (this.obj[1].index <= 0 ) ? this.obj[1].content.length-1 : this.obj[1].index - 1;
        this.obj[1].x += this.obj[1].w;
        this.Behavior((-1), 500, "easeInOutExpo");
    }
};
Header.prototype.Right = function(){
    if(!this.obj[1].anim){
        this.obj[1].index = (this.obj[1].index >= this.obj[1].content.length-1 ) ? 0 : this.obj[1].index + 1;
        this.obj[1].x -= this.obj[1].w;
        this.Behavior(1, 500, "easeInOutExpo");
    }
};
Header.prototype.Autorun = function(){ setInterval((function(){ if(!this.obj[1].hover) this.Left() }).bind(this), 5000)};
// Akhir Program