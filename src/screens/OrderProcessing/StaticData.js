import ENUMS from "../../utils/ENUMS";
import { PITSTOP_TYPES } from "../../utils/GV";

export const orderProcessingDummyData = {
  "data": {
    "orderID": 0,
    "order": {
      "OrderEstimateTime": "30 - 40",
      "orderID": 68351625,
      "orderType": 2,
      "orderTypeString": "Normal",
      "jobCategory": 1,
      "jobCategoryString": "Jovi",
      "orderDate": "5:06 PM",
      "amount": 0,
      "orderImage": "stagingtest/Order/2022/2/21/Order_17625.jpg",
      "complaintID": 0,
      "riderID": "",
      "isJobStarted": false,
      "riderName": "",
      "userRating": 0,
      "serviceCharges": 0,
      "totalAmount": 0,
      "feedbackID": 0,
      "payable": false,
      "orderStatusStr": "Live",
      "orderStatus": 1,
      "totalPitstops": 5,
      "gender": 0,
      "riderVehicleID": 0,
      "hasJoviVehicle": false,

      "pitStopsList": [
        {
          "pitstopType": PITSTOP_TYPES.SUPER_MARKET,
          "title": "Mr Vapora - I8",
          "locationTitle": "",
          "description": "pitstop",
          "latitude": 33.6687272,
          "latitudeDelta": 0.0122,
          "longitude": 73.0767917,
          "longitudeDelta": 73.0767917,
          "isVendorConfirmed": false,
          "addressID": 4386,
          "buyForMe": false,
          "jobAmount": 21000,
          "paidAmount": 0,
          "collectedAmount": 0,
          "estimateTime": "00:00",
          "joviJobID": 687414,
          "isSkipped": false,
          "isRestaurant": false,
          "prescriptionImageList": [],
          "jobItemsListViewModel": [
            {
              "jobItemID": 327946,
              "pitstopItemID": 27528,
              "pitstopDealID": 0,
              "pitstopID": 5111,
              "marketName": "Mr Vapora - I8",
              "productItemName": " Rigel 230w Kit",
              "pitStopItemStatus": ENUMS.AVAILABILITY_STATUS.NotAvailable,
              "pitStopItemStatusDescrp": "Available",
              "isPrescriptionRequired": false,
              "quantity": 1,
              "actualQuantity": 1,
              "price": 12500,
              "productAttribute": "Black",
              "productAttributeID": 105,
              "ratings": 0,
              "restaurantProductNotFound": 1,
              "restaurantProductNotFoundDesc": "Call me & confirm",
              "productImageList": [
                {
                  "joviImageID": 0,
                  "joviImage": "staging/SupermarketItem/2021/3/30/Smok Rigel kit (230 W) Black Red_1730.jpg",
                  "joviImageThumbnail": "staging/SupermarketItem/2021/3/30/Thumbnail_Smok Rigel kit (230 W) Black Red_1730.jpg",
                  "fileType": 0
                }
              ],
              "prescriptionDesc": "",
              "concatDescription": "Black",
              "jobItemOptions": [
                {
                  "jobItemOptionID": 150749,
                  "itemOptionID": 4937635,
                  "attributeName": "Black",
                  "addOnPrice": 0
                }
              ],
              "jobDealOptions": [],
              "description": ""
            },
            {
              "jobItemID": 327947,
              "pitstopItemID": 27544,
              "pitstopDealID": 0,
              "pitstopID": 5111,
              "marketName": "Mr Vapora - I8",
              "productItemName": " RPM -160W Pod Kit ",
              "pitStopItemStatus": ENUMS.AVAILABILITY_STATUS.Replaced,
              "pitStopItemStatusDescrp": "Available",
              "isPrescriptionRequired": false,
              "quantity": 1,
              "actualQuantity": 1,
              "price": 8500,
              "productAttribute": "Blue",
              "productAttributeID": 58,
              "ratings": 0,
              "restaurantProductNotFound": 1,
              "restaurantProductNotFoundDesc": "Call me & confirm",
              "productImageList": [
                {
                  "joviImageID": 0,
                  "joviImage": "staging/SupermarketItem/2021/3/30/Smok RPM-160 (160 W)_17750.jpg",
                  "joviImageThumbnail": "staging/SupermarketItem/2021/3/30/Thumbnail_Smok RPM-160 (160 W)_17750.jpg",
                  "fileType": 0
                }
              ],
              "prescriptionDesc": "",
              "concatDescription": "Blue",
              "jobItemOptions": [
                {
                  "jobItemOptionID": 150750,
                  "itemOptionID": 4937636,
                  "attributeName": "Blue",
                  "addOnPrice": 0
                }
              ],
              "jobDealOptions": [],
              "description": ""
            }
          ],
          "enableQRPayment": true,
          "catID": "-2",
          "catTitle": "Groceries",
          "joviJobStatusDesc": "Open",
          "joviJobStatus": 1
        },
        {
          "pitstopType": PITSTOP_TYPES.SUPER_MARKET,
          "title": "RELX - I8",
          "locationTitle": "",
          "description": "pitstop",
          "latitude": 33.6684071,
          "latitudeDelta": 0.0122,
          "longitude": 73.0749215,
          "longitudeDelta": 73.0749215,
          "isVendorConfirmed": false,
          "addressID": 160372,
          "buyForMe": false,
          "jobAmount": 4500,
          "paidAmount": 0,
          "collectedAmount": 0,
          "estimateTime": "00:00",
          "joviJobID": 687415,
          "isSkipped": false,
          "isRestaurant": false,
          "prescriptionImageList": [],
          "jobItemsListViewModel": [
            {
              "jobItemID": 327948,
              "pitstopItemID": 121502,
              "pitstopDealID": 0,
              "pitstopID": 346912,
              "marketName": "RELX - I8",
              "productItemName": "Infinity Black Device",
              "pitStopItemStatus": ENUMS.AVAILABILITY_STATUS.NotAvailable,
              "pitStopItemStatusDescrp": "Available",
              "isPrescriptionRequired": false,
              "quantity": 1,
              "actualQuantity": 1,
              "price": 4500,
              "productAttribute": "",
              "productAttributeID": 0,
              "ratings": 0,
              "restaurantProductNotFound": 1,
              "restaurantProductNotFoundDesc": "Call me & confirm",
              "productImageList": [
                {
                  "joviImageID": 0,
                  "joviImage": "staging/SupermarketItem/2021/10/1/Relx Infinity Device Black Color_142330.jpg",
                  "joviImageThumbnail": "staging/SupermarketItem/2021/10/1/Thumbnail_Relx Infinity Device Black Color_142330.jpg",
                  "fileType": 0
                }
              ],
              "prescriptionDesc": "",
              "concatDescription": "",
              "jobItemOptions": [],
              "jobDealOptions": [],
              "description": ""
            }
          ],
          "enableQRPayment": true,
          "catID": "-2",
          "catTitle": "Groceries",
          "joviJobStatusDesc": "Open",
          "joviJobStatus": ENUMS.JOVI_JOB_STATUS.Open
        },
        {
          "pitstopType": PITSTOP_TYPES.RESTAURANT,
          "title": "The Butcher's Cafe & Grill - I8",
          "locationTitle": "",
          "description": "pitstop",
          "latitude": 33.66889964121358,
          "latitudeDelta": 0.0122,
          "longitude": 73.0766327442362,
          "longitudeDelta": 73.0766327442362,
          "isVendorConfirmed": false,
          "addressID": 156150,
          "buyForMe": false,
          "jobAmount": 934,
          "paidAmount": 0,
          "collectedAmount": 0,
          "estimateTime": "00:15",
          "joviJobID": 687416,
          "isSkipped": false,
          "isRestaurant": true,
          "prescriptionImageList": [],
          "jobItemsListViewModel": [
            {
              "jobItemID": 327949,
              "pitstopItemID": 120416,
              "pitstopDealID": 0,
              "pitstopID": 334108,
              "marketName": "The Butcher's Cafe & Grill - I8",
              "productItemName": "Buffalo Wings",
              "pitStopItemStatus": 1,
              "pitStopItemStatusDescrp": "Available",
              "isPrescriptionRequired": false,
              "quantity": 2,
              "actualQuantity": 2,
              "price": 467,
              "productAttribute": "",
              "productAttributeID": 0,
              "ratings": 0,
              "restaurantProductNotFound": 1,
              "restaurantProductNotFoundDesc": "Call me & confirm",
              "productImageList": [
                {
                  "joviImageID": 0,
                  "joviImage": "staging/RestaurantProduct/2021/9/21/Buffalo Wings_165217.jpg",
                  "joviImageThumbnail": "staging/RestaurantProduct/2021/9/21/Thumbnail_Buffalo Wings_165217.jpg",
                  "fileType": 0
                }
              ],
              "prescriptionDesc": "",
              "concatDescription": "",
              "jobItemOptions": [],
              "jobDealOptions": [],
              "description": ""
            }
          ],
          "enableQRPayment": true,
          "catID": "-2",
          "catTitle": "Restaurants",
          "joviJobStatusDesc": "Open",
          "joviJobStatus": 8
        },
        {
          "pitstopType": PITSTOP_TYPES.JOVI,
          "title": "Zia mobile and pan shop, M39G+R75, I-8 Markaz I 8 Markaz I-8, Islamabad",
          "locationTitle": "",
          "description": "some has a great chance to get the most of your life and the best of the best and best for your kids to get to the ",
          "latitude": 33.669701527495825,
          "latitudeDelta": 0.0122,
          "longitude": 73.07581147179008,
          "longitudeDelta": 0.006346820809248555,
          "isVendorConfirmed": false,
          "addressID": 221303,
          "buyForMe": false,
          "jobAmount": 0,
          "paidAmount": 0,
          "collectedAmount": 0,
          "estimateTime": "01:07",
          "joviJobID": 687418,
          "isSkipped": false,
          "isRestaurant": false,
          "prescriptionImageList": [],
          "jobItemsListViewModel": [],
          "enableQRPayment": false,
          "catID": "0",
          "catTitle": "Jovi",
          "joviJobStatusDesc": "Open",
          "joviJobStatus": 1
        },
        {
          "title": "Unnamed Road, Islamabad, Islamabad Capital Territory, Pakistan",
          "locationTitle": "",
          "description": "",
          "latitude": 33.67406700640167,
          "latitudeDelta": 0.0122,
          "longitude": 73.08656780049205,
          "longitudeDelta": 0.006244549763033177,
          "isVendorConfirmed": false,
          "addressID": 893,
          "buyForMe": false,
          "jobAmount": 0,
          "paidAmount": 0,
          "collectedAmount": 0,
          "estimateTime": "00:00",
          "joviJobID": 687417,
          "isSkipped": false,
          "isRestaurant": false,
          "prescriptionImageList": [],
          "jobItemsListViewModel": [],
          "enableQRPayment": false,
          "catID": "0",
          "catTitle": "",
          "joviJobStatusDesc": "Open",
          "joviJobStatus": 1
        }
      ],
      "prescriptionImageList": [],
      "productNotFoundQDesc": "Ask Before Buying",
      "productNotFoundQ": 2,
      "orderTimerStart": "",
      "userPic": "staging/DashboardBanner/2021/4/6/DefaultProfilePic_133349.jpg",
      "subStatusName": "VendorApproval",
      "showRiderIcon": true,
      "chargeBreakdown": {
        "estimateTime": 0,
        "estimateDistance": 0,
        "estimateTimeCharges": 0,
        "estimateDistanceCharges": 0,
        "estimateServiceTax": 60,
        "chargeRate": 0,
        "noOfPitstops": 0,
        "pitstopCharges": 0,
        "actualTime": 0,
        "actualDistance": 0,
        "actualTimeCharges": 0,
        "pitstopFlatRate": 0,
        "actualDistanceCharges": 0,
        "totalEstimateCharge": 352,
        "totalActualCharge": 0,
        "discount": 0,
        "estimateTotalAmount": 26846,
        "totalProductGST": 0,
        "vendorIncreaseChargeRate": 0
      }
    },
    "success": true,
    "statusCode": 200
  },
  "status": 200,
  "headers": {
    "content-type": "application/json",
    "vary": "Accept-Encoding",
    "date": "Mon, 21 Feb 2022 12:06:29 GMT"
  },
  "config": {
    "url": "/api/Order/OrderDetail/68351625",
    "method": "get",
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MjMzNzYyMDEwNzciLCJqdGkiOiI1ZjIzNGNkMC05MmJiLTQzNTktYTk4OC1lNmZiOWI3YTNkZjgiLCJpYXQiOjE2NDU0NDQwMjEsInJvbCI6ImFwaV9hY2Nlc3MiLCJpZCI6IjgxOTIzMDliLThiMGMtNDMyYS05NWUwLTMzNmE2YWU1OWFlNSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkN1c3RvbWVyIiwiUm9sZU5hbWUiOiJDdXN0b21lciIsImlzQWRtaW4iOiJGYWxzZSIsImlzUmlkZXIiOiJGYWxzZSIsImlzVmVuZG9yIjoiRmFsc2UiLCJuYmYiOjE2NDU0NDQwMjEsImV4cCI6MTY0NTQ0NTIyMSwiaXNzIjoid2ViQXBpIiwiYXVkIjoiaHR0cHM6Ly9zdGFnaW5nLWFwaS5qb3ZpLWFwcC5jb20ifQ.VzOh-7A0tno817_cKnce5D0zkiHq40SHaHC1jGeFgiw",
      "deviceInfo": {
        "deviceModal": "SM-G950U",
        "imei": "5351206f36186fb6",
        "firmware": "8.0.0",
        "coordinatesInfo": {
          "speed": 1.023491382598877,
          "heading": 127.3310775756836,
          "accuracy": 12.574000358581543,
          "altitude": 479.29998779296875,
          "longitude": 73.0749854,
          "latitude": 33.6685758
        },
        "appVersions": {
          "live": "1.3.1",
          "codepush": "1.3.7"
        },
        "androidId": "5351206f36186fb6"
      }
    },
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "baseURL": "https://staging-api.jovi-app.com"
  },
  "request": {
    "UNSENT": 0,
    "OPENED": 1,
    "HEADERS_RECEIVED": 2,
    "LOADING": 3,
    "DONE": 4,
    "readyState": 4,
    "status": 200,
    "timeout": 0,
    "withCredentials": true,
    "upload": {},
    "_aborted": false,
    "_hasError": false,
    "_method": "GET",
    "_response": "{\r\n  \"orderID\": 0,\r\n  \"order\": {\r\n    \"orderID\": 68351625,\r\n    \"orderType\": 2,\r\n    \"orderTypeString\": \"Normal\",\r\n    \"jobCategory\": 1,\r\n    \"jobCategoryString\": \"Jovi\",\r\n    \"orderDate\": \"5:06 PM\",\r\n    \"amount\": 0.0000,\r\n    \"orderImage\": \"stagingtest/Order/2022/2/21/Order_17625.jpg\",\r\n    \"complaintID\": 0,\r\n    \"riderID\": \"\",\r\n    \"isJobStarted\": false,\r\n    \"riderName\": \"\",\r\n    \"userRating\": 0.0,\r\n    \"serviceCharges\": 0.0,\r\n    \"totalAmount\": 0.0000,\r\n    \"feedbackID\": 0,\r\n    \"payable\": false,\r\n    \"orderStatusStr\": \"Live\",\r\n    \"orderStatus\": 1,\r\n    \"totalPitstops\": 5,\r\n    \"gender\": 0,\r\n    \"riderVehicleID\": 0,\r\n    \"hasJoviVehicle\": false,\r\n    \"pitStopsList\": [\r\n      {\r\n        \"title\": \"Mr Vapora - I8\",\r\n        \"locationTitle\": \"\",\r\n        \"description\": \"pitstop\",\r\n        \"latitude\": 33.6687272,\r\n        \"latitudeDelta\": 0.0122,\r\n        \"longitude\": 73.0767917,\r\n        \"longitudeDelta\": 73.0767917,\r\n        \"isVendorConfirmed\": false,\r\n        \"addressID\": 4386,\r\n        \"buyForMe\": false,\r\n        \"jobAmount\": 21000.0000,\r\n        \"paidAmount\": 0.0000,\r\n        \"collectedAmount\": 0.0000,\r\n        \"estimateTime\": \"00:00\",\r\n        \"joviJobID\": 687414,\r\n        \"isSkipped\": false,\r\n        \"isRestaurant\": false,\r\n        \"prescriptionImageList\": [],\r\n        \"jobItemsListViewModel\": [\r\n          {\r\n            \"jobItemID\": 327946,\r\n            \"pitstopItemID\": 27528,\r\n            \"pitstopDealID\": 0,\r\n            \"pitstopID\": 5111,\r\n            \"marketName\": \"Mr Vapora - I8\",\r\n            \"productItemName\": \" Rigel 230w Kit\",\r\n            \"pitStopItemStatus\": 1,\r\n            \"pitStopItemStatusDescrp\": \"Available\",\r\n            \"isPrescriptionRequired\": false,\r\n            \"quantity\": 1,\r\n            \"actualQuantity\": 1,\r\n            \"price\": 12500.0000,\r\n            \"productAttribute\": \"Black\",\r\n            \"productAttributeID\": 105,\r\n            \"ratings\": 0.0,\r\n            \"restaurantProductNotFound\": 1,\r\n            \"restaurantProductNotFoundDesc\": \"Call me & confirm\",\r\n            \"productImageList\": [\r\n              {\r\n                \"joviImageID\": 0,\r\n                \"joviImage\": \"staging/SupermarketItem/2021/3/30/Smok Rigel kit (230 W) Black Red_1730.jpg\",\r\n                \"joviImageThumbnail\": \"staging/SupermarketItem/2021/3/30/Thumbnail_Smok Rigel kit (230 W) Black Red_1730.jpg\",\r\n                \"fileType\": 0\r\n              }\r\n            ],\r\n            \"prescriptionDesc\": \"\",\r\n            \"concatDescription\": \"Black\",\r\n            \"jobItemOptions\": [\r\n              {\r\n                \"jobItemOptionID\": 150749,\r\n                \"itemOptionID\": 4937635,\r\n                \"attributeName\": \"Black\",\r\n                \"addOnPrice\": 0.00\r\n              }\r\n            ],\r\n            \"jobDealOptions\": [],\r\n            \"description\": \"\"\r\n          },\r\n          {\r\n            \"jobItemID\": 327947,\r\n            \"pitstopItemID\": 27544,\r\n            \"pitstopDealID\": 0,\r\n            \"pitstopID\": 5111,\r\n            \"marketName\": \"Mr Vapora - I8\",\r\n            \"productItemName\": \" RPM -160W Pod Kit \",\r\n            \"pitStopItemStatus\": 1,\r\n            \"pitStopItemStatusDescrp\": \"Available\",\r\n            \"isPrescriptionRequired\": false,\r\n            \"quantity\": 1,\r\n            \"actualQuantity\": 1,\r\n            \"price\": 8500.0000,\r\n            \"productAttribute\": \"Blue\",\r\n            \"productAttributeID\": 58,\r\n            \"ratings\": 0.0,\r\n            \"restaurantProductNotFound\": 1,\r\n            \"restaurantProductNotFoundDesc\": \"Call me & confirm\",\r\n            \"productImageList\": [\r\n              {\r\n                \"joviImageID\": 0,\r\n                \"joviImage\": \"staging/SupermarketItem/2021/3/30/Smok RPM-160 (160 W)_17750.jpg\",\r\n                \"joviImageThumbnail\": \"staging/SupermarketItem/2021/3/30/Thumbnail_Smok RPM-160 (160 W)_17750.jpg\",\r\n                \"fileType\": 0\r\n              }\r\n            ],\r\n            \"prescriptionDesc\": \"\",\r\n            \"concatDescription\": \"Blue\",\r\n            \"jobItemOptions\": [\r\n              {\r\n                \"jobItemOptionID\": 150750,\r\n                \"itemOptionID\": 4937636,\r\n                \"attributeName\": \"Blue\",\r\n                \"addOnPrice\": 0.00\r\n              }\r\n            ],\r\n            \"jobDealOptions\": [],\r\n            \"description\": \"\"\r\n          }\r\n        ],\r\n        \"enableQRPayment\": true,\r\n        \"catID\": \"-2\",\r\n        \"catTitle\": \"Groceries\",\r\n        \"joviJobStatusDesc\": \"Open\",\r\n        \"joviJobStatus\": 1\r\n      },\r\n      {\r\n        \"title\": \"RELX - I8\",\r\n        \"locationTitle\": \"\",\r\n        \"description\": \"pitstop\",\r\n        \"latitude\": 33.6684071,\r\n        \"latitudeDelta\": 0.0122,\r\n        \"longitude\": 73.0749215,\r\n        \"longitudeDelta\": 73.0749215,\r\n        \"isVendorConfirmed\": false,\r\n        \"addressID\": 160372,\r\n        \"buyForMe\": false,\r\n        \"jobAmount\": 4500.0000,\r\n        \"paidAmount\": 0.0000,\r\n        \"collectedAmount\": 0.0000,\r\n        \"estimateTime\": \"00:00\",\r\n        \"joviJobID\": 687415,\r\n        \"isSkipped\": false,\r\n        \"isRestaurant\": false,\r\n        \"prescriptionImageList\": [],\r\n        \"jobItemsListViewModel\": [\r\n          {\r\n            \"jobItemID\": 327948,\r\n            \"pitstopItemID\": 121502,\r\n            \"pitstopDealID\": 0,\r\n            \"pitstopID\": 346912,\r\n            \"marketName\": \"RELX - I8\",\r\n            \"productItemName\": \"Infinity Black Device\",\r\n            \"pitStopItemStatus\": 1,\r\n            \"pitStopItemStatusDescrp\": \"Available\",\r\n            \"isPrescriptionRequired\": false,\r\n            \"quantity\": 1,\r\n            \"actualQuantity\": 1,\r\n            \"price\": 4500.0000,\r\n            \"productAttribute\": \"\",\r\n            \"productAttributeID\": 0,\r\n            \"ratings\": 0.0,\r\n            \"restaurantProductNotFound\": 1,\r\n            \"restaurantProductNotFoundDesc\": \"Call me & confirm\",\r\n            \"productImageList\": [\r\n              {\r\n                \"joviImageID\": 0,\r\n                \"joviImage\": \"staging/SupermarketItem/2021/10/1/Relx Infinity Device Black Color_142330.jpg\",\r\n                \"joviImageThumbnail\": \"staging/SupermarketItem/2021/10/1/Thumbnail_Relx Infinity Device Black Color_142330.jpg\",\r\n                \"fileType\": 0\r\n              }\r\n            ],\r\n            \"prescriptionDesc\": \"\",\r\n            \"concatDescription\": \"\",\r\n            \"jobItemOptions\": [],\r\n            \"jobDealOptions\": [],\r\n            \"description\": \"\"\r\n          }\r\n        ],\r\n        \"enableQRPayment\": true,\r\n        \"catID\": \"-2\",\r\n        \"catTitle\": \"Groceries\",\r\n        \"joviJobStatusDesc\": \"Open\",\r\n        \"joviJobStatus\": 1\r\n      },\r\n      {\r\n        \"title\": \"The Butcher's Cafe & Grill - I8\",\r\n        \"locationTitle\": \"\",\r\n        \"description\": \"pitstop\",\r\n        \"latitude\": 33.66889964121358,\r\n        \"latitudeDelta\": 0.0122,\r\n        \"longitude\": 73.0766327442362,\r\n        \"longitudeDelta\": 73.0766327442362,\r\n        \"isVendorConfirmed\": false,\r\n        \"addressID\": 156150,\r\n        \"buyForMe\": false,\r\n        \"jobAmount\": 934.0000,\r\n        \"paidAmount\": 0.0000,\r\n        \"collectedAmount\": 0.0000,\r\n        \"estimateTime\": \"00:15\",\r\n        \"joviJobID\": 687416,\r\n        \"isSkipped\": false,\r\n        \"isRestaurant\": true,\r\n        \"prescriptionImageList\": [],\r\n        \"jobItemsListViewModel\": [\r\n          {\r\n            \"jobItemID\": 327949,\r\n            \"pitstopItemID\": 120416,\r\n            \"pitstopDealID\": 0,\r\n            \"pitstopID\": 334108,\r\n            \"marketName\": \"The Butcher's Cafe & Grill - I8\",\r\n            \"productItemName\": \"Buffalo Wings\",\r\n            \"pitStopItemStatus\": 1,\r\n            \"pitStopItemStatusDescrp\": \"Available\",\r\n            \"isPrescriptionRequired\": false,\r\n            \"quantity\": 2,\r\n            \"actualQuantity\": 2,\r\n            \"price\": 467.0000,\r\n            \"productAttribute\": \"\",\r\n            \"productAttributeID\": 0,\r\n            \"ratings\": 0.0,\r\n            \"restaurantProductNotFound\": 1,\r\n            \"restaurantProductNotFoundDesc\": \"Call me & confirm\",\r\n            \"productImageList\": [\r\n              {\r\n                \"joviImageID\": 0,\r\n                \"joviImage\": \"staging/RestaurantProduct/2021/9/21/Buffalo Wings_165217.jpg\",\r\n                \"joviImageThumbnail\": \"staging/RestaurantProduct/2021/9/21/Thumbnail_Buffalo Wings_165217.jpg\",\r\n                \"fileType\": 0\r\n              }\r\n            ],\r\n            \"prescriptionDesc\": \"\",\r\n            \"concatDescription\": \"\",\r\n            \"jobItemOptions\": [],\r\n            \"jobDealOptions\": [],\r\n            \"description\": \"\"\r\n          }\r\n        ],\r\n        \"enableQRPayment\": true,\r\n        \"catID\": \"-2\",\r\n        \"catTitle\": \"Restaurants\",\r\n        \"joviJobStatusDesc\": \"Open\",\r\n        \"joviJobStatus\": 8\r\n      },\r\n      {\r\n        \"title\": \"Zia mobile and pan shop, M39G+R75, I-8 Markaz I 8 Markaz I-8, Islamabad\",\r\n        \"locationTitle\": \"\",\r\n        \"description\": \"some has a great chance to get the most of your life and the best of the best and best for your kids to get to the \",\r\n        \"latitude\": 33.669701527495825,\r\n        \"latitudeDelta\": 0.0122,\r\n        \"longitude\": 73.07581147179008,\r\n        \"longitudeDelta\": 0.006346820809248555,\r\n        \"isVendorConfirmed\": false,\r\n        \"addressID\": 221303,\r\n        \"buyForMe\": false,\r\n        \"jobAmount\": 0.0,\r\n        \"paidAmount\": 0.0000,\r\n        \"collectedAmount\": 0.0000,\r\n        \"estimateTime\": \"01:07\",\r\n        \"joviJobID\": 687418,\r\n        \"isSkipped\": false,\r\n        \"isRestaurant\": false,\r\n        \"prescriptionImageList\": [],\r\n        \"jobItemsListViewModel\": [],\r\n        \"enableQRPayment\": false,\r\n        \"catID\": \"0\",\r\n        \"catTitle\": \"Jovi\",\r\n        \"joviJobStatusDesc\": \"Open\",\r\n        \"joviJobStatus\": 1\r\n      },\r\n      {\r\n        \"title\": \"Unnamed Road, Islamabad, Islamabad Capital Territory, Pakistan\",\r\n        \"locationTitle\": \"\",\r\n        \"description\": \"\",\r\n        \"latitude\": 33.67406700640167,\r\n        \"latitudeDelta\": 0.0122,\r\n        \"longitude\": 73.08656780049205,\r\n        \"longitudeDelta\": 0.006244549763033177,\r\n        \"isVendorConfirmed\": false,\r\n        \"addressID\": 893,\r\n        \"buyForMe\": false,\r\n        \"jobAmount\": 0.0,\r\n        \"paidAmount\": 0.0000,\r\n        \"collectedAmount\": 0.0000,\r\n        \"estimateTime\": \"00:00\",\r\n        \"joviJobID\": 687417,\r\n        \"isSkipped\": false,\r\n        \"isRestaurant\": false,\r\n        \"prescriptionImageList\": [],\r\n        \"jobItemsListViewModel\": [],\r\n        \"enableQRPayment\": false,\r\n        \"catID\": \"0\",\r\n        \"catTitle\": \"\",\r\n        \"joviJobStatusDesc\": \"Open\",\r\n        \"joviJobStatus\": 1\r\n      }\r\n    ],\r\n    \"prescriptionImageList\": [],\r\n    \"productNotFoundQDesc\": \"Ask Before Buying\",\r\n    \"productNotFoundQ\": 2,\r\n    \"orderTimerStart\": \"\",\r\n    \"userPic\": \"staging/DashboardBanner/2021/4/6/DefaultProfilePic_133349.jpg\",\r\n    \"subStatusName\": \"VendorApproval\",\r\n    \"showRiderIcon\": true,\r\n    \"chargeBreakdown\": {\r\n      \"estimateTime\": 0.0,\r\n      \"estimateDistance\": 0.0,\r\n      \"estimateTimeCharges\": 0.0,\r\n      \"estimateDistanceCharges\": 0.0,\r\n      \"estimateServiceTax\": 60.0,\r\n      \"chargeRate\": 0.0,\r\n      \"noOfPitstops\": 0.0,\r\n      \"pitstopCharges\": 0.0,\r\n      \"actualTime\": 0.0,\r\n      \"actualDistance\": 0.0,\r\n      \"actualTimeCharges\": 0.0,\r\n      \"pitstopFlatRate\": 0.0,\r\n      \"actualDistanceCharges\": 0.0,\r\n      \"totalEstimateCharge\": 352.0,\r\n      \"totalActualCharge\": 0.0,\r\n      \"discount\": 0.0,\r\n      \"estimateTotalAmount\": 26846.0,\r\n      \"totalProductGST\": 0.0,\r\n      \"vendorIncreaseChargeRate\": 0\r\n    }\r\n  },\r\n  \"success\": true,\r\n  \"statusCode\": 200\r\n}",
    "_url": "https://staging-api.jovi-app.com/api/Order/OrderDetail/68351625",
    "_timedOut": false,
    "_trackingName": "unknown",
    "_incrementalEvents": false,
    "responseHeaders": {
      "content-type": "application/json",
      "vary": "Accept-Encoding",
      "date": "Mon, 21 Feb 2022 12:06:29 GMT"
    },
    "_requestId": null,
    "_headers": {
      "accept": "application/json, text/plain, */*",
      "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MjMzNzYyMDEwNzciLCJqdGkiOiI1ZjIzNGNkMC05MmJiLTQzNTktYTk4OC1lNmZiOWI3YTNkZjgiLCJpYXQiOjE2NDU0NDQwMjEsInJvbCI6ImFwaV9hY2Nlc3MiLCJpZCI6IjgxOTIzMDliLThiMGMtNDMyYS05NWUwLTMzNmE2YWU1OWFlNSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkN1c3RvbWVyIiwiUm9sZU5hbWUiOiJDdXN0b21lciIsImlzQWRtaW4iOiJGYWxzZSIsImlzUmlkZXIiOiJGYWxzZSIsImlzVmVuZG9yIjoiRmFsc2UiLCJuYmYiOjE2NDU0NDQwMjEsImV4cCI6MTY0NTQ0NTIyMSwiaXNzIjoid2ViQXBpIiwiYXVkIjoiaHR0cHM6Ly9zdGFnaW5nLWFwaS5qb3ZpLWFwcC5jb20ifQ.VzOh-7A0tno817_cKnce5D0zkiHq40SHaHC1jGeFgiw",
      "deviceinfo": "[object Object]"
    },
    "_responseType": "",
    "_sent": true,
    "_lowerCaseResponseHeaders": {
      "content-type": "application/json",
      "vary": "Accept-Encoding",
      "date": "Mon, 21 Feb 2022 12:06:29 GMT"
    },
    "_subscriptions": [],
    "responseURL": "https://staging-api.jovi-app.com/api/Order/OrderDetail/68351625"
  }
};