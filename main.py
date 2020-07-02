import flask
from flask import request, jsonify
import requests


app = flask.Flask(__name__)

@app.route('/')
def homepage():
    return app.send_static_file("index.html")


@app.route('/main.css')
def cssfile():
    return app.send_static_file("main.css")


@app.route('/forms.js')
def formfile():
    return app.send_static_file("forms.js")


@app.route('/card_switch.js')
def cardfile():
    return app.send_static_file("card_switch.js")


@app.route('/request.js')
def requestsfile():
    return app.send_static_file("request.js")


@app.route('/cross.svg')
def imagefile():
    return app.send_static_file("cross.svg")


@app.route('/findItemsAdvanced', methods=['GET'])
def findItemsAdvanced():
    print("Backend called successfully")
    query = "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=NaureenF-CS571Web-PRD-92eba3d7e-ea9abf29&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD"
    if request.method == 'GET':
        keywords   = request.args.get('keywords',type=str)
        from_      = request.args.get('from',type=int)
        to_        = request.args.get('to',type=int)
        a          = request.args.get('a',type=int)
        free       = request.args.get('free',type=str)
        seller     = request.args.get('seller',type=str)
        expedited  = request.args.get('expedited',type=str)
        condition1  = request.args.get('condition1',type=str)
        condition2 = request.args.get('condition2',type=str)
        condition3 = request.args.get('condition3',type=str)
        condition4 = request.args.get('condition4',type=str)
        condition5 = request.args.get('condition5',type=str)
        # creating the url for the api call 
        count = 0
        query += "&keywords=" + keywords;   
        sortOrder = ["BestMatch","CurrentPriceHighest","PricePlusShippingHighest","PricePlusShippingLowest"]
        query += "&sortOrder=" + sortOrder[int(a)]; 
        if from_ != None: 
            query += createfilter(str(count), "MinPrice", str(from_),False)
            query += createfilter(str(count), "Currency", "USD",True)
            count+=1
        
        if to_ != None:
            query += createfilter(str(count), "MaxPrice", str(to_),False)
            query += createfilter(str(count), "Currency", "USD",True)
            count+=1
        
        if seller == "true":
            query += createfilter(str(count), "ReturnsAcceptedOnly",str(seller),False)
            count+=1
        
        if free == "true":
            query += createfilter(str(count),"FreeShippingOnly",str(free),False)
            count+=1
        
        if expedited == "true":
            query += createfilter(str(count), "ExpeditedShippingType","Expedited",False)
            count+=1

        cond = [ 0 , 1000, 3000, 4000, 5000, 6000]
        if condition1 == "true" or condition2 == "true" or  condition3 == "true" or condition4 == "true" or condition5 == "true":
            query += "&itemFilter(" + str(count) + ").name=" + "Condition"
            value_count= 0
            cond_values = [ "false", condition1, condition2, condition3, condition4, condition5]
            i=0
            for i in range(len(cond_values)):
                if(cond_values[i] == "true"):
                    query += "&itemFilter(" + str(count) + ").value(" + str(value_count) + ")=" + str(cond[i])
                    value_count+=1
        
        print(query)
        response = requests.get(query)
        data = response.json()
        response.headers["Cache-Control"] = "no-store"
        response.headers["Pragma"] = "no-cache"
        findItemsAdvanced = data.get('findItemsAdvancedResponse')
        if findItemsAdvanced[0].get('ack')[0] == 'Success':
            print("Successful response")
            searchResult = findItemsAdvanced[0].get('searchResult')[0]
            paginationOutput = findItemsAdvanced[0].get('paginationOutput')[0]
            totalEntries = int(paginationOutput.get('totalEntries')[0])
            filtered_items = []
            if totalEntries > 0:
                c = 0
                for item in searchResult['item']:
                    if(item.get('galleryURL') and item.get('primaryCategory') and item.get('viewItemURL') and item.get('condition') and item.get('sellingStatus') and item.get('shippingInfo') and item.get('location')):
                        if(item.get('primaryCategory')[0].get('categoryName') and item.get('condition')[0].get('conditionDisplayName') and item.get('sellingStatus')[0].get('convertedCurrentPrice') and item.get('shippingInfo')[0].get('shippingServiceCost')):
                            filtered_items.append(item)
                            c = c + 1
                    if c == 10 :
                        break
            return jsonify({'status' : 'ok', 'searchResult' : filtered_items, 'paginationOutput' : paginationOutput})
        else:
            return jsonify({'status' : 'error', 'payload' : response.json()})
    else:
        return jsonify({'status' : 'error', 'payload' : response.json()})


def createfilter(count, filterName, filterValue, param):
    if(param == True):
        return "&itemFilter(" + count + ").paramName=" + filterName + "&itemFilter(" + count + ").paramValue=" + filterValue
    else:
        return "&itemFilter(" + count + ").name=" + filterName + "&itemFilter(" + count + ").value=" + filterValue


if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    app.debug = True
    app.run()



