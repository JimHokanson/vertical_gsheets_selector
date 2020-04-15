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

*/
    
    
//Next Steps
//----------------------------------------------------------
//1) Learn how to deploy the sidebar app
//2) Chrome extension     
    
function fakeClick(el) {
	//https://stackoverflow.com/questions/61090920/click-all-sheets-in-google-sheets-using-chrome-extension/61091451#61091451
	el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
	el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));  
}

function runNavCode(){
	//initLinksContainer();
	
	//This modification assumes that the application has been loaded
	initLinksContainer2();
	
	populateNavLinks();
	
	//Launches explore button ...
	//openNavDisplay();
}

function populateNavLinks(){
	//Assumes container has been initialized ...
	
	parent = document.getElementById('jim-links-container')
		
	sheet_tags = document.getElementsByClassName('docs-sheet-tab-name');
		
	//TODO: First look for old and delete listeners
		parent.innerHTML = '';
	
		
	for (var i = 0; i < sheet_tags.length; i++) {
		tag = document.createElement('button');
		let sheet_name = sheet_tags[i].textContent;
		tag.textContent = sheet_name;
		tag.style.display = 'block';
		//Not allowed
		//div_tag.onmousedown = `clickSheet(${sheet_name})`;
		parent.appendChild(tag);
		//
		tag.addEventListener("click",function(event){
			clickSheet(sheet_name);
			//event.stopPropagation();
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


function openNavDisplay(){
	//Resize must occur before this ...
	
	explore_button = document.querySelector('.waffle-assistant-entry-label');
	fakeClick(explore_button);
}

function initLinksContainer2(){

	sidebar = document.querySelector('.script-application-sidebar-content');
	sidebar.innerHTML = '<div id="jim-links-container"></div>';
		
}

/*
function initLinksContainer(){
	
	//For now we'll overload the explore toolbar
	//Ideally we could handle the resize aspects
	explore_bar = document.querySelector('.waffle-sidebar-container');
	
	//By default it is >300 px
	//Note, we currently don't handle resizing things, we're relying on existing code
	//so this size must be set before we make the explore bar visible
	explore_bar.style.width='200 px';
	
	//Not sure what height to use ...
	//Initialize the text display window - we'll add values in this container
   explore_content_container = document.querySelector('.waffle-sidebar-content');
   explore_content_container.insertAdjacentHTML('beforebegin',
    '<div id="jim-links-container" style="height: 400px;"></div>');
	
}
*/
