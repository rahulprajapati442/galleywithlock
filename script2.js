let gallery = document.getElementById("gallery");
let currentSection = "normal";

window.onload = function(){
    showNormal();
}

// Show Normal Gallery
function showNormal(){
    currentSection = "normal";
    document.getElementById("passwordBox").style.display="none";
    document.getElementById("faceLock").style.display="none";
    loadGallery();
}

// Open Private with Face Scan
function openPrivate(){
    document.getElementById("faceLock").style.display="block";
    document.getElementById("passwordBox").style.display="none";

    setTimeout(()=>{
        document.getElementById("faceLock").style.display="none";
        document.getElementById("passwordBox").style.display="block";
    },3000);
}

// Check / Set Password
function checkPassword(){
    let enteredPass = document.getElementById("privatePass").value;
    let savedPass = localStorage.getItem("privatePassword");

    if(!savedPass){
        localStorage.setItem("privatePassword", enteredPass);
        alert("Private password set successfully!");
        currentSection = "private";
        document.getElementById("passwordBox").style.display="none";
        loadGallery();
        return;
    }

    if(enteredPass === savedPass){
        currentSection = "private";
        document.getElementById("passwordBox").style.display="none";
        loadGallery();
    }else{
        alert("Wrong Password!");
    }
}

// Upload Files
function uploadFiles(){
    let input = document.getElementById("fileInput");
    let files = input.files;

    for(let file of files){
        let reader = new FileReader();

        reader.onload = function(e){
            let items = JSON.parse(localStorage.getItem(currentSection)) || [];
            items.push({
                type:file.type,
                data:e.target.result
            });
            localStorage.setItem(currentSection,JSON.stringify(items));
            loadGallery();
        }

        reader.readAsDataURL(file);
    }

    input.value="";
}

// Load Gallery
function loadGallery(){
    gallery.innerHTML="";
    let items = JSON.parse(localStorage.getItem(currentSection)) || [];

    items.forEach((item,index)=>{
        let div=document.createElement("div");
        div.className="item";

        let media;
        if(item.type.startsWith("image")){
            media=document.createElement("img");
            media.src=item.data;
        }else{
            media=document.createElement("video");
            media.src=item.data;
            media.controls=true;
        }

        let del=document.createElement("button");
        del.innerHTML="X";
        del.className="delete";

        del.onclick=function(){
            items.splice(index,1);
            localStorage.setItem(currentSection,JSON.stringify(items));
            loadGallery();
        }

        div.appendChild(media);
        div.appendChild(del);
        gallery.appendChild(div);
    });
}