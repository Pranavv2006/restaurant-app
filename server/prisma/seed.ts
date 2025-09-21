// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const restaurants = [
    {
      name: "Avartana",
      location:
        "ITC Grand Chola Hotel, Little Mount, Guindy, Chennai, Tamil Nadu 600032",
      latitude: 13.0105,
      longitude: 80.2207,
      phone: "044 2220 0000",
      cuisine: "Indian",
      imageUrl:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/f4/e3/be/photo9jpg.jpg?w=900&h=500&s=1",
    },

    {
      name: "O Pedro - BKC",
      location:
        "Jet Airways, 2, Godrej BKC, Plot No C-68, G Block BKC, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051",
      latitude: 19.06,
      longitude: 72.86,
      phone: "75065 25554",
      cuisine: "Indian",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpIlNj5rrS5_DR7npKocp_00x3ztAMZ4yjNA&s",
    },

    {
      name: "Malvan Tadka",
      location:
        "Lal Bahadur Shastri Marg, opp. Nirmal Lifestyle, Salpa Devi Pada, Mulund West, Mumbai, Maharashtra 400081",
      latitude: 19.17,
      longitude: 72.94,
      phone: "96199 99356",
      cuisine: "Indian",
      imageUrl:
        "https://b.zmtcdn.com/data/reviews_photos/3da/a156300fe0ab350f2033babe29be23da_1733428805.jpg",
    },

    {
      name: "Indian Accent",
      location:
        "The Lodhi, Lodhi Rd, CGO Complex, Pragati Vihar, New Delhi, Delhi 110003",
      latitude: 28.59013,
      longitude: 77.24037,
      phone: "98711 17968",
      cuisine: "Indian",
      imageUrl:
        "https://c.ndtvimg.com/2023-11/c4bp49g_restaurant-generic_625x300_21_November_23.jpg?im=FeatureCrop,algorithm=dnn,width=1200,height=738",
    },

    {
      name: "Shang Palace",
      location:
        "Lobby Level, Shangri-La Eros New Delhi, 19, Ashoka Rd, Janpath, Connaught Place, New Delhi, Delhi 110001",
      latitude: 28.620893,
      longitude: 77.218064,
      phone: "011 4119 1040",
      cuisine: "Chinese",
      imageUrl:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/15/1d/94/shang-palace-interiors.jpg?w=900&h=500&s=1",
    },

    {
      name: "The China Kitchen",
      location:
        "Ground floor, Hyatt Regency Delhi, Bhikaiji Cama Place, Ring road, Rama Krishna Puram, New Delhi, Delhi 110066",
      latitude: 28.571436,
      longitude: 77.184918,
      phone: "98184 77234",
      cuisine: "Chinese",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/8/3378/566ee725d98f4436b7ceb72ab671753c.jpg?fit=around|960:500&crop=960:500;*,*",
    },

    {
      name: "Chi Ni",
      location:
        "The Roseate, New Delhi, D Block, Samalka, New Delhi, Delhi 110097",
      latitude: 28.5393,
      longitude: 77.1009,
      phone: "98210 55547",
      cuisine: "Chinese",
      imageUrl:
        "https://b.zmtcdn.com/data/reviews_photos/2b1/fc3e3c55c37176252591e1b8e94ed2b1_1519884679.jpg?fit=around|960:500&crop=960:500;*,*",
    },

    {
      name: "Yi Jing",
      location:
        "Sheraton New Delhi Hotel, District Centre, Saket, Saket, Delhi 110017",
      latitude: 28.52629,
      longitude: 77.21627,
      phone: "011 4266 1122",
      cuisine: "Chinese",
      imageUrl:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/de/e6/47/restaurant.jpg?w=900&h=500&s=1",
    },

    {
      name: "Sammy Sosa",
      location:
        "18, Meera Tower, Ground Floor, Andheri Link Road, Oshiwara, Andheri West, Mumbai, Maharashtra 400053",
      latitude: 19.1417,
      longitude: 72.8277,
      phone: "98336 66555",
      cuisine: "Mexican",
      imageUrl:
        "https://ik.imagekit.io/pu0hxo64d/uploads/gallery/interior-of-sammy-sosa-oshiwara.PNG",
    },

    {
      name: "Mezcalita",
      location:
        "82, Nagin Mahal, Veer Nariman Road, Churchgate, Mumbai, Maharashtra 400020",
      latitude: 18.9329,
      longitude: 72.8252,
      phone: "99304 95555",
      cuisine: "Mexican",
      imageUrl:
        "https://assets.cntraveller.in/photos/640f28e122f1fb6814520522/3:2/w_3879,h_2586,c_limit/Bar%20Interiors%20(2)_Mezcalita_Mumbai.jpg",
    },

    {
      name: "Poco Loco Tapas & Bar",
      location:
        "Ground Floor, Hotel Shubhangan, 21st Road, Off Sangeet Samrat Naushad Ali Road, Khar West, Mumbai, Maharashtra 400052",
      latitude: 19.0664,
      longitude: 72.8336,
      phone: "93241 91366",
      cuisine: "Mexican",
      imageUrl:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/4d/88/f5/sometimes-all-you-want.jpg?w=900&h=500&s=1",
    },

    {
      name: "Chinita Real Mexican Food",
      location:
        "218, Double Road, 2nd Stage, Hoysala Nagar, Indiranagar, Bengaluru, Karnataka",
      latitude: 12.9774,
      longitude: 77.6406,
      phone: "96865 51896",
      cuisine: "Mexican",
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/574bf01c2b8ddef6b349d7bf/1702557052717-JSARWSOHEMBGAWA9U1LI/Chinita+-+Cover_Range+Shot.jpg?format=2500w",
    },

    {
      name: "Sanchez",
      location:
        "204, Vittal Mallya Rd, Level 2, UB City, Ashok Nagar, Bengaluru, Karnataka 56000",
      latitude: 12.9709,
      longitude: 77.5898,
      phone: "70224 22473",
      cuisine: "Mexican",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/4/57424/d9ad7c50985d9a74b7d1e3504f6c6308.jpg?fit=around|750:500&crop=750:500;*,*",
    },

    {
      name: "Maiz Mexican Restaurant",
      location:
        "607, 1st Floor, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
      latitude: 12.9774,
      longitude: 77.6406,
      phone: "79777 61314",
      cuisine: "Mexican",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/6/21007556/98b2ae02b40083040680337a8f37283c_featured_v2.jpg",
    },

    {
      name: "Chili's American Grill & Bar",
      location:
        "3rd Floor, Ambience Mall, Nelson Mandela Marg, Vasant Kunj, New Delhi, Delhi 110070",
      latitude: 28.5398,
      longitude: 77.1592,
      phone: "11 4087 0533",
      cuisine: "Mexican",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/4/97824/a67ccecf9c640c9144dd3e98de89bc5d.jpg",
    },

    {
      name: "Los Pepes Taqueria",
      location:
        "Club Iris, 1, Uniworld Gardens Road, Sector 47, Gurugram, Haryana 122004",
      latitude: 28.4632,
      longitude: 77.0864,
      phone: "12 3546 3266",
      cuisine: "Mexican",
      imageUrl:
        "https://imgmediagumlet.lbb.in/media/2019/05/5cc92b8cfc1cbd566351c43b_1556687756348.jpg",
    },

    {
      name: "Mexarosa",
      location:
        "Plot 373, 1st Floor, Road 22, Jubilee Hills, Hyderabad, Telangana 500033",
      latitude: 17.4332,
      longitude: 78.4116,
      phone: "70754 66760",
      cuisine: "Mexican",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/4/21450634/42ab139997e7578a6309270d9035d248.jpg?fit=around|960:500&crop=960:500;*,*",
    },

    {
      name: "Izumi Bandra",
      location:
        "Ground Floor, Sunrise Cooperative Society, Rd Number 24, Khar West, Mumbai, Maharashtra 400050",
      latitude: 19.0666,
      longitude: 72.8306,
      phone: "98206 06667",
      cuisine: "Japanese",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/2/19076232/0be57e053d43ad764f82f51c2eae48ff.jpg",
    },

    {
      name: "Wasabi by Morimoto",
      location:
        "The Taj Mahal Palace, Mumbai, Apollo Bandar, Colaba, Mumbai, Maharashtra 400001",
      latitude: 18.9215,
      longitude: 72.8333,
      phone: "22 6665 3366",
      cuisine: "Japanese",
      imageUrl:
        "https://www.hotelierindia.com/cloud/2021/11/22/jC12nYFa-wasabi-by-morimoto1.jpg",
    },

    {
      name: "Kofuku",
      location:
        "Veera Desai Industrial Estate, Andheri West, Mumbai, Maharashtra 400053",
      latitude: 19.1396,
      longitude: 72.8284,
      phone: "99670 02920",
      cuisine: "Japanese",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/3/19894583/67efa2a761d0844b666e1415084383d0_featured_v2.jpg",
    },

    {
      name: "Mizu",
      location:
        "Ground Floor, Ganga Jamuna Building, 14th Rd, Khar West, Pali, Mumbai, Maharashtra 400052",
      latitude: 19.06549,
      longitude: 72.83641,
      phone: "93720 23641",
      cuisine: "Japanese",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/2/19611732/c0a4356b2c109504f38ae097536d5594.jpg?fit=around|750:500&crop=750:500;*,*",
    },

    {
      name: "Harima",
      location:
        "4th Floor, Devatha Plaza, 131, Residency Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560025",
      latitude: 12.9723,
      longitude: 77.6067,
      phone: "80 4132 5757",
      cuisine: "Japanese",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/8/50208/5d2018c67f9ecc1533c1eeb80e926d7f.jpg",
    },

    {
      name: "Kuuraku Brigade Road",
      location:
        "1st Floor, Forum Rex Walk, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001",
      latitude: 12.9723,
      longitude: 77.6067,
      phone: "95997 80020",
      cuisine: "Japanese",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/4/18494064/31b29113ab93b5e187f1eb2659656f61_featured_v2.jpg",
    },

    {
      name: "Shiro Bangalore",
      location:
        "3rd Floor, 222, Vittal Mallya Rd, KG Halli, D'Souza Layout, Ashok Nagar, Bengaluru, Karnataka 560001",
      latitude: 12.9715,
      longitude: 77.5925,
      phone: "80 4173 8861",
      cuisine: "Japanese",
      imageUrl:
        "https://ubcitybangalore.in/wp-content/uploads/2021/12/thumbnail-41.jpg",
    },

    {
      name: "Megu Restaurant",
      location:
        "The Leela Palace, Africa Ave, Diplomatic Enclave, Chanakyapuri, New Delhi, Delhi 110023",
      latitude: 28.5861,
      longitude: 77.1643,
      phone: "11 3933 1234",
      cuisine: "Japanese",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/2/6812/6efa61052d3f25d8b05e0a776b3013e2.jpg?fit=around|750:500&crop=750:500;*,*",
    },

    {
      name: "Hashi",
      location:
        "1335h, Cable Bridge Rd, near Yellolife cafe, Nandagiri Hills, Jubilee Hills, Hyderabad, Telangana 500033",
      latitude: 17.4293,
      longitude: 78.4034,
      phone: "95029 32288",
      cuisine: "Japanese",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/4/18492204/de48fd80f0e5d1d55b85af399a5433f7_featured_v2.jpg",
    },

    {
      name: "Haiku, The Asian Kitchen",
      location:
        "Above GoodEarth, 686/D, Road No. 12, Banjara Hills, Hyderabad, Telangana 500034",
      latitude: 17.4173,
      longitude: 78.4312,
      phone: "70958 76111",
      cuisine: "Japanese",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/5/18385295/1b2f6788551ff57c660e0b34ce47982f.jpg?fit=around|750:500&crop=750:500;*,*",
    },

    {
      name: "Oyama Japanese Restaurant",
      location:
        "First Floor, vns Vaibhav apartment, 28/61, 3rd Main Rd, Gandhi Nagar, Adyar, Chennai, Tamil Nadu 600020",
      latitude: 13.0064,
      longitude: 80.257,
      phone: "44 3555 2349",
      cuisine: "Japanese",
      imageUrl:
        "https://indo-japan-foodculture-exchange.jp/wp-content/uploads/2022/03/Oyama-teble%E3%82%B3%E3%83%92%E3%82%9A%E3%83%BC-300x169.jpg",
    },

    {
      name: "Nippon Japanese Restaurant",
      location:
        "1st Floor, AL Lakshmi Achi Building, 55, Kavinger, Kavignar Bharathidasan Rd, Seethammal Colony, Extension, Teynampet, Chennai, Tamil Nadu 600018",
      latitude: 13.045,
      longitude: 80.2505,
      phone: "93632 73048",
      cuisine: "Japanese",
      imageUrl:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.zomato.com%2Fchennai%2Fnippon-japanese-restaurant-alwarpet&psig=AOvVaw0SKo6MDDqPG45DzEc4giAk&ust=1758381992967000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCPDTtMGR5Y8DFQAAAAAdAAAAABAE",
    },

    {
      name: "Sun and Moon Korean Restaurant",
      location:
        "Dainik Shivner Marg, near Municipal Industrial Estate, opposite Lady Ratan Towers, Gandhi Nagar, Upper Worli, Worli, Mumbai, Maharashtra 400018",
      latitude: 19.00695,
      longitude: 72.82522,
      phone: "99463 37336",
      cuisine: "Korean",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/2/18703822/c6fed0371fa247b14357a9cd8da57027.jpg?fit=around|960:500&crop=960:500;*,*",
    },

    {
      name: "Hengbok - Andheri West",
      location:
        "B-39, Veera Desai Industrial Estate Rd, Veera Desai Industrial Estate, Andheri West, Mumbai, Maharashtra 400053",
      latitude: 19.1311,
      longitude: 72.8252,
      phone: "99670 02920",
      cuisine: "Korean",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/1/20770901/33a787b47421f5157f33121870f6b614.jpg?fit=around|960:500&crop=960:500;*,*",
    },

    {
      name: "Arirang The Taste of Korea",
      location:
        "290/B, Adarsh Nagar Rd, Lokhandwala Complex, Andheri West, Mumbai, Maharashtra 400102",
      latitude: 19.1311,
      longitude: 72.8252,
      phone: "99679 54176",
      cuisine: "Korean",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/1/20053281/30a870a5414e9649be74d2d69c9abaa6.jpg?fit=around|750:500&crop=750:500;*,*",
    },

    {
      name: "The Himalayan - Korean Restaurant",
      location:
        "2nd floor, 134, 17th H Main Rd, KHB Colony, 5th Block, Koramangala, Bengaluru, Karnataka 560095",
      latitude: 12.9288,
      longitude: 77.62,
      phone: "89716 55610",
      cuisine: "Korean",
      imageUrl:
        "https://b.zmtcdn.com/data/reviews_photos/544/acd3a94bc0f0e3001326b14223b69544_1640252138.jpg?fit=around|750:500&crop=750:500;*,*",
    },

    {
      name: "Hae Kum Gang Korean Restaurant",
      location:
        "No. 20, 2nd Floor, Paul Castle, Castle St, near Brigade Tower, Ashok Nagar, Bengaluru, Karnataka 560025",
      latitude: 12.966383,
      longitude: 77.606537,
      phone: "98802 16262",
      cuisine: "Korean",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/9/51839/69be60ecd6c4719ca87682124411fbc7.jpg?fit=around|960:500&crop=960:500;*,*",
    },

    {
      name: "Hi Seoul Korean Restaurant",
      location:
        "1st floor, 201, 9th Main Rd, HRBR Layout 1st Block, HRBR Layout, Kalyan Nagar, Bengaluru, Karnataka 560043",
      latitude: 13.0103,
      longitude: 77.6534,
      phone: "98457 71657",
      cuisine: "Korean",
      imageUrl:
        "https://media-cdn.tripadvisor.com/media/photo-m/1280/18/d2/7c/cd/photo0jpg.jpg",
    },

    {
      name: "Kori's - Greater Kailesh",
      location:
        "M-57 1st Floor, M Block, Greater Kailash-1, Greater Kailash I, New Delhi, Delhi 110048",
      latitude: 28.5502,
      longitude: 77.2407,
      phone: "84477 89301",
      cuisine: "Korean",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/7/18989527/bfae003642f19a715c43b11b844cf158_featured_v2.jpg",
    },

    {
      name: "Busan Korean Restaurant",
      location:
        "Ground Floor, House# 9B, Block # 10, Colony, Majnu Ka Tilla, New Aruna Nagar, New Delhi, Delhi 110054",
      latitude: 28.7001,
      longitude: 77.2289,
      phone: "95608 16905",
      cuisine: "Korean",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/6/312396/743c602ad81687c1036fba269782cb72.jpg",
    },

    {
      name: "Gung The Palace",
      location:
        "D-1/B, near Aashirwad Complex, Green Park, New Delhi, Delhi 110016",
      latitude: 18.57,
      longitude: 73.76,
      phone: "98712 95093",
      cuisine: "Korean",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/5/3575/2c16a308cffe056ba2bbaa439db5106e.jpg?fit=around|960:500&crop=960:500;*,*",
    },

    {
      name: "Thai Pavilion",
      location:
        "President, Mumbai - IHCL SeleQtions, 90, Cuffe Parade, Mumbai, Maharashtra 400005",
      latitude: 18.913,
      longitude: 72.8197,
      phone: "22 6665 0808",
      cuisine: "Thai",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/6/37816/0175a7f7d85a100fd957c4a583b25b26.jpg?fit=around|960:500&crop=960:500;*,*",
    },

    {
      name: "Nara Thai, BKC",
      location:
        "Ground floor, Block G, Raheja Towers, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051",
      latitude: 19.0656,
      longitude: 72.8573,
      phone: "83558 78888",
      cuisine: "Thai",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/9/18572909/0b4eeb7a2fb2ff1c90f54539f39db859.jpg?fit=around|750:500&crop=750:500;*,*",
    },

    {
      name: "By The Mekong",
      location:
        "The Penthouse Level 37 at The St. Regis, 462, Senapati Bapat Marg, next to Phoenix Palladium, Lower Parel, Mumbai, Maharashtra 400013",
      latitude: 18.9954,
      longitude: 72.8239,
      phone: "22 6162 8070",
      cuisine: "Thai",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/6/47186/b9d4d159e1344e87e4544e72fbf9cdb3.jpg",
    },

    {
      name: "Thai Basil, Koramangala",
      location:
        "Plot No. 32, 80 Feet Rd, S.T. Bed, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
      latitude: 12.9304,
      longitude: 77.6256,
      phone: "80 4989 1968",
      cuisine: "Thai",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/2/18568512/0ccb948f52915b3efdb3845fb447505f.jpg",
    },

    {
      name: "PHRA NAKHON, Thai Cafe",
      location:
        "JT Plaza, 487, Jyoti Nivas College Rd, KHB Colony, 5th Block, Koramangala, Bengaluru, Karnataka 560095",
      latitude: 12.9329,
      longitude: 77.6253,
      phone: "80882 59532",
      cuisine: "Thai",
      imageUrl:
        "https://b.zmtcdn.com/data/reviews_photos/a7f/ccc7351147a12a855f596a075972ba7f_1669122259.jpg",
    },

    {
      name: "Si Nonna's",
      location:
        "Off Link Rd, Industrial Area, Andheri West, Mumbai, Maharashtra 400053",
      latitude: 19.1332,
      longitude: 72.8252,
      phone: "91368 81002",
      cuisine: "Italian",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/3/20995823/8e016dd60f0016394a84bacb5dc44093.jpg?fit=around|750:500&crop=750:500;*,*",
    },

    {
      name: "Celini",
      location:
        "Grand Hyatt Mumbai Hotel and Residences, Bandra Kurla Complex Vicinity, off Western Express Highway, Santacruz East, Mumbai, Maharashtra 400055",
      latitude: 19.0769,
      longitude: 72.8514,
      phone: "70459 50135",
      cuisine: "Italian",
      imageUrl:
        "https://res.cloudinary.com/wejgrnjqf/image/upload/c_limit,w_3840/f_auto/q_auto/v1/b5613f36-9553-4803-ac1d-40bdcba65732?_a=BAVAZGE70",
    },

    {
      name: "Trattoria - President",
      location:
        "President, Mumbai - IHCL SeleQtions, 90, Cuffe Parade, Mumbai, Maharashtra 400005",
      latitude: 18.9142,
      longitude: 72.8207,
      phone: "22 6665 0808",
      cuisine: "Italian",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/5/37745/5e524d95409628ac5b5ac3fce4223fa1.jpg",
    },

    {
      name: "Toscano",
      location:
        "24, Vittal Mallya Rd, Ashok Nagar, Bengaluru, Karnataka 560001",
      latitude: 12.9723,
      longitude: 77.595,
      phone: "76193 20071",
      cuisine: "Italian",
      imageUrl:
        "https://framerusercontent.com/images/MtJQbjJ5BW49AgYil8MLXYt4o.png",
    },

    {
      name: "Bologna Italian Restaurant",
      location:
        "#759, 1st Floor, 100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038",
      latitude: 12.9778,
      longitude: 77.6366,
      phone: "80 4302 7392",
      cuisine: "Italian",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/3/18682433/8f415ec9821a643cfb4457d88bb9da5a.jpg?fit=around|750:500&crop=750:500;*,*",
    },

    {
      name: "La Gioia",
      location: "1085, 12th Main Rd, Indiranagar, Bengaluru, Karnataka 560008",
      latitude: 12.9778,
      longitude: 77.64,
      phone: "99000 92301",
      cuisine: "Italian",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/7/21357887/e196490d91ee34b6390c0bf934026033.jpg?fit=around|960:500&crop=960:500;*,*",
    },

    {
      name: "Diva - The Italian Restaurant",
      location:
        "M-8A, M Block Market, Greater Kailash II, New Delhi, Delhi 110048",
      latitude: 28.5284,
      longitude: 77.2407,
      phone: "11 4163 7858",
      cuisine: "Italian",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/4/64/949fbcd43646030f08c011836f2b819a.jpg?fit=around|960:500&crop=960:500;*,*",
    },

    {
      name: "Tonino Ristorante",
      location:
        "Khasra No. 76, 27, Mehrauli-Gurgaon Rd, Mehrauli, New Delhi, Delhi 110030",
      latitude: 28.5133,
      longitude: 77.1652,
      phone: "88827 96678",
      cuisine: "Italian",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/9/1799/2ec41d33a9d320004d4be738f6232796.jpg?fit=around|750:500&crop=750:500;*,*",
    },
  ];

  for (const r of restaurants) {
    await prisma.restaurant.create({
      data: {
        merchantId: 22,
        name: r.name,
        location: r.location,
        latitude: r.latitude,
        longitude: r.longitude,
        phone: r.phone,
        cuisine: r.cuisine,
        imageUrl: r.imageUrl,
      },
    });
  }

  console.log(`✅ Seeded ${restaurants.length} restaurants`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
