url = window.location.pathname;
    relativePath = "./";
    urlPath = url.split('/');
    if(urlPath.length > 2){for(i=0;i<urlPath.length-2;i++){relativePath+="../"}}
function addTo(item,input){
    if (item) {
        if(typeof input=="string"){
            item.innerHTML+=input;
        } else {
            item.append(input);
        }
    }
}
function createItem(item,{id,style,input,src,href,title}){
    item = document.createElement(item)
    if(id!==undefined){item.id = id}
    if(style!==undefined){item.classList.add(style)}
    if(src!==undefined){item.src = src}
    if(href!==undefined){item.href = href}
    if(title!==undefined){item.title = title}
    if(input!==undefined){addTo(item,input)}
    return item
}
function addToTag(tag,input) {
    tag = document.getElementsByTagName(tag)[0]
    addTo(tag,input)
}
function addToId(id,input) {
    id = document.getElementById(id)
    addTo(id,input)
}
function addToQuery(query,input) {
    query = document.querySelector(query)
    addTo(query,input)
}
function wrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
}

faviconHTML='<link rel="icon" type="image/x-icon" href="'+relativePath+'meta/favicon.ico">'
if(document.querySelector("header").childNodes.length<1){headerHTML='<img class="main-header" src="'+relativePath+'meta/home.png">';addToTag("header",headerHTML)}

function chatOpen(){document.getElementById("comments").style.display="block";}
function chatClose(){document.getElementById("comments").style.display="none";}
if(document.getElementById("comments")){chatBUTTON='<a title="Open comment box" onclick="chatOpen()" href="#comments">Discuss</a>'} else {chatBUTTON=""}
navHTML='<a href='+relativePath+'index.html><img src="'+relativePath+'meta/hat-sitting.png"></a><div>'+
    '<a title="List of all articles written" href="'+relativePath+'article/index.html">Pages</a>'+
    '<a href="#">Random</a>'+
    chatBUTTON+"</div>"

footerHTML = '<a href="'+relativePath+'meta/about.html">About</a>'+
'<a href="'+relativePath+'blog.html">Blog</a>'+
'<a href="'+relativePath+'meta/index.html" title="Records of what\'s changed">Changelog</a>'

addToTag("head",faviconHTML)
addToTag("nav",navHTML)
addToTag("footer",footerHTML)

sideNavParts=document.querySelectorAll("#sub > H2,#sub > H3")
if(sideNavParts.length>0){
    test=""
    for(i=0;i<sideNavParts.length;i++){
        if(sideNavParts[i].nodeName==="H2"){
            selected=sideNavParts[i].outerText
            selectedAnchor=selected.replaceAll(" ","-")
            sideNavParts[i].id=selectedAnchor
            test+='<div><a href="#'+selectedAnchor+'">'+selected+'</a></div>'
        } else if (sideNavParts[i].nodeName==="H3"){
            selected=sideNavParts[i].outerText
            selectedAnchor=selected.replaceAll(" ","-")
            sideNavParts[i].id=selectedAnchor

            // what in the what????
            if(sideNavParts[i+1]){
                if(sideNavParts[i+1].nodeName==="H2"){test+='<li class="last-item"><a href="#'+selectedAnchor+'">'+selected+'</a></li>'}
                else{test+='<li><a href="#'+selectedAnchor+'">'+selected+'</a></li>'}
            } else {test+='<li class="last-item"><a href="#'+selectedAnchor+'">'+selected+'</a></li>'}
        }
    }
    addToId("side-nav",createItem("div",{id:"side-nav-container"}))
    addToId("side-nav-container",test)
}

images=document.querySelectorAll(".image")
if(images.length>0){
    for(i=0;i<images.length;i++){
        imageContainer=createItem("div",{style:"image"})
        addTo(imageContainer,createItem("h4",{input:images[i].alt}))
        wrap(images[i],imageContainer)
        wrap(images[i],createItem("a",{href:images[i].src}))
    }
}

if(url.includes("article/")){
    fetch(relativePath+"meta/main.json")
        .then((response) => response.json())
        .then((list) => {
            if(document.getElementById("archive")){
                for(i=0;i<list.length;i++){
                    link=getDirectory(list[i]);
                    listItem=createItem("a",{input:list[i].alt,href:link})
                    listItem=createItem("li",{input:listItem})
                    if(typeof list[i].tag === "string"){
                        addToId(list[i].tag,listItem)
                    } else {
                        for(x=0;x<list[i].tag.length;x++){
                            addToId(list[i].tag[x],listItem.cloneNode("deep"))
                        }
                    }
                }
            } else {
                getIndex(list)
                addToId("title",list[currentIndex].alt)
                document.title= list[currentIndex].alt+" | Literal Wiki"

                //WAAAAaaaaAAAAAaahh
                refList=document.querySelectorAll("main a[data-ref]")
                for(i=0;i<refList.length;i++){
                    linkIndex=getRefLink(list,i)

                    if(linkIndex>-1){
                        link=relativePath+"article/"+getDirectory(list[linkIndex]);
                        refList[i].href=link
                        refList[i].title=list[linkIndex].alt
                        if(refList[i].innerHTML===""){refList[i].innerHTML=list[linkIndex].alt}
                    } else {
                        refList[i].innerHTML="??"
                        console.log(i+": Undefined Article")
                    }
                }

                refList=document.querySelectorAll("main sup[data-ref]")
                if(refList.length>0){
                    addToId("references",'<div class="padding"><h2>References</h2><div id="referencesList" class="cont no-border"></div></div>')
                }
                refContainer=createItem("ol",{})
                refContainer.start=0
                for(i=0;i<refList.length;i++){
                    
                    if(refList[i].dataset.ref==="#"){
                        ref=createItem("a",{input:refList[i].innerHTML+" - ?"})
                        ref=createItem("li",{input:ref,id:i})
                        refList[i].innerHTML='<a>[citation needed]</a>'
                    }else{
                        ref=createItem("a",{href:refList[i].dataset.ref,input:refList[i].innerHTML})
                        ref.target="_blank"
                        ref=createItem("li",{input:ref,id:i})
                        refList[i].innerHTML='<a href="#'+i+'">['+i+"]</a>"
                    }
                    addTo(refContainer,ref)
                }
                addToId("referencesList",refContainer)
            }
        })
        
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
}

chatBUTTON=""
if(document.getElementById("comments")){
    chatBUTTON='<a title="Open comment box" onclick="chatOpen()" href="#comments">Discuss</a>'
}

addToId("comments",'<p>Have any objections or information you\'d like to add to the page?</p><span title="Close comment box" id="comments-closeButton" onclick="chatClose()">X</span><div><div id="HCB_comment_box">Kindly wait for a momment</div></div><link rel="stylesheet" type="text/css" href="https://www.htmlcommentbox.com/static/skins/bootstrap/twitter-bootstrap.css?v=0" /><style>#HCB_comment_box img{width:auto;display:inline-block;}.home-desc{display:none;}</style>');

window.onload = function(){
    if(document.getElementById("comments")){
        if(!window.hcb_user){hcb_user={};} (function(){var s=document.createElement("script"), l=hcb_user.PAGE || (""+window.location).replace(/'/g,"%27"), h="https://www.htmlcommentbox.com";s.setAttribute("type","text/javascript");s.setAttribute("src", h+"/jread?page="+encodeURIComponent(l).replace("+","%2B")+"&mod=%241%24wq1rdBcg%24lorU9Glfj8bQyg9yk9caG%2F"+"&opts=16798&num=10&ts=1699153972795");if (typeof s!="undefined") document.getElementsByTagName("head")[0].appendChild(s);})();
    }
}