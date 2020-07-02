function makerequest(url, fun)
{
	//url_host = 'http://127.0.0.1:5000/';
	console.log('Make Request Called');
	var req = false;
	// branch for native XMLHttpRequest object
	if(window.XMLHttpRequest)
	{
		try
		{
			req = new XMLHttpRequest();
		}catch(e) { req = false; }
	// branch for IE/Windows ActiveX version (optional / obsolete)
	}
	else if(window.ActiveXObject)
	{
		try
		{
			req = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e)
		{
			try
			{ req = new ActiveXObject("Microsoft.XMLHTTP"); }
			catch(e) { req = false; }
		}
	}
	if(req)
	{
		//fun is the callback function
		req.onreadystatechange = function() { processReqChange(fun, req); };
		req.open("GET",url, true);
		req.send("");
	}
}

function makerequest_post(url, data, fun)
{
	//url_host = 'http://127.0.0.1:5000/';
	console.log('Make Request Post Called');
	var req = false;
	// branch for native XMLHttpRequest object
	if(window.XMLHttpRequest)
	{
		try
		{
			req = new XMLHttpRequest();
		}catch(e) { req = false; }
	// branch for IE/Windows ActiveX version (optional / obsolete)
	}
	else if(window.ActiveXObject)
	{
		try
		{
			req = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e)
		{
			try
			{ req = new ActiveXObject("Microsoft.XMLHTTP"); }
			catch(e) { req = false; }
		}
	}
	if(req)
	{
		//fun is the callback function
		req.onreadystatechange = function() { processReqChange(fun, req); };
		req.open("POST",url, true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.send(data);
	}
}


function processReqChange(fun, req)
{
	// see slide 19
	// only if req shows "loaded"
	if (req.readyState == 4)
	{
		// only if "OK"
		if (req.status == 200)
		{
			// processing statements req.responseText
			// for JSON
			// and req.responseXML for XML go here...
			console.log("Data Received Successfully")

			fun(JSON.parse(req.responseText));
		}
		else
		{
			alert("There was a problem retrieving the data:\n" +req.statusText);
		}
	}
}
