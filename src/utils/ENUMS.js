import svgs from "../assets/svgs"

export default {
    "ADVERTISMENT_TYPE": {
        "HOME": 1,
        "VENDOR_LISTING": 2,
        "SPECIFIC_VENDOR": 3,
        "POPUP_AD": 4,
    },
    "FIRESTORE_STRUCTURE": [
        {
            text: "Digital Inventory",
            value: 1
        },
        {
            text: "Behaviour Log",
            value: 2
        },
    ],
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
    "ESTIMATED_TIME": [
        {
            "text": "0-15 mins",
            "value": 1
        },
        {
            "text": "15-30 mins",
            "value": 2
        },
        {
            "text": "30-45 mins",
            "value": 3
        },
        {
            "text": "45-60 mins",
            "value": 4
        },
        {
            "text": "1 hour +",
            "value": 5
        }
    ],
    "PITSTOP_TYPES": [
        {
            "text": "Jovi",
            "value": 2,
            "icon": svgs.jovi(),
            "isActive": true,
            "color": "#6D51BB",
        },
        {
            "text": "Food",
            "value": 4,
            "icon": svgs.food(),
            "isActive": true,
            "color": "#F94E41",
        },
        {
            "text": "Grocery",
            "value": 1,
            "icon": svgs.grocery(),
            "isActive": true,
            "color": "#27C787",
        },
        {
            "text": "Pharmacy",
            "value": 3,
            "icon": svgs.pharmacy(),
            "isActive": true,
            "color": "#1945BE",
        },
        {
            "text": "Jovi Mart",
            "value": 5,
            "icon": null,
            "isActive": false,
            "color": "#6B6B6B",

        }
    ],
    "COUNTRY_CODES": ["AF", "AL", "DZ", "AS", "AD", "AO", "AI", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BA", "BW", "BV", "BR", "IO", "VG", "BN", "BG", "BF", "BI", "KH", "CM", "CA", "CV", "BQ", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CK", "CR", "HR", "CU", "CW", "CY", "CZ", "CD", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT", "HN", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "CI", "JM", "JP", "JE", "JO", "KZ", "KE", "XK", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "KP", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA", "CG", "RO", "RU", "RW", "RE", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "KR", "SS", "ES", "LK", "SD", "SR", "SJ", "SE", "CH", "SY", "ST", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "VI", "UY", "UZ", "VU", "VA", "VE", "VN", "WF", "EH", "YE", "ZM", "ZW", "KI", "HK", "AX"],

    "ICON_TYPES": {
        0: { "text": "distance", "value": 0 },
        1: { "text": "delivery", "value": 1 }
    },
    "PROMO_VALUE_TYPE": {
        Empty: {
            "text": "Fixed",
            "value": 0
        },
        Fixed: {
            "text": "Fixed",
            "value": 1
        },
        Percentage: {
            "text": "Percentage",
            "value": 2
        }
    },
    "FILTER_BY": [
        {

            "text": "New on Jovi",
            "value": 1,
            // "icon": svgs.newOnJovi(),

        }, {
            "text": "Discounts",
            "value": 2,
            // "icon": svgs.discount()
        },
    ],
    "AVERAGE_PRICE_FILTERS": [
        {
            "text": "$",
            "value": 1,
            "id": 1,
            "icon": null,
            "price": "under 500"

        }, {
            "text": "$$",
            "value": 2,
            "id": 2,
            "icon": null,
            "price": "500 - 100"


        }
        , {
            "text": "$$$",
            "value": 3,
            "id": 3,
            "icon": null,
            "price": "1000 - 2000+"


        }
    ],

    JOVI_JOB_STATUS: {
        Open: 1,
        Closed: 2,
        Inactive: 3,
        Cancel: 4,
        Failed: 5,
        InQueue: 6,
        Preparing: 7,
        ResturentOpen: 8,
        Returning: 9,

    },
    AVAILABILITY_STATUS: {
        Available: 1,
        OutOfStock: 2,
        Discontinued: 3,
        Replaced: 4,
        NotAvailable: 5,
    },
    "DISCOUNT_TYPES": {
        "Fixed": 1,
        "Percentage": 2,
    },
    "ENVS": {
        "STAGING": "STAGING",
        "DEBUG": "DEBUG",
        "RELEASE": "RELEASE"
    }
}