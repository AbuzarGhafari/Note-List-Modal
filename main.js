
scrollbarllSet();
reloadNoteList();

var noteItemId = 0;

var noteItem = {
    title: ' ',
    description: ' ',
    status: ' ',
    date: '',
    tags: []
};


var noteList = [];



document.querySelector('#note-body').addEventListener('click', function(e){

    // console.log(e.target.parentElement.parentElement);
 
    if(e.target.parentElement.classList.contains('status')){
        // console.log('contains status');

        e.target.parentElement.parentElement.classList.remove('danger', 'warning', 'success', 'other-status');
        e.target.parentElement.parentElement.classList.add(''+e.target.getAttribute('data-attr')+'');
         

        for(var i = 0; i < 4; i++){
            e.target.parentElement.children[i].classList.remove('selected');
        }

        e.target.classList.add('selected');

        noteItemId = e.target.parentElement.parentElement.querySelector('.menu-content .menu').getAttribute('data-noteitemid');

        console.log(noteItemId);

        changeStatusNoteItemInLocalStorage(noteItemId, e.target.getAttribute('data-attr'));


        
        displayNotification('Note Item Status Changed Successfully.');

 
    }else if(e.target.parentElement.parentElement.classList.contains('menu-content')){
        console.log('contains menu-content');
        // console.log(e.target.getAttribute('data-attr'));
 
        console.log(e.target)

        if(e.target.getAttribute('data-attr') == 'edit'){
            
            editNoteListItem(e);

        } else if(e.target.getAttribute('data-attr') == 'completed'){
            // console.log('its completed');
 
            noteListItemCompleted(e);
            changeStatusNoteItemInLocalStorage(e.target.parentElement.getAttribute("data-noteitemid"), "success");
            displayNotification('Note Item Status Changed Successfully.');

        } else if(e.target.getAttribute('data-attr') == 'delete'){
            // console.log('its delete');
            deleteNoteListItem(e);
        }  
 
    }

});
 

document.querySelector('#add-note-modal .status').addEventListener('click', function (e) {
   
    if(e.target.classList.contains('st')){
        for(var i = 1; i < 5; i++)
        document.querySelector('#add-note-modal .status').children[i].classList.remove('selected');
 
        e.target.classList.add('selected'); 
    } 

});




function noteListItemCompleted(e){
    // console.log(e.target.parentElement.parentElement.parentElement.parentElement);
    e.target.parentElement.parentElement.parentElement.parentElement.classList.add('success');
}

var listItem;
function deleteNoteListItem(e){
    // console.log(e.target.parentElement.parentElement.parentElement.parentElement); 
    e.target.parentElement.parentElement.parentElement.parentElement.classList.add('hide'); 
        
    listItem = e.target.parentElement.parentElement.parentElement.parentElement;

    noteItemId = e.target.parentElement.getAttribute('data-noteitemid');
    console.log(noteItemId);
    deleteNoteItemInLocalStorage(noteItemId);
    setTimeout(removeNoteListItem, 500);
    scrollbarllSet();
    displayNotification('Note Item is deleted.');
}

function removeNoteListItem(e) { 
    listItem.remove(); 
}



function addNewNote(){
    resetEverything();
    openModal();
}
 
function saveNote(){

    if(document.querySelector('#add-note-modal #title').value == ""){
        displayAlert('Note Title is Missing!');
        return;
    }
    if(document.querySelector('#add-note-modal #noteDesc').value == ""){
        displayAlert('Note Description is Missing!');
        return;
    }

    noteItem.title = document.querySelector('#add-note-modal #title').value;
    noteItem.description = document.querySelector('#add-note-modal #noteDesc').value;   
    noteItem.status = document.querySelector('#add-note-modal .status .selected').getAttribute('data-attr');
    noteItem.date = getDate();

    for(var i = 0; i < document.getElementsByName('tags').length; i++){
        if(document.getElementsByName('tags').item(i).checked){
            noteItem.tags.push(document.getElementsByName('tags').item(i).value);
        }
    }

    document.querySelector('.note-list .body').insertAdjacentHTML('afterbegin',displayNoteHTML());
    
    storeNoteItemInList();
    closeModal();
    resetEverything();
    scrollbarllSet();
    displayNotification('New Note Item is Added Successfully.');
}

function displayNoteHTML()
{    
    var noteHtml = `
    <div class="note-item new-note-item ${noteItem.status}">

        <div class="flex">
            <h4>${noteItem.title}</h4>
            <div class="menu-content">
                <div class="icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="menu"  data-noteItemId="${noteItemId++}">
                    <a href="#" data-attr="edit">Edit</a>
                    <a href="#" data-attr="completed">Completed</a>
                    <a href="#" data-attr="delete">Delete</a>
                </div>
            </div>
        </div>
        <p class="date">Added on ${noteItem.date}</p>
        <p class="desc">${noteItem.description}</p>
        <div class="badges">`;

        noteItem.tags.forEach(tag => {
            noteHtml +=`<div class="badge">${tag}</div>`;
        });

        noteHtml +=`
        </div>
        <div class="status">
            <div class="danger ${ noteItem.status == 'danger' ? 'selected' : '' }" data-attr="danger"></div>
            <div class="warning ${ noteItem.status == 'warning' ? 'selected' : '' }" data-attr="warning"></div>
            <div class="success ${ noteItem.status == 'success' ? 'selected' : '' }" data-attr="success"></div>
            <div class="normal ${ noteItem.status == 'normal' ? 'selected' : '' }" data-attr="normal"></div>
        </div>
    </div>`;

    return noteHtml;


}


var editItemBox;
var noteItemId;

function editNoteListItem(e){
    
    resetNoteItemObject();
    editItemBox = e.target.parentElement.parentElement.parentElement.parentElement;
    
    console.log(editItemBox);
    
    
    noteItem.title = editItemBox.querySelector('h4').innerText;
    noteItem.description = editItemBox.querySelector('.desc').innerText;

    editItemBox.querySelectorAll('.badge').forEach(b => {
        noteItem.tags.push( b.innerText);
    });

    console.log(editItemBox);
    console.log(editItemBox.querySelector('.status .selected').getAttribute('data-attr'));
    noteItem.status = editItemBox.querySelector('.status .selected').getAttribute('data-attr');


    console.log(e.target.parentElement.getAttribute('data-noteItemId'));
    noteItemId = e.target.parentElement.getAttribute('data-noteItemId');
    

    setNoteItemInEditModal();

    openModal();

}

function saveEditNote(){
    resetNoteItemObject();
    
    if(document.querySelector('#add-note-modal #title').value == ""){
        displayAlert('Note Title is Missing!');
        return;
    }
    if(document.querySelector('#add-note-modal #noteDesc').value == ""){
        displayAlert('Note Description is Missing'); 
        return;
    }

    noteItem.title = document.querySelector('#add-note-modal #title').value;
    noteItem.description = document.querySelector('#add-note-modal #noteDesc').value;   
    noteItem.status = document.querySelector('#add-note-modal .status .selected').getAttribute('data-attr');
    noteItem.date = getDate();

    for(var i = 0; i < document.getElementsByName('tags').length; i++){
        if(document.getElementsByName('tags').item(i).checked){
            noteItem.tags.push(document.getElementsByName('tags').item(i).value);
        }
    }

    editNoteListInLocalStorage(noteItemId);
    displayEditNoteHTML();
    closeModal();
    resetEverything();
    displayNotification('Note Item is Edited Successfully.');
}

function displayEditNoteHTML(){
    
    editItemBox.querySelector('h4').innerText = noteItem.title;
    editItemBox.querySelector('.desc').innerText = noteItem.description;
    editItemBox.querySelector('.date').innerText = `Edited on ${noteItem.date}`;
    var badgeHtml = ''
    noteItem.tags.forEach(tag => {
        badgeHtml +=`<div class="badge">${tag}</div>`;
    });
    editItemBox.querySelector('.badges').innerHTML = badgeHtml;
    editItemBox.classList.remove('danger', 'success', 'warning');
    editItemBox.classList.add(noteItem.status);
    editItemBox.querySelector('.status .selected').classList.remove('selected');

    // console.log(editItemBox.querySelector('.status .'+noteItem.status+''));
    // console.log(noteItem.status);
    editItemBox.querySelector('.status .'+noteItem.status+'').classList.add('selected');
}


function setNoteItemInEditModal() {
    
    document.querySelector('#add-note-modal #title').value = noteItem.title;
    document.querySelector('#add-note-modal #noteDesc').value = noteItem.description;

    console.log(noteItem.status);

    for(var i = 1; i < 5; i++)
        document.querySelector('#add-note-modal .status').children[i].classList.remove('selected');
    
    for(var i = 1; i < 5; i++){
        if(document.querySelector('#add-note-modal .status').children[i].getAttribute('data-attr') == noteItem.status){
            document.querySelector('#add-note-modal .status').children[i].classList.add('selected');
        }
    }
    
    for(var i = 0; i < document.getElementsByName('tags').length; i++){
        noteItem.tags.forEach(tag => {
            // console.log(tag);
            if(document.getElementsByName('tags').item(i).value == tag)
                document.getElementsByName('tags').item(i).checked = true;
        });
    }

    document.querySelector('#add-note-modal h3').innerText = 'Edit Note';
    document.querySelector('#add-note-modal #editbtn').style.display = 'inline-block';
    document.querySelector('#add-note-modal #savebtn').style.display = 'none';

}

function resetNoteModal(){
    document.querySelector('#add-note-modal #title').value = "";
    document.querySelector('#add-note-modal #noteDesc').value = "";
    for(var i = 1; i < 5; i++)
        document.querySelector('#add-note-modal .status').children[i].classList.remove('selected');
    document.querySelector('#add-note-modal .status').children[4].classList.add('selected');
 
        
    for(var i = 0; i < document.getElementsByName('tags').length; i++){
        document.getElementsByName('tags').item(i).checked = false;
    }
}

function resetNoteItemObject(){
    noteItem.title = '';
    noteItem.description = '';
    noteItem.status = '';
    noteItem.tags = [];
    // console.log(noteItem); 
}

function resetEverything(){
    resetNoteModal();
    resetNoteItemObject();
    document.querySelector('#add-note-modal h3').innerText = 'Add Note';
    document.querySelector('#add-note-modal #editbtn').style.display = 'none';
    document.querySelector('#add-note-modal #savebtn').style.display = 'inline-block';
}


function scrollbarllSet()
{
    var body = document.querySelector('.body');
    // console.log(body.getBoundingClientRect());
    // console.log(body.childElementCount);
    // console.log(body.childNodes);

    var bodyHeight = 0;

    for(var i = 0; i < body.children.length; i++){

        // console.log(body.children[i].getBoundingClientRect());
        bodyHeight += body.children[i].getBoundingClientRect().height + 32;
        // console.log(bodyHeight);
    } 

    if(bodyHeight > 560 ){
        body.classList.add('has-scrollbar');
        console.log('has-scrollbar class added');
        console.log(bodyHeight);
    }else{
        body.classList.remove('has-scrollbar');
    }

}


function displayAlert($msg){
    document.querySelector('#alert-dialog-box .msg').innerText = $msg;
    document.querySelector('#alert-dialog-box').classList.add('show');
    setTimeout(hideAlert, 3000);
}

function hideAlert(){
    document.querySelector('#alert-dialog-box').classList.remove('show');
}

function displayNotification($msg){
    document.querySelector('#notification-box .msg').innerText = $msg;
    document.querySelector('#notification-box').classList.add('show');
    setTimeout(hideNotification, 3000);
}

function hideNotification(){
    document.querySelector('#notification-box').classList.remove('show');
}

function getDate(){

    var myDate = new Date();

    return `${myDate.getDate()}/${myDate.getMonth()+1}/${myDate.getFullYear()}`;
    
}

function openModal()
{
    document.querySelector('#add-note-modal').classList.add('show');
}

function closeModal()
{
    document.querySelector('#add-note-modal').classList.remove('show');
}












 


// let myobj_serialized = JSON.stringify(myObject);

// console.log(myobj_serialized);

// localStorage.setItem("myObj", myobj_serialized);
// console.log(localStorage);


// let myobj_deserialized = JSON.parse(localStorage.getItem("myObj"));

// console.log(myobj_deserialized);

// localStorage.clear();
console.log(localStorage);



var noteList = [];

function storeNoteItemInList(){

    var note = {
        title: noteItem.title,
        description: noteItem.description,
        status: noteItem.status,
        date: noteItem.date,
        tags: noteItem.tags,
    };
 
    if(localStorage.getItem("noteList") !== null ){
        
        noteList = JSON.parse(localStorage.getItem("noteList"));

    }
    noteList.push(note); 
    
    // console.log(JSON.stringify(noteList));

    let serializedList = JSON.stringify(noteList);

    localStorage.setItem("noteList", serializedList);

    console.log(localStorage);

}

function editNoteListInLocalStorage($index){
    
    let deserializedList = JSON.parse(localStorage.getItem("noteList"));

    deserializedList[$index].title = noteItem.title;
    deserializedList[$index].description = noteItem.description;
    deserializedList[$index].status = noteItem.status;
    deserializedList[$index].date = noteItem.date;
    deserializedList[$index].tags = noteItem.tags;
    
    localStorage.setItem("noteList", JSON.stringify(deserializedList));

    console.log(deserializedList);
    // reloadNoteList();
}

function deleteNoteItemInLocalStorage(index){
    
    let deserializedList = JSON.parse(localStorage.getItem("noteList"));

    
    deserializedList.splice(index, 1);

    localStorage.setItem("noteList", JSON.stringify(deserializedList));

    console.log(deserializedList);
    // reloadNoteList();
}

function changeStatusNoteItemInLocalStorage(index, status){
    
    let deserializedList = JSON.parse(localStorage.getItem("noteList"));
    
    
    deserializedList[index].status = status;

    localStorage.setItem("noteList", JSON.stringify(deserializedList));

    console.log(deserializedList);
    // reloadNoteList();
}

function reloadNoteList(){
    
    if(localStorage.getItem("noteList") !== null){

        let deserializedList = JSON.parse(localStorage.getItem("noteList"));
        // console.log(deserializedList);
        
        noteItemId = 0;
        
        let noteListHTML = ''
        

        for(var i = deserializedList.length - 1; i >= 0; i--){

            noteItem = deserializedList[i];
            
            noteListHTML +=  displayNoteHTML();
            console.log(noteItem.description);
        }

         
        
        document.querySelector('.note-list .body').innerHTML = noteListHTML;

        scrollbarllSet();
    }

    // console.log(deserializedList);
    // console.log(localStorage);
    // console.log(localStorage.length);

}



// noteItem.title = 'first';
// storeNoteItemInList(); 
// noteItem.title = 'second';
// storeNoteItemInList();

// let deserializedList = JSON.parse(localStorage.getItem("noteList"));

// console.log(deserializedList);
// console.log(deserializedList[0]);
// console.log(deserializedList[1]);

// localStorage.clear();