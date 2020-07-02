function closetab(eventhandler, event)
{
    event.stopPropagation();
	itemscard = eventhandler.parentElement;
	childnodes = itemscard.children;
	itemscontainer = childnodes[1].children;
	console.log(itemscontainer[0].classList);
	itemscontainer[0].classList.add("truncate-with-css-ellipsis");
	itemscontainer[0].style.display = "block";
	itemscontainer[1].style.display = "block";
	itemscontainer[2].style.display = "block";
	itemscontainer[3].style.display = "block";
	itemscontainer[4].style.display = "none";
	itemscontainer[5].style.display = "none";
    itemscontainer[6].style.display = "none";
    childnodes[2].style.display = "none";

	eventhandler.style.display = "none"
}

function opentab(eventhandler)
{
	childnodes = eventhandler.children;
	itemscontainer = childnodes[1].children;
	itemscontainer[0].classList.remove("truncate-with-css-ellipsis");
	itemscontainer[0].style.display = "block";
	itemscontainer[1].style.display = "block";
	itemscontainer[2].style.display = "block";
	itemscontainer[3].style.display = "none";
	itemscontainer[4].style.display = "block";
	itemscontainer[5].style.display = "block";
	itemscontainer[6].style.display = "block";

	childnodes[2].style.display = "block"; // cross sign 
}