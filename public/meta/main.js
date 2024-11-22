url = window.location.pathname;

relativePath = "./";
urlPath = url.split('/');
if(urlPath.length > 2){for(i=0;i<urlPath.length-2;i++){relativePath+="../"}}


header='<img class="main-header" src="'+relativePath+'meta/home.png">';

navigation='\
<a href="'+relativePath+'index.html"><img src="'+relativePath+'meta/hat-sitting.png"></a>\
<div>\
    <a title="List of all articles written" href="' + relativePath + 'article/index.html">Pages</a>\
    <a href="#">Random</a>\
    <a id="chatButton" title="Open comment box" onclick="chatOpen()" href="#comments">Discuss</a>\
</div>\
'

footer='\
<a href="' + relativePath + 'meta/about.html">About</a>\
<a href="' + relativePath + 'blog.html">Blog</a>\
'

template='\
<div id="container">\
    <header>' + header + '</header>\
    <nav>' + navigation + '</nav>\
    <main>\
        <div class="flex">\
            <div id="side-nav"></div>\
            <div id="main"></div>\
        </div>\
        <div id="references">\
        </div>\
    </main>\
    <footer>' +  footer + '</footer>\
</div>\
<div id="comments-container"></div>\
'

//-----------------------------

// DA CODE

document.querySelector("body").innerHTML+= template;

main=document.querySelectorAll(".main-content");
for(i=0; i<main.length; i++){
    document.querySelector("#container #main").append(main[i]);
}

if (e=document.querySelector("head")){e.innerHTML+='<link rel="icon" type="image/x-icon" href="'+relativePath+'meta/favicon.ico">'}

// bleh--

sideNavParts=document.querySelectorAll("#sub > H2,#sub > H3")
if(sideNavParts.length>0){
    sideNavContent=""
    for(i=0;i<sideNavParts.length;i++){
        if(sideNavParts[i].nodeName==="H2"){
            selected=sideNavParts[i].outerText
            selectedAnchor=selected.replaceAll(" ","-")
            sideNavParts[i].id=selectedAnchor
            sideNavContent+='<div><a href="#'+selectedAnchor+'">'+selected+'</a></div>'
        } else if (sideNavParts[i].nodeName==="H3"){
            selected=sideNavParts[i].outerText
            selectedAnchor=selected.replaceAll(" ","-")
            sideNavParts[i].id=selectedAnchor

            // what in the what????
            if(sideNavParts[i+1]){
                if(sideNavParts[i+1].nodeName==="H2"){sideNavContent+='<li class="last-item"><a href="#'+selectedAnchor+'">'+selected+'</a></li>'}
                else{sideNavContent+='<li><a href="#'+selectedAnchor+'">'+selected+'</a></li>'}
            } else {sideNavContent+='<li class="last-item"><a href="#'+selectedAnchor+'">'+selected+'</a></li>'}
        }
    }
    sideNavContent='<div id="sideNavContiner">' + sideNavContent + '</div>'
    if(e=document.querySelector("#side-nav")){e.innerHTML=(sideNavContent);}
} else {
    document.getElementById("side-nav").style.flex=0
    document.getElementById("side-nav").style.border=0
}

images=document.querySelectorAll(".image")
if(images.length>0){
    for(i=0;i<images.length;i++){        
        container=document.createElement("div")
        container.classList="image"
        container.innerHTML="<h4>" + images[i].alt + "</h4>"
        
        containerLink=document.createElement("a")
        containerLink.append(container)

        wrap(images[i],container)
    }
}

if(url.includes("article/")){
    fetch(relativePath+"meta/main.json")
        .then((response) => response.json())
        .then((list) => {
            if(document.getElementById("archive")){
                for(i=0;i<list.length;i++){
                    link=getDirectory(list[i]);

                    listItem=document.createElement("li")

                    itemLink=document.createElement("a")
                    itemLink.innerHTML=list[i].alt
                    itemLink.href=link

                    listItem.append(itemLink)

                    if(typeof list[i].tag === "string"){                        
                        if(e=document.getElementById(list[i].tag)){e.append(listItem)}
                    } else {
                        for(x=0;x<list[i].tag.length;x++){
                            if(e=document.getElementById(list[i].tag[x])){e.append(listItem.cloneNode("deep"))}
                        }
                    }
                }
            } else {
                getIndex(list)
                if(e=document.querySelector("#title")){e.innerHTML=list[currentIndex].alt;}
                document.title= list[currentIndex].alt+" | Literal Wiki"

                refList=document.querySelectorAll("main a[data-ref]")
                for(i=0;i<refList.length;i++){
                    linkIndex=getRefLink(list,i)

                    if(linkIndex>-1){
                        link=relativePath+"article/"+getDirectory(list[linkIndex]);
                        refList[i].href=link+refList[i].href
                        refList[i].title=list[linkIndex].alt
                        if(refList[i].innerHTML===""){refList[i].innerHTML=list[linkIndex].alt}
                    } else {
                        refList[i].innerHTML+="(?)"
                    }
                }

                // Change the create element thingy later
                refList=document.querySelectorAll("main sup[data-ref]")
                if(refList.length>0){

                refContainer=document.createElement("ol")
                refContainer.start=0
                for(i=0;i<refList.length;i++){
                    if(refList[i].dataset.ref==="#"){
                        refLink=document.createElement("a")
                        refLink.innerHTML=refList[i].innerHTML+" - ?"

                        ref=document.createElement("li")
                        ref.id= i
                        ref.append(refLink)
                        refList[i].innerHTML='<a>[citation needed]</a>'
                    }else{
                        refLink=document.createElement("a")
                        refLink.href=refList[i].dataset.ref
                        refLink.innerHTML=refList[i].innerHTML
                        refLink.target="_blank"

                        ref=document.createElement("li")
                        ref.id= i
                        ref.append(refLink)

                        refList[i].innerHTML='<a href="#'+i+'">['+i+"]</a>"
                    }
                    refContainer.append(ref)
                }
                document.getElementById("references").innerHTML='<div id="referencesList" class="padding"><h2>References: </h2></div>'
                document.getElementById("referencesList").append(refContainer)
                }

            }
        })
}


// what the funk
function wrap(el, wrapper) {el.parentNode.insertBefore(wrapper, el);wrapper.appendChild(el);}

function getRefLink(x,y){
    y=refList[y].dataset.ref.toLowerCase();
    for(z=0;z<x.length;z++){
        if(x[z].link===y){
            return z
        }
    }
    return -1
}

function getDirectory(x){
    directory = "";
    if(typeof x.tag === "string"){
        if(x.tag!=="misc"){
            directory = x.tag+"/"
        }
    } else {
        if(x.tag[0]!=="misc"){
            directory = x.tag[0]+"/"
        }
    }
    return directory+x.link+".html"
}

function getIndex(z){
    currentIndex = -1;
    currentFile = url.substring(url.lastIndexOf('/'));
    currentFile = currentFile.replaceAll("/","")
    currentFile = currentFile.replaceAll(".html","")

    for (i = 0; i < z.length; i++) {
        if ( z[i].link === currentFile ) {
            currentIndex = i;
        }
    }
}

// comments 
if (e=document.getElementById("comments")){
    e.innerHTML='<p>Have any objections or information you\'d like to add to the page?</p><span title="Close comment box" id="comments-closeButton" onclick="chatClose()">X</span><div><div id="HCB_comment_box">Kindly wait for a momment</div></div><link rel="stylesheet" type="text/css" href="https://www.htmlcommentbox.com/static/skins/bootstrap/twitter-bootstrap.css?v=0" /><style>#HCB_comment_box img{width:auto;display:inline-block;}.home-desc{display:none;}</style>';
    document.getElementById("comments-container").append(e);
} else{
    document.querySelector("nav a[href='#comments']").style.display="none"
}

window.onload = function(){
    if(document.getElementById("comments")){
        if(!window.hcb_user){hcb_user={};} (function(){var s=document.createElement("script"), l=hcb_user.PAGE || (""+window.location).replace(/'/g,"%27"), h="https://www.htmlcommentbox.com";s.setAttribute("type","text/javascript");s.setAttribute("src", h+"/jread?page="+encodeURIComponent(l).replace("+","%2B")+"&mod=%241%24wq1rdBcg%24lorU9Glfj8bQyg9yk9caG%2F"+"&opts=16798&num=10&ts=1699153972795");if (typeof s!="undefined") document.getElementsByTagName("head")[0].appendChild(s);})();
    }
}

function chatOpen(){document.getElementById("comments").style.display="block";}
function chatClose(){document.getElementById("comments").style.display="none";}