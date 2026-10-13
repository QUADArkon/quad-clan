(function(){
'use strict';

var FADE_MS=500;
var currentRandom=null;
var savedScroll=0;

var page=document.getElementById('newsPage');
var box=document.getElementById('randomPictureBox');
var thumb=document.getElementById('randomPictureThumb');
var info=document.getElementById('randomPictureInfo');
var main=document.getElementById('newsMainView');
var viewer=document.getElementById('randomViewer');
var viewerImage=document.getElementById('randomViewerImage');
var viewerInfo=document.getElementById('randomViewerInfo');
var back=document.getElementById('randomBack');
var tools=document.querySelector('.news-tools');

function formatDate(value){
    if(!value || value.length!==8) return value || '';
    return value.slice(6,8)+'/'+value.slice(4,6)+'/'+value.slice(0,4);
}

function makeTrophy(path){
    var parts=path.replace(/\\/g,'/').split('/');
    var file=parts[parts.length-1];
    var player=parts[parts.length-2] || '';
    var match=file.match(/^(\d{4})(\d{2})(\d{2})_/);

    player=player.charAt(0).toUpperCase()+player.slice(1);

    return {
        path:path,
        lines:[
            'Trophies',
            player,
            match ? match[3]+'/'+match[2]+'/'+match[1] : ''
        ]
    };
}

function getLanImagePath(image){
    return typeof image==='string' ? image : image.path;
}

function makeLan(album,image){
    var lines=[album.title];

    if(album.place) lines.push(album.place);

    if(album.id==='quads'){
        lines.push(formatDate(image.date));
    }
    else if(album.dateEnd){
        lines.push(formatDate(album.date)+' - '+formatDate(album.dateEnd));
    }
    else{
        lines.push(formatDate(album.date));
    }

    return {
        path:getLanImagePath(image),
        lines:lines
    };
}

function chooseTrophy(){
    if(typeof trophies==='undefined' || !Array.isArray(trophies) || trophies.length===0) return null;
    return makeTrophy(trophies[Math.floor(Math.random()*trophies.length)]);
}

function chooseLan(){
    if(typeof lanAlbums==='undefined' || !Array.isArray(lanAlbums) || lanAlbums.length===0) return null;

    var pool=[];

    lanAlbums.forEach(function(album){
        if(!album.images) return;
        album.images.forEach(function(image){
            pool.push({album:album,image:image});
        });
    });

    if(pool.length===0) return null;

    var chosen=pool[Math.floor(Math.random()*pool.length)];
    return makeLan(chosen.album,chosen.image);
}

function chooseRandomPicture(){
    var trophy=chooseTrophy();
    var lan=chooseLan();

    if(trophy && lan) return Math.random()<0.5 ? trophy : lan;
    return trophy || lan;
}

function writeInfo(element,lines){
    element.innerHTML='';

    lines.forEach(function(line){
        if(!line) return;
        var div=document.createElement('div');
        div.textContent=line;
        element.appendChild(div);
    });
}

function fade(action,scrollPosition){
    page.classList.add('is-fading');

    window.setTimeout(function(){
        action();
        window.scrollTo(0,scrollPosition || 0);

        requestAnimationFrame(function(){
            requestAnimationFrame(function(){
                page.classList.remove('is-fading');
            });
        });
    },FADE_MS);
}

function renderRandomPicture(){
    currentRandom=chooseRandomPicture();

    if(!currentRandom){
        box.style.display='none';
        return;
    }

    thumb.width=128;
    thumb.height=96;
    thumb.style.width='128px';
    thumb.style.height='96px';
    thumb.style.objectFit='contain';
    thumb.style.display='block';
    thumb.src=currentRandom.path;
    thumb.alt=currentRandom.lines.join(' - ');

    writeInfo(info,currentRandom.lines);
}

function openRandomPicture(){
    if(!currentRandom) return;

    savedScroll=window.pageYOffset || document.documentElement.scrollTop || 0;

    fade(function(){
        tools.style.display='none';
        main.style.display='none';
        viewer.hidden=false;

        viewerImage.src=currentRandom.path;
        viewerImage.alt=currentRandom.lines.join(' - ');

        writeInfo(viewerInfo,currentRandom.lines);
    },0);
}

function closeRandomPicture(){
    fade(function(){
        viewer.hidden=true;
        tools.style.display='';
        main.style.display='';
    },savedScroll);
}

box.addEventListener('click',openRandomPicture);
box.addEventListener('keydown',function(event){
    if(event.key==='Enter' || event.key===' '){
        event.preventDefault();
        openRandomPicture();
    }
});

back.addEventListener('click',function(event){
    event.preventDefault();
    closeRandomPicture();
});

renderRandomPicture();
})();
