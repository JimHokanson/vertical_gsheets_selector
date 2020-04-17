/*
Resize events
--------------
1. window resizes
2. hide menus
3. hide the side app thing

Next steps
----------------------------------
1. Handle hiding of the side panel - might require refactoring input to resize
2. Add listener for bottom sheet select updating sidebar
3. resize by dragging
4. delete/rename listener
5. add sheet listener
6. 


//Sidebar structure
//----------------------------------
	//sidebar
	//   - sidebar-header
	//	     - sidebar-title
	//		 - sidebar-close
	//			 - docs-icon goog-inline-block
	//			     - docs-icon-close-white
	//	 - sidebar-content
	//	     - jim-links-container (ID)


//Delete, rename
<div class="goog-menu goog-menu-vertical docs-sheet-tab-menu goog-menu-noicon docs-menu-hide-mnemonics" role="menu" aria-haspopup="true" style="user-select: none; visibility: visible; left: 205.313px; top: 79.9827px; display: none;">
   <div class="goog-menuitem" role="menuitem" id=":z" style="user-select: none;">
      <div class="goog-menuitem-content" style="user-select: none;">Delete</div>
   </div>
   <div class="goog-menuitem" role="menuitem" id=":10" style="user-select: none;">
      <div class="goog-menuitem-content" style="user-select: none;">Duplicate</div>
   </div>
   

//How do we know what's selected??
has class docs-sheet-active-tab




*/
    
var menuIsHidden = false;
var gridHeight;
var n_tries = 0;
var activeTag;
    
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


    showSidebar();
    
    populateNavLinks();
    
	resizeSidebar(true,false,false);

	
}

function populateNavLinks(){
	
	var parent = document.getElementById('jim-links-container');			
	var sheetTags = document.getElementsByClassName('docs-sheet-tab');
		
	//TODO: First look for old and delete listeners
	parent.innerHTML = '';
	activeTag = null;
	
	console.log('asdf');
	console.log(sheetTags.length);
	
	
		
	for (var i = 0; i < sheetTags.length; i++) {
		let tag = document.createElement('button');
		var sourceTag = sheetTags[i];
		var spanTag = sourceTag.querySelector('.docs-sheet-tab-name');
		let sheetName = spanTag.textContent;
		tag.textContent = sheetName;
		tag.style.display = 'block';
		tag.style.width = "100%";
		tag.style.textAlign = "left";
		//tag.style.cssFloat = "left";
		tag.style.overflow = "hidden";
		tag.style.outline = "none";
		tag.style.backgroundColor = '#f1f3f4';
		tag.style.cursor = "pointer";
		tag.style['whiteSpace'] = "nowrap";
		
		//has class docs-sheet-active-tab
		//element.classList.contains(class);
		
		if (sourceTag.classList.contains('docs-sheet-active-tab')){
		    setActive(tag);
		}

		parent.appendChild(tag);
		
		tag.addEventListener("click",function(event){
			removeActive();
			setActive(tag);
			clickSheet(sheetName);
			},false);

	}
	
}

function setActive(tag){
  tag.style.backgroundColor = "#FFF";
  tag.style.color = "#188038";
  tag.style.cursor = "default";
  activeTag = tag;
}

function removeActive(){
  activeTag.style.backgroundColor = '#f1f3f4';
  activeTag.style.color = 'black';
  activeTag.style.cursor = "pointer";
  activeTag = null;
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

	//Creates a div tag at the end of the body
	var div_tag = document.createElement('div');
	//56 - hides sidebar
	//64 - at top of menu
	
	//sidebar
	//   - sidebar-header
	//	     - sidebar-title
	//		 - sidebar-close
	//			 - docs-icon goog-inline-block
	//			     - docs-icon-close-white
	//	 - sidebar-content
	//	     - jim-links-container (ID)
	
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
       '<div class="script-application-sidebar-content">' + 
           '<div id="jim-links-container" style="background-color: white; height: 300px; border: 1px solid; overflow: auto"></div>' +
       '</div>' + 
    '</div>'
    
	var sidebar = div_tag.firstChild;
	
	sidebar.style.width = "auto";
	sidebar.style.minWidth = "100px";
	sidebar.style.height = "auto";
	//sidebar.style['whiteSpace'] = "nowrap";
	//sidebar.style.display = "flex";
	
	var sidebarContent = sidebar.querySelector('.script-application-sidebar-content');
	sidebarContent.style.width = "100%";
	//sidebarContent.style.borderStyle = "solid";
	

	
	var bodyTag = document.getElementsByTagName('body')[0];
	bodyTag.appendChild(sidebar);
	
	close = sidebar.querySelector('.script-application-sidebar-close');
	close.addEventListener("click", closeSidebar);
	
	//resizeSidebar();
}

function resizeSidebar(isStart,hidingMenu,windowResizing){

//is_start
//hiding_menu
//window resizing 

var gridScrollDiv = document.querySelector('.grid-scrollable-wrapper')
if (isStart){
  menuIsHidden = false; 
  gridHeight = gridScrollDiv.offsetHeight;
  resizeSidebarHelper();
}else{
  n_tries = 0;
  //wait until gridHeight has changed ...
  waitForResize(gridScrollDiv,gridHeight);
}
}

function waitForResize(divTag,target){
  if (divTag.offsetHeight != target){
    gridHeight = divTag.offsetHeight;
    resizeSidebarHelper();
  }else{
  	n_tries = n_tries + 1;
  	if (n_tries > 10){
      resizeSidebarHelper();
  	}else{
  	  setTimeout(function() { waitForResize(divTag,target); }, 200);
  	}
  }
}

function resizeSidebarHelper(){

var docsBrandingContainer = document.getElementById('docs-branding-container');
var toolBar = document.getElementById('docs-toolbar-wrapper');
var formulaBar = document.getElementById('formula-bar');

var y1 = docsBrandingContainer.offsetHeight;
var y2 = toolBar.offsetHeight;
var y3 = formulaBar.offsetHeight;

//TODO: y1 can vary depending upon render status, so we hardcode for now
//y1 = 64;
//y2 = 40;
//y3 = 24;

//Needed for x1
var companionBar = document.querySelector('.docs-companion-app-switcher-container');
var yScroll = document.querySelector('.native-scrollbar-y');

var x1 = companionBar.offsetWidth;
var x2 = yScroll.offsetWidth;

//TODO: This depends on rendering timing ...
//x1 = 56;

var top, right;

if (menuIsHidden){
  top = y2 + y3;
  right = x2;
}else{
  top = y1 + y2 + y3;
  right = x1 + x2;
}

var sidebarHeader = document.querySelector('.script-application-sidebar-header')
var rowHeader = document.querySelector('.fixed-table-container')

var gridScrollDiv = document.querySelector('.grid-scrollable-wrapper')


var hleft1 = gridScrollDiv.offsetHeight;
var hleft2 = rowHeader.offsetHeight;

var hright1 = sidebarHeader.offsetHeight;
var hright2 = hleft1 + hleft2 - hright1;

var sideBar = document.getElementById('vert-sidebar');
sideBar.style.top = top + "px";
sideBar.style.right = right + "px";

var sideContent = document.getElementById('jim-links-container');
//-2 is for border :/
sideContent.style.height = (hright2 - 2) + "px";



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
    		
		//TODO: Consider on clicking calling something that hides the menu ...
		//Can we find a function that does that????
    
    	//Go up 2 because 
    	var parent = menu_items[i].parentElement.parentElement;
    	var temp = document.createElement('div');
    	temp.innerHTML = '' + 
    	  '<div class="goog-menuitem apps-menuitem" role="menuitem" ' + 
    	      'aria-disabled="false" id="5xq0ya:123" style="user-select: none;">' + 
              '<div id="vert-tab-div-menu">' + 
                  '<span aria-label="Launch Vert Tabs" class="goog-menuitem-label">Launch Vert Tabs</span></div>' + 
              '</div>'
        menu_div = temp.firstChild;
      	parent.appendChild(menu_div);
      
        //docs-menu-attached-button-above
        //display none
        //console.log(menu_div);
        menu_div.addEventListener("mousedown",function(){
        	parent.classList.remove("docs-menu-attached-button-above");
        	parent.style.display = "none";
        	launchSideBar();
        	});
        menu_div.addEventListener("mouseover",function(){
          menu_div.classList.add("goog-menuitem-highlight");
        });
        menu_div.addEventListener("mouseout",function(){
          menu_div.classList.remove("goog-menuitem-highlight");
        });
    	break;
  	}
  }
}



//todo, can we move this inside anonymous?
function wtfBatman(){
  console.log('wtf')
  //console.log(menuIsHidden)
   menuIsHidden = !menuIsHidden;
   
   //docs-header
   //display-none
   if (menuIsHidden){
     //Need to wait
     n_tries = 0;
     waitThenMove("none",menuIsHidden);
   }else{
     n_tries = 0;
     waitThenMove("",menuIsHidden);
   }
}

function waitThenMove(target,menuBoolean){
  var docsHeader = document.getElementById('docs-header');
  if (docsHeader.style.display == target){
    //console.log("target hidden")
    resizeSidebar(false,menuBoolean,false);
  }else{
    n_tries = n_tries + 1;
    if (n_tries > 20){
    	//console.log(docsHeader.style.display)
    	//console.log(target)
    }else{
    	//TODO: If too many then what ...
    	setTimeout(function() { waitThenMove(target,menuBoolean); }, 200);
    }
  }
}

function windowResized(){
  resizeSidebar(false,false,true)
}


var vertSheetsMain;
(vertSheetsMain = function testLoad(){
  //createMenu()
  //TODO: Instead just check periodically and delay if necessary
  setTimeout(function() { createMenu(); }, 8000);
  
  createSidebar();
  
  //The view mode button toggles between hiding and showing the menus. When the menus are hidden
  //sheets move up and to the right. The rightward movement is from hiding the Google Apps menu (calendar, tasks, & keep).
  var viewModeButton = document.getElementById('viewModeButton');
  viewModeButton.addEventListener("mousedown", function(){
  	wtfBatman();
  	});
  	
  window.addEventListener("resize", windowResized);
  
  console.log('nope?')
})();
