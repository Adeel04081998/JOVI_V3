import svgs from "../assets/svgs"

export default {
    "NETWORK_LIST": [
        {
            "text": "Jazz",
            "value": 1
        },
        {
            "text": "Telenor",
            "value": 2
        },
        {
            "text": "Ufone",
            "value": 3
        },
        {
            "text": "Warid",
            "value": 4
        },
        {
            "text": "Zong",
            "value": 5
        }
    ],
    "PITSTOP_TYPES": [
        {
            "text": "Jovi",
            "value": 2,
            "icon": svgs.jovi(),
            "isActive": true,
        },
        {
            "text": "Food",
            "value": 4,
            "icon": svgs.food(),
            "isActive": true,
        },
        {
            "text": "Grocery",
            "value": 1,
            "icon": svgs.grocery(),
            "isActive": true,
        },
        {
            "text": "Pharmacy",
            "value": 3,
            "icon": svgs.pharmacy(),
            "isActive": true,
        },
        {
            "text": "Jovi Mart",
            "value": 5,
            "icon": null,
            "isActive": false,

        }
    ],
    "COUNTRY_CODES": ["AF", "AL", "DZ", "AS", "AD", "AO", "AI", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BA", "BW", "BV", "BR", "IO", "VG", "BN", "BG", "BF", "BI", "KH", "CM", "CA", "CV", "BQ", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CK", "CR", "HR", "CU", "CW", "CY", "CZ", "CD", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT", "HN", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "CI", "JM", "JP", "JE", "JO", "KZ", "KE", "XK", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "KP", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA", "CG", "RO", "RU", "RW", "RE", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "KR", "SS", "ES", "LK", "SD", "SR", "SJ", "SE", "CH", "SY", "ST", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "VI", "UY", "UZ", "VU", "VA", "VE", "VN", "WF", "EH", "YE", "ZM", "ZW", "KI", "HK", "AX"],

    "ICON_TYPES": {
        0: { "text": "distance", "value": 0 },
        1: { "text": "delivery", "value": 1 }
    },
    "FILTER_BY": [
        {
           
            "text": "New on Jovi",
            "value": 1,
            "icon": svgs.newOnJovi(),

        }, {
            "text": "Discounts",
            "value": 2,
            "icon": svgs.discount()
        },
    ],
    "AVERAGE_PRICE_FILTERS": [
        {        
            "text": "$",
            "value": 1,
            "icon": null,
            "price": "under 500"

        }, {
            "text": "$$",
            "value": 2,
            "icon": null,
            "price": "500 - 100"


        }
        , {
            "text": "$$",
            "value": 2,
            "icon": null,
            "price": "1000 - 2000"


        }
    ]

}