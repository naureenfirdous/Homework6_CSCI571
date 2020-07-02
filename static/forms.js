function clearform()
{
    console.log("Clear Form Called");
    document.getElementById("keywords").value = "";
	document.getElementById("from").value = "";
    document.getElementById("to").value = ""; 
    document.getElementsByName("Sortby")[0].value = "all";
    document.getElementById("Sortby").selectedIndex = 0;
    document.getElementById("condition1").checked = false;
    document.getElementById("condition2").checked = false;
    document.getElementById("condition3").checked = false;
    document.getElementById("condition4").checked = false;
    document.getElementById("condition5").checked = false;
    document.getElementById("seller").checked = false;
    document.getElementById("free").checked = false;
    document.getElementById("expedited").checked = false;

    clearitems();
    
}

function submitform()
{
	console.log("Form Submitted");
	keywords   = document.getElementById("keywords").value;
	from       = document.getElementById("from").value;
	to         = document.getElementById("to").value;
	dropdown   = document.getElementById("Sortby");
	a   	   = dropdown.selectedIndex;
	condition1 = document.getElementById("condition1").checked;
	condition2 = document.getElementById("condition2").checked;
	condition3 = document.getElementById("condition3").checked;
	condition4 = document.getElementById("condition4").checked;
	condition5 = document.getElementById("condition5").checked;
	seller     = document.getElementById("seller").checked;
	free       = document.getElementById("free").checked;
	expedited  = document.getElementById("expedited").checked;				

	from = parseInt(from);
	to = parseInt(to);

	if((from != 0 || to != 0 ) && from >= to)
	{
		alert("Oops! Lower price cannot be greater than upper price limit! Please try again");
		return false;
    }
    
    if(from  < 0 || to  < 0) {
        alert("Price Range values cannot be negative! Please try a value greater than or equal to 0.0");
		return false;
	}

	var query = "findItemsAdvanced?keywords="+keywords+"&from="+from+"&to="+to+"&a="+a+"&condition1="+condition1+"&condition2="+condition2+"&condition3="+condition3+"&condition4="+condition4+"&condition5="+condition5+"&free="+free+"&seller="+seller+"&expedited="+expedited;
	makerequest(query , parse_data);
	return false;

}

function createfilter(count, filterName, filterValue, param) {
	if(param)
		return "&itemFilter(" + count + ").paramName=" + filterName + "&itemFilter(" + count + ").paramValue=" + filterValue;
	else 
	    return "&itemFilter(" + count + ").name=" + filterName + "&itemFilter(" + count + ").value=" + filterValue;
}

function showitems()
{
	document.getElementById("cardscontainer1").classList.remove("hidden");
	document.getElementById("cardscontainer1").classList.add("cardscontainer");
	document.getElementById("cardscontainer2").classList.add("hidden");
	document.getElementById("cardscontainer2").classList.remove("cardscontainer");
	document.getElementById("morebutton").style.display="block";
	document.getElementById("lessbutton").style.display="none";
}

function showmore()
{
	document.getElementById("cardscontainer2").classList.remove("hidden");
	document.getElementById("cardscontainer2").classList.add("cardscontainer");
	document.getElementById("morebutton").style.display = "none";
	document.getElementById("lessbutton").style.display="block";	
	setTimeout(function() { window.scrollTo(0,document.body.scrollHeight);},0.1);
}

function showless()
{
	document.getElementById("cardscontainer2").classList.add("hidden");
	document.getElementById("cardscontainer2").classList.remove("cardscontainer");
	document.getElementById("morebutton").style.display = "block";
	document.getElementById("lessbutton").style.display="none";	
	setTimeout(function() { window.scrollTo(500, 0); }, 0.1);
}

function clearitems()
{
	document.getElementById("cardscontainer1").classList.remove("cardscontainer");
	document.getElementById("cardscontainer1").classList.add("hidden");
	document.getElementById("cardscontainer2").classList.remove("cardscontainer");
	document.getElementById("cardscontainer2").classList.add("hidden");
	document.getElementById("lessbutton").style.display = "none";
	document.getElementById("morebutton").style.display = "none";
	
}

function parse_data(data) {
    console.log("Data Pinged Back");
	console.log(data);

	if(data.status == 'error')
	{
		document.getElementById("morebutton").style.display="none";
		document.getElementById("cardscontainer1").innerHTML = '<h4 class="noresults">No Results found</h4>';
		return;
	}

	items = data.searchResult;
	totalEntries =  Number(data.paginationOutput.totalEntries);
	keywords   = document.getElementById("keywords").value;

	showitems();

	if(totalEntries < 1)
	{
		document.getElementById("morebutton").style.display="none";
		document.getElementById("cardscontainer1").innerHTML = '<h4 class="noresults">No Results found</h4>';
		return;
	}

	html = "";
	html = '<div class="totalEntries">'+totalEntries+' Results found for <i>'+keywords+'</i><hr></div>';
	for(var i = 0; i < totalEntries && i < 3; i++)
	{ 
		html = createhtml(items[i]);
	}
	document.getElementById("cardscontainer1").innerHTML = html;

	if(totalEntries < 3)
	{
		document.getElementById("morebutton").style.display="none";
	}

	html = "";
	for(var i = 3; i < totalEntries && i < 10; i++)
	{ 
		html = createhtml(items[i]);
	}

	document.getElementById("cardscontainer2").innerHTML = html;
}

function createhtml(item) {
		html += '<div class="itemscard" onclick="opentab(this)">';
		//default image
		if(item.galleryURL[0] == "https://thumbs1.ebaystatic.com/pict/04040_0.jpg") {
			html += '<div class="zoom"><img src=\"https://www.csci571.com/hw/hw6/images/ebay_default.jpg\"></div>';
		}
		else {
			html += '<div class="zoom"><img src=\"' + item.galleryURL[0] + '\"></div>';
		}
		html += '<div class="itemscontainer">';
		html += '<h4 class="truncate-with-css-ellipsis"><a href=\"' + item.viewItemURL[0] + '\" target=\"_blank\">' + item.title[0] + '</a></h4>';
        html += '<p>Category: <i>' + item.primaryCategory[0].categoryName + '</i> ';
        html += '<a href=\"' + item.viewItemURL[0] + '\" target=\"_blank\"><img style="opacity:0.5" src=\"https://www.csci571.com/hw/hw6/images/redirect.png\" width="15px" height="15px"></a>'+ '</p>'; 

        if(item.hasOwnProperty('topRatedListing')  && item.topRatedListing[0] == "true") {
			html += '<p>Condition:  ' + item.condition[0].conditionDisplayName + ' ';
            html += '<img class="c" src=\"https://www.csci571.com/hw/hw6/images/topRatedImage.png\" width="25px" height="35px"></p>';
		}
		else {
			html += '<p>Condition: ' + item.condition[0].conditionDisplayName + "</p>";
		}

        var price = item.sellingStatus[0].convertedCurrentPrice[0].__value__;
        if(item.shippingInfo[0].shippingServiceCost[0].__value__ > 0) {
            html += '<p><b>Price: $' + price + ' ( +' + item.shippingInfo[0].shippingServiceCost[0].__value__ + ' for shipping )</b></p>';
		}
		else {
			html += '<p><b>Price: $' + price + "</b></p>";
		}
	
		if(item.returnsAccepted[0] == "true") {
			html += '<p style="display:none">Seller <b>accepts</b> returns</p>';
		}
		else {
			html += '<p style="display:none">Seller <b>does not accept returns</b></p>';
		}

		if(item.shippingInfo[0].shippingServiceCost[0].__value__ == 0.0 && item.shippingInfo[0].expeditedShipping[0] == "true") {
			html += '<p style="display:none">Free Shipping -- Expedited Shipping Available</p>';
		}
		else if(item.shippingInfo[0].shippingServiceCost[0].__value__ == 0.0){
			html += '<p style="display:none">Free Shipping</p>';
		}
		else {
			html += '<p style="display:none">No Free Shipping</p>';
		}

		var second_price = item.sellingStatus[0].convertedCurrentPrice[0].__value__;
        if(item.shippingInfo[0].shippingServiceCost[0].__value__ > 0) {
			html += '<p style="display:none"><b>Price: $' + second_price + ' ( + ' + 
					item.shippingInfo[0].shippingServiceCost[0].__value__ + 
					' for shipping ) </b><i> From  ' +
					item.location[0] + '</i></p>';
		}
		else {
			html += '<p style="display:none"><b>Price: $' + second_price + '</b>  ' +
			'<i> From  ' + item.location[0] + "</i></p>";
		}
		html += '</div>';
		html += '<div style="display:none" class=\"cross\" onclick="closetab(this,event)">&times;</div>';
		html += '</div>';
		return html;
}

