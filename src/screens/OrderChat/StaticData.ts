import { getRandomInt, uuidGenerator } from "../../helpers/SharedActions";
import { randomQuote } from "./loremipsum";

const name = () => {
    const nameArr = ["Wayne Saragosa", "Roxane Prasad", "Kami Reddix", "Lucia Mccullough", "Christia Holding", "Alisha Seeley", "Kena Clouse", "Pearline Winnie", "Melanie Salem", "Flor Cusumano", "Kristel Lemanski", "Marco Hyde", "Krystina Peavy", "Roseanne Jeter", "Salley Stair", "Kylee Flemings", "Masako Hardie", "Malia Burtt", "Drew Teeters", "Christal Pasek", "Steven Hensel", "Lynsey Elsea", "Minerva Kurland", "Yer Arn", "Elane Vossen", "Reed Lamarche", "Josephina Hussain", "Somer Petersen", "Lakendra Balog", "Weston Gioia", "Carli Valladares", "Danna Keppel", "Alishia Neer", "Olimpia Deibel", "Magdalene Amell", "Lera Gattison", "Felecia Mattews", "Lang Rosenbeck", "Mellissa Findley", "Karly Carreiro", "Melodie Gushiken", "Gregg Wattles", "Hattie Duffield", "Nathan Rohr", "Bambi Lafontaine", "Tatyana Bucker", "Karlyn Landrith", "Kanisha Busbee", "Heidy Holler", "Reinaldo Hendley"];
    const min = Math.ceil(0);
    const max = Math.floor(nameArr.length - 1);
    const no = Math.floor(Math.random() * (max - min + 1)) + min;
    return nameArr[no];
};//end of name

const randomDate = (start = new Date(2019, 2, 1), end = new Date()) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const CHAT_STATIC_DATA = (maxlen = 15, minLen = 5) => {
    // return {
    //     data: [
    //         {
    //             "_id": "5f8bf0c6-4013-f154-2bdb-a368bbdc5b7a",
    //             "audio": "{\"id\":48542,\"uri\":\"/Users/mohammedayaz/Library/Developer/CoreSimulator/Devices/9F81E0AE-3993-4F3A-916C-EEA7CC3214D1/data/Containers/Data/Application/59CF409E-E1A8-4EAD-9F9F-568610CB833E/Documents/record-1646738534611.mp4\",\"name\":\"record-1646738534611.mp4\",\"type\":\"audio/mp4\"}",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529"
    //             },
    //             "createdAt": "2022-03-08T11:28:18.952Z"
    //         }, {
    //             "_id": "5f8bf0c6-4013-f154-2bdb-a368bbdc5b7ajskdjfk",
    //             "audio": "{\"id\":48542,\"uri\":\"/Users/mohammedayaz/Library/Developer/CoreSimulator/Devices/9F81E0AE-3993-4F3A-916C-EEA7CC3214D1/data/Containers/Data/Application/59CF409E-E1A8-4EAD-9F9F-568610CB833E/Documents/record-1646738534611.mp4\",\"name\":\"record-1646738534611.mp4\",\"type\":\"audio/mp4\"}",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529j2838212"
    //             },
    //             "createdAt": "2022-03-08T11:28:18.952Z"
    //         },
    //         {
    //             "_id": "eb3f92dc-9d11-facf-aa02-fabd12deb544",
    //             "image": "file:///Users/mohammedayaz/Library/Developer/CoreSimulator/Devices/9F81E0AE-3993-4F3A-916C-EEA7CC3214D1/data/Containers/Data/Application/59CF409E-E1A8-4EAD-9F9F-568610CB833E/tmp/A41D08D9-E2BF-4037-8FAD-35AD4E04D948.jpg",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //                 "name": "Christia Holding"
    //             },
    //             "createdAt": "2022-03-08T11:22:31.416Z"
    //         },
    //         {
    //             "_id": "05cc8a93-2a97-fe27-4f67-eeecd4b1c289",
    //             "image": "file:///Users/mohammedayaz/Library/Developer/CoreSimulator/Devices/9F81E0AE-3993-4F3A-916C-EEA7CC3214D1/data/Containers/Data/Application/59CF409E-E1A8-4EAD-9F9F-568610CB833E/tmp/6C48B5D5-3E67-4625-9859-EA3719918431.jpg",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //                 "name": "Christia Holding"
    //             },
    //             "createdAt": "2022-03-08T11:22:31.416Z"
    //         },
    //         {
    //             "_id": "95c1155d-cba8-815b-c44b-5997bfc735ef",
    //             "image": "file:///Users/mohammedayaz/Library/Developer/CoreSimulator/Devices/9F81E0AE-3993-4F3A-916C-EEA7CC3214D1/data/Containers/Data/Application/59CF409E-E1A8-4EAD-9F9F-568610CB833E/tmp/94C392AA-C8DC-4D99-9262-E8F3E767C137.jpg",
    //             "text": "Image with text",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //                 "name": "Christia Holding"
    //             },
    //             "createdAt": "2022-03-08T11:22:31.416Z"
    //         },

    //         {
    //             "_id": "e46d59c7-90db-df32-96a7-7b525cd6c456",
    //             "text": "Hello",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529"
    //             },
    //             "createdAt": "2022-03-08T11:22:12.624Z"
    //         },
    //         {
    //             "id": 3,
    //             "_id": 3,
    //             "image": "https://picsum.photos/400",
    //             "createdAt": "2022-03-08T11:21:45.119Z",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //                 "name": "Christia Holding"
    //             }
    //         },
    //         {
    //             "id": 4,
    //             "_id": 4,
    //             "image": "https://picsum.photos/400",
    //             "createdAt": "2022-03-08T11:21:45.119Z",
    //             "user": {
    //                 "_id": "2803b4a7-c5ad-3b74-dca7-18de00fa6521",
    //                 "name": "Kristel Lemanski"
    //             }
    //         },
    //         {
    //             "id": 5,
    //             "_id": 5,
    //             "image": "https://picsum.photos/400",
    //             "text": "A rolling stone gathers no moss.",
    //             "createdAt": "2022-03-08T11:21:45.119Z",
    //             "user": {
    //                 "_id": "dfb6a26a-4f97-2833-e612-01a236535c39",
    //                 "name": "Christia Holding"
    //             }
    //         },
    //         {
    //             "id": 7,
    //             "_id": 7,
    //             "image": "https://picsum.photos/400",
    //             "createdAt": "2022-03-08T11:21:45.119Z",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //                 "name": "Christia Holding"
    //             }
    //         },
    //         {
    //             "id": 9,
    //             "_id": 9,
    //             "image": "https://picsum.photos/400",
    //             "createdAt": "2022-03-08T11:21:45.119Z",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //                 "name": "Christia Holding"
    //             }
    //         },
    //         {
    //             "id": 11,
    //             "_id": 11,
    //             "text": "The greatest good you can do for another is not just share your riches, but reveal to them their own.",
    //             "createdAt": "2022-03-08T11:21:45.119Z",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //                 "name": "Christia Holding"
    //             }
    //         },
    //         {
    //             "id": 12,
    //             "_id": 12,
    //             "image": "https://picsum.photos/400",
    //             "text": "All the flowers of all the tomorrows are in the seeds of today.",
    //             "createdAt": "2022-03-08T11:21:45.119Z",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //                 "name": "Christia Holding"
    //             }
    //         },
    //         {
    //             "id": 15,
    //             "_id": 15,
    //             "image": "https://picsum.photos/400",
    //             "text": "A prudent question is one half of wisdom.",
    //             "createdAt": "2022-03-08T11:21:45.119Z",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //                 "name": "Christia Holding"
    //             }
    //         },
    //         {
    //             "id": 16,
    //             "_id": 16,
    //             "image": "https://picsum.photos/400",
    //             "text": "The cosmos is neither moral or immoral; only people are. He who would move the world must first move himself.",
    //             "createdAt": "2022-03-08T11:21:45.119Z",
    //             "user": {
    //                 "_id": "7634a93d-40cb-8db7-0bda-814d2e24e414",
    //                 "name": "Reed Lamarche"
    //             }
    //         },
    //         {
    //             "id": 17,
    //             "_id": 17,
    //             "image": "https://picsum.photos/400",
    //             "createdAt": "2022-03-08T11:21:45.119Z",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //                 "name": "Christia Holding"
    //             }
    //         },
    //         {
    //             "id": 23,
    //             "_id": 23,
    //             "image": "https://picsum.photos/400",
    //             "text": "Growth itself contains the germ of happiness.",
    //             "createdAt": "2022-03-08T11:21:45.119Z",
    //             "user": {
    //                 "_id": "fcd85b56-4bf2-6e96-d698-77e95ea49691",
    //                 "name": "Wayne Saragosa"
    //             }
    //         },
    //         {
    //             "id": 24,
    //             "_id": 24,
    //             "text": "Without passion man is a mere latent force and possibility, like the flint which awaits the shock of the iron before it can give forth its spark.",
    //             "createdAt": "2022-03-08T11:21:45.119Z",
    //             "user": {
    //                 "_id": "32da5598-3be0-92d5-1c4a-94113ee82a8d",
    //                 "name": "Kanisha Busbee"
    //             }
    //         },
    //         {
    //             "id": 25,
    //             "_id": 25,
    //             "image": "https://picsum.photos/400",
    //             "text": "You have to do your own growing no matter how tall your grandfather was.",
    //             "createdAt": "2022-03-08T11:21:45.119Z",
    //             "user": {
    //                 "_id": "4bfbd920-9711-23ca-a292-dd6a22b13eb8",
    //                 "name": "Hattie Duffield"
    //             }
    //         },
    //         {
    //             "id": 27,
    //             "_id": 27,
    //             "text": "Never do things others can do and will do, if there are things others cannot do or will not do.",
    //             "createdAt": "2022-03-08T11:21:45.119Z",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //                 "name": "Christia Holding"
    //             }
    //         },
    //         {
    //             "id": 0,
    //             "_id": 0,
    //             "image": "https://picsum.photos/400",
    //             "text": "Argue for your limitations, and sure enough theyre yours.",
    //             "createdAt": "2022-03-07T11:21:45.119Z",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //                 "name": "Christia Holding"
    //             }
    //         },
    //         {
    //             "id": 1,
    //             "_id": 1,
    //             "text": "It is with words as with sunbeams. The more they are condensed, the deeper they burn.",
    //             "createdAt": "2022-03-07T11:21:45.119Z",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //                 "name": "Christia Holding"
    //             }
    //         },
    //         {
    //             "id": 6,
    //             "_id": 6,
    //             "image": "https://picsum.photos/400",
    //             "createdAt": "2022-03-07T11:21:45.119Z",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //                 "name": "Christia Holding"
    //             }
    //         },
    //         {
    //             "id": 10,
    //             "_id": 10,
    //             "image": "https://picsum.photos/400",
    //             "text": "Smile, breathe, and go slowly.",
    //             "createdAt": "2022-03-07T11:21:45.119Z",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //                 "name": "Christia Holding"
    //             }
    //         },
    //         {
    //             "id": 14,
    //             "_id": 14,
    //             "image": "https://picsum.photos/400",
    //             "text": "The most important thing is transforming our minds, for a new way of thinking, a new outlook: we should strive to develop a new inner world.",
    //             "createdAt": "2022-03-07T11:21:45.119Z",
    //             "user": {
    //                 "_id": "17698d9b-81be-1903-f666-e60eff456dfd",
    //                 "name": "Felecia Mattews"
    //             }
    //         },
    //         {
    //             "id": 18,
    //             "_id": 18,
    //             "image": "https://picsum.photos/400",
    //             "createdAt": "2022-03-07T11:21:45.119Z",
    //             "user": {
    //                 "_id": "2491e24a-b84c-7d13-ab61-c92d98381984",
    //                 "name": "Masako Hardie"
    //             }
    //         },
    //         {
    //             "id": 26,
    //             "_id": 26,
    //             "image": "https://picsum.photos/400",
    //             "createdAt": "2022-03-07T11:21:45.119Z",
    //             "user": {
    //                 "_id": "44fb2f92-5b45-754d-7c1a-e71df06d5305",
    //                 "name": "Lynsey Elsea"
    //             }
    //         },
    //         {
    //             "id": 13,
    //             "_id": 13,
    //             "image": "https://picsum.photos/400",
    //             "createdAt": "2022-02-02T02:14:58.896Z",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //                 "name": "Christia Holding"
    //             }
    //         },
    //         {
    //             "id": 21,
    //             "_id": 21,
    //             "image": "https://picsum.photos/400",
    //             "text": "He is able who thinks he is able.",
    //             "createdAt": "2022-01-31T19:13:43.262Z",
    //             "user": {
    //                 "_id": "4b2526be-7131-1dfd-6651-65f7f9365051",
    //                 "name": "Lang Rosenbeck"
    //             }
    //         },
    //         {
    //             "id": 8,
    //             "_id": 8,
    //             "image": "https://picsum.photos/400",
    //             "createdAt": "2021-11-04T23:18:52.547Z",
    //             "user": {
    //                 "_id": "e8a4226b-7a0b-d58e-cdc7-6f8e9958a79d",
    //                 "name": "Drew Teeters"
    //             }
    //         },
    //         {
    //             "id": 2,
    //             "_id": 2,
    //             "image": "https://picsum.photos/400",
    //             "createdAt": "2021-10-13T10:11:32.750Z",
    //             "user": {
    //                 "_id": "f84db136-69af-c37e-9c43-af8cedc956c4",
    //                 "name": "Lang Rosenbeck"
    //             }
    //         },
    //         {
    //             "id": 19,
    //             "_id": 19,
    //             "image": "https://picsum.photos/400",
    //             "text": "The greatest way to live with honor in this world is to be what we pretend to be.",
    //             "createdAt": "2020-11-02T09:46:09.930Z",
    //             "user": {
    //                 "_id": "ce9d1a00-1dd6-2e60-414c-33ed03a6e2c8",
    //                 "name": "Alisha Seeley"
    //             }
    //         },
    //         {
    //             "id": 22,
    //             "_id": 22,
    //             "image": "https://picsum.photos/400",
    //             "createdAt": "2020-06-17T01:21:49.905Z",
    //             "user": {
    //                 "_id": "fbfed9b9-030f-2c73-ccb5-2113c04e43f0",
    //                 "name": "Reinaldo Hendley"
    //             }
    //         },
    //         {
    //             "id": 20,
    //             "_id": 20,
    //             "image": "https://picsum.photos/400",
    //             "text": "The pain passes, but the beauty remains.",
    //             "createdAt": "2019-05-30T02:20:43.982Z",
    //             "user": {
    //                 "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //                 "name": "Christia Holding"
    //             }
    //         }
    //     ],
    //     MY_USER: {
    //         "_id": "ef48e924-7920-f4d9-25c0-a4a880f6a529",
    //         "name": "Christia Holding"
    //     }, MY_USER_ID: { _id: "ef48e924-7920-f4d9-25c0-a4a880f6a529" }
    // }
    const len = getRandomInt(minLen, maxlen);
    const data: any = [];

    const MY_USER = {
        _id: uuidGenerator(),
        name: name(),
    };


    for (let i = 0; i < len; i++) {

        const yesterday = new Date();

        yesterday.setDate(yesterday.getDate() - 1);

        data.push({
            id: i,
            _id: i,

            ...Math.random() < 0.9 ? {
                image: `https://picsum.photos/400`,
                ...Math.random() < 0.5 && {
                    text: randomQuote().quote,
                },
            } : {
                text: randomQuote().quote,
            },
            createdAt: Math.random() < 0.5 ? new Date() : Math.random() < 0.5 ? yesterday : randomDate(),
            user: Math.random() < 0.5 ? {
                _id: uuidGenerator(),
                name: name(),
            } : MY_USER,
        });
    }//end of LOOP

    return { data, MY_USER, MY_USER_ID: { _id: MY_USER._id } };
}

export const IMAGES_STATIC = [
    {
        "type": "image/jpg",
        "fileName": "E2CA1B1F-ED2A-4489-AC25-D79BD322D9D1.jpg",
        "width": 4032,
        "height": 3024,
        "uri": "file:///Users/mohammedayaz/Library/Developer/CoreSimulator/Devices/9F81E0AE-3993-4F3A-916C-EEA7CC3214D1/data/Containers/Data/Application/117D0D2B-860E-4C69-B751-01D5FC0B6936/tmp/E2CA1B1F-ED2A-4489-AC25-D79BD322D9D1.jpg",
        "fileSize": 2051240
    },
    {
        "type": "image/jpg",
        "fileName": "736C6103-A661-4078-9385-A0F5C5ADB893.jpg",
        "width": 3000,
        "height": 2002,
        "uri": "file:///Users/mohammedayaz/Library/Developer/CoreSimulator/Devices/9F81E0AE-3993-4F3A-916C-EEA7CC3214D1/data/Containers/Data/Application/117D0D2B-860E-4C69-B751-01D5FC0B6936/tmp/736C6103-A661-4078-9385-A0F5C5ADB893.jpg",
        "fileSize": 693372
    },
    {
        "type": "image/jpg",
        "fileName": "10D4E9A4-F303-4B4D-BFAA-5E0F073403D8.jpg",
        "width": 1668,
        "height": 2500,
        "uri": "file:///Users/mohammedayaz/Library/Developer/CoreSimulator/Devices/9F81E0AE-3993-4F3A-916C-EEA7CC3214D1/data/Containers/Data/Application/117D0D2B-860E-4C69-B751-01D5FC0B6936/tmp/10D4E9A4-F303-4B4D-BFAA-5E0F073403D8.jpg",
        "fileSize": 493407
    },

    { source: { uri: 'https://picsum.photos/202' } }
];