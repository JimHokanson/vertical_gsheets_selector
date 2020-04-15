/*
1) Define function for clicking
2) Set width of the explore bar
3) listen for explore click
4) On exploring
    - see if we have any sheets - scrape from temp = wtf.getElementsByClassName('goog-menuitem')
    - name is innerText
    - onclick => run function

?? Can we unregister explore callbacks to speed things up?
- TODO: Make things look pretty
- unregister listeners manually

//hide menus listener
//show menus listener
//add onto menu for showing

Resize events
--------------
1. window resizes
2. hide menus

Next steps
----------------------------------
1. Highlight menu - fix this ...
2. On click, close menu
3. Fix rendering of divs

- remove click look on div when clicked
- highlight current sheet on right side



*/
    
var menuIsHidden = false;
    
function fakeClick(el) {
	//https://stackoverflow.com/questions/61090920/click-all-sheets-in-google-sheets-using-chrome-extension/61091451#61091451
	el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
	el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));  
}

function launchSideBar(){

  //  We launch from the menu so it can't be hidden
  
  //var viewModeButton = document.getElementById('viewModeButton');
  //var tooltip = viewModeButton.getAttribute('data-tooltip')
  //Hidden => Show the menu
  //Not-Hidden => Hide the menu
  //menuIsHidden = tooltip[0] === 'S';

    menuIsHidden = false;
	resizeSidebar(menuIsHidden);
	
	showSidebar();
		
	populateNavLinks();
}

function populateNavLinks(){
	
	sidebar = document.querySelector('.script-application-sidebar-content');
	sidebar.innerHTML = '<div id="jim-links-container" style="background-color: white"></div>';
	
	var parent = sidebar.firstChild
		
	sheet_tags = document.getElementsByClassName('docs-sheet-tab-name');
		
	//TODO: First look for old and delete listeners
	parent.innerHTML = '';
		
	for (var i = 0; i < sheet_tags.length; i++) {
		tag = document.createElement('button');
		let sheet_name = sheet_tags[i].textContent;
		tag.textContent = sheet_name;
		tag.style.display = 'block';
		parent.appendChild(tag);
		
		tag.addEventListener("click",function(event){
			clickSheet(sheet_name);
			},false);

	}
	
}

function clickSheet(sheet_name){
//console.log(`Running click sheet for ${sheet_name}`);

//   In this approach we click on the <div> tags that are in a container
//   that pops up when you click on the all sheets list. An alternative
//	 approach is to just click on the sheets themselves. I didn't try
//   that approach because I was worried that clicking might fail if 
//	 the sheet was not visible.

//console.log(`Trying to click sheet ${sheet_name}`)

sheet_elements = document.getElementsByClassName('docs-sheet-tab-name')
for (var i = 0; i < sheet_elements.length; i++) {
	if (sheet_elements[i].textContent == sheet_name){
    	fakeClick(sheet_elements[i]);
    	break;
  	}
}
}

function closeSidebar(){
  div = document.getElementById('vert-sidebar');
  div.style.display = 'none';
}

function showSidebar(){
  div = document.getElementById('vert-sidebar');
  div.style.display = null;
}

function createSidebar(){
  //to hide, set display to none
	wtf = document.getElementsByTagName('body');
	wtf2 = wtf[0];
	//Creates a div tag at the end of the body
	div_tag = document.createElement('div');
	//56 - hides sidebar
	//64 - at top of menu
	
	//sidebar
	//   - sidebar-header
	//	     - sidebar-title
	//		 - sidebar-close
	//			 - docs-icon goog-inline-block
	//			 - docs-icon-close-white
	//	 - sidebar-content
	
	div_tag.innerHTML = '' + 
	'<div class="script-application-sidebar" id="vert-sidebar" tabindex="0"' + 
			'role="region" docs-stickyfocus="true" style="top: 64px; height: auto;' + 
			'right: 56px; display: none;">' + 
      '<div class="script-application-sidebar-header">' + 
         '<div class="script-application-sidebar-title">Sheets</div>' + 
         '<div class="script-application-sidebar-close" tabindex="0" title="Close sidebar"' + 
                 'aria-label="Close sidebar" role="button">' + 
             '<div class="docs-icon goog-inline-block">' + 
             '<div class="docs-icon-img-container docs-icon-img docs-icon-close-white" aria-hidden="true">&nbsp;</div>' + 
         '</div>' + 
      '</div>' + 
   '</div>' + 
   '<div class="script-application-sidebar-content"></div>' + 
'</div>'
	sidebar = div_tag.firstChild;
	wtf2.appendChild(sidebar);
	
	close = sidebar.querySelector('.script-application-sidebar-close');
	close.addEventListener("click", closeSidebar);
	
	//resizeSidebar();
}

function resizeSidebar(menuIsHidden){

var docsBrandingContainer = document.getElementById('docs-branding-container');
var toolBar = document.getElementById('docs-toolbar-wrapper');
var formulaBar = document.getElementById('formula-bar');

var y1 = docsBrandingContainer.offsetHeight;
var y2 = toolBar.offsetHeight;
var y3 = formulaBar.offsetHeight;

//TODO: y1 can vary depending upon render status, so we hardcode for now
y1 = 64;
//y2 = 40;
//y3 = 24;

//Needed for x1
var companionBar = document.querySelector('.docs-companion-app-switcher-container');
var yScroll = document.querySelector('.native-scrollbar-y');

var x1 = companionBar.offsetWidth;
var x2 = yScroll.offsetWidth;

//TODO: This depends on rendering timing ...
x1 = 56;

console.log(x1);
console.log(x2);

console.log(y1);
console.log(y2);
console.log(y3);

var top, right;

if (menuIsHidden){
  top = y2 + y3;
  right = x2;
}else{
  top = y1 + y2 + y3;
  right = x1 + x2;
}

var sideBar = document.getElementById('vert-sidebar');
sideBar.style.top = top + "px";
sideBar.style.right = right + "px";


}

function createMenu(){

  //Causes a server error
  //
  //wtf = document.querySelector('.companion-guest-app-switcher');
  //
  //div_tag = document.createElement('div');
  //div_tag.textContent = 'X';
  //wtf.insertBefore(div_tag,wtf.firstChild);
  //wtf.appendChild(div_tag);

  menu_items = document.getElementsByClassName('goog-menuitem-content');
  for (var i = 0; i < menu_items.length; i++) {
    if (menu_items[i].textContent == 'Manage add-ons'){
    
    /*
    <div class="goog-menuitem apps-menuitem" role="menuitem" id="5xq0ya:2ki" aria-disabled="false" style="user-select: none;">
  <div class="goog-menuitem-content"><span aria-label="Get add-ons g" class="goog-menuitem-label">
     <span class="goog-menuitem-mnemonic-hint">G</span>et add-ons</span>
  </div>
</div>*/




/*
Unselected ...
<div class="goog-menu goog-menu-vertical docs-material goog-menu-noaccel docs-menu-hide-mnemonics" role="menu" aria-haspopup="true" style="user-select: none; visibility: visible; left: 388.396px; top: 63px; display: none;">

Selected ...
<div class="goog-menu goog-menu-vertical docs-material goog-menu-noaccel docs-menu-hide-mnemonics docs-menu-attached-button-above" style="user-select: none; visibility: visible; left: 388.396px; top: 63px;" role="menu" aria-haspopup="true">



*/
		//TODO: on mouse over I think the style changes
		//goog-menuitem-highlight 
		//TODO: define mouseover and mouseout
		
		//TODO: Consider on clicking calling something that hides the menu ...
		//Can we find a function that does that????
    
    	//Go up 2 because 
    	parent = menu_items[i].parentElement.parentElement;
    	temp = document.createElement('div');
    	temp.innerHTML = '<div class="goog-menuitem apps-menuitem" role="menuitem" aria-disabled="false" id="5xq0ya:123" style="user-select: none;">' + 
      '<div id="vert-tab-div-menu"><span aria-label="Launch Vert Tabs" class="goog-menuitem-label">Launch Vert Tabs</div></div>'
        menu_div = temp.firstChild;
      	parent.appendChild(menu_div);
      
        //console.log(menu_div);
        menu_div.addEventListener("click", launchSideBar);
    	break;
  	}
  }
}

var n_tries = 0;

//todo, can we move this inside anonymous?
function wtfBatman(){
  console.log('wtf')
  console.log(menuIsHidden)
   menuIsHidden = !menuIsHidden;
   
   //docs-header
   //display-none
   if (menuIsHidden){
     //Need to wait
     n_tries = 0;
     waitThenMove();
   }else{
      //TODO: We could wait here too ...
      resizeSidebar(menuIsHidden);
   }
}

function waitThenMove(){
  var docsHeader = document.getElementById('docs-header');
  if (docsHeader.style.display == "none"){
    resizeSidebar(menuIsHidden);
  }else{
    n_tries = n_tries + 1;
    //TODO: If too many then what ...
    setTimeout(function() { waitThenMove(); }, 200);
  }
}


var vertSheetsMain;
(vertSheetsMain = function testLoad(){
  //createMenu()
  //TODO: Instead just check periodically and delay if necessary
  setTimeout(function() { createMenu(); }, 8000);
  createSidebar()
  
  var viewModeButton = document.getElementById('viewModeButton');

  viewModeButton.addEventListener("mousedown", function(){
  	wtfBatman();
  	});
  
  console.log('nope?')
})();
