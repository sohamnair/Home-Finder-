function favourites() {   
    var elem = document.getElementById('favouritesButton');
    if (elem.value=="Added!") elem.value = "Add to favourites";
    else elem.value = "Added!";
} 

let commentForm = document.getElementById('postComment');
let cancelButton = document.getElementById('cancelButton');
cancelButton.addEventListener("click",(event)=>{
    commentForm.reset();
});