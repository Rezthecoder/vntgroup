import type { L10n } from '@/lib/i18n';
import type { Hotel } from '@/content/hotels';

/**
 * The four sections every hotel page shares (客室・お食事・アクセス・周辺観光),
 * kept apart from `hotels.ts` so the common template reads one shape for all
 * three hotels.
 *
 * DRAFT COPY: room specs, dining, travel times and sightseeing text below are
 * our own drafts for layout. They are replaced by the client's supplied copy
 * and photos before launch — see CONTENT_TODO.md for the open questions.
 */

export type RoomType = {
  name: L10n;
  image: string;
  body: L10n;
  /** Short facts printed as tags: size, capacity, beds. */
  specs?: L10n[];
  /** Extra photos for the thumbnail strip; `image` is always shown first. */
  gallery?: string[];
  /** Spec table rows (客室タイプ / ベッド / 定員 / 広さ). */
  facts?: { label: L10n; value: L10n }[];
  amenities?: L10n[];
};

/** Credit for a photo used under a free licence (Wikimedia Commons etc.). */
export type PhotoCredit = { author: string; license: string; source: string };

export type DiningItem = {
  title: L10n;
  /** Small label above the title, e.g. BREAKFAST. */
  label: string;
  body: L10n;
  image?: string;
  credit?: PhotoCredit;
};

export type RouteMode = 'train' | 'car' | 'bus' | 'walk' | 'plane';

export type Route = { mode: RouteMode; from: L10n; detail: L10n };

/** One door-to-door route for the line diagram: place, leg, place, leg, … hotel. */
export type Journey = {
  title: L10n;
  steps: { place: L10n; leg?: { mode: RouteMode; text: L10n } }[];
};

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export type SeasonalEvent = {
  season: Season;
  name: L10n;
  when: L10n;
  place: L10n;
  body: L10n;
  query: string;
};

export type Spot = {
  name: L10n;
  /** Travel time from the hotel, e.g. 車で約10分. */
  time: L10n;
  body: L10n;
  image?: string;
  /** CSS object-position for the crop, e.g. 'center 25%' to keep a castle roof in frame. */
  focus?: string;
  credit?: PhotoCredit;
  /** Google Maps search text for the "view on map" link. */
  query: string;
  /** Official website. */
  site?: string;
  /** Shown large as the "Pick up" spot above the grid. */
  pickup?: boolean;
};

/** One card in the サービス内容 row above the room list (reference: goderehotel rooms page). */
export type ServiceNote = { title: L10n; body: L10n };

/** One card in エリア情報 (周辺施設): hospital, station, roadside station, shops. */
export type Facility = {
  kind: L10n;
  name: L10n;
  /** Postal address, Japanese only. */
  address?: string;
  hours?: L10n;
  /** Travel time from the hotel, e.g. 車で約5分. */
  time: L10n;
};

/** One of the photo cards in the "8つの魅力" grid (reference: goderehotel's 8つの施設). */
export type Feature = { title: L10n; body: L10n; image: string };

export type HotelStay = {
  /** Slideshow photos for the full-bleed hero; falls back to the hotel's gallery. */
  heroSlides?: string[];
  /** Photo cards under ホテルの魅力; derived from services + special blocks when absent. */
  features?: Feature[];
  /** Photo strips: inside the hotel / around the hotel. */
  scenery?: { inside: string[]; around: string[] };
  rooms: { lead?: L10n; services?: ServiceNote[]; items: RoomType[] };
  dining: { lead: L10n; items: DiningItem[] };
  access: {
    lead: L10n;
    routes: Route[];
    journeys?: Journey[];
    checkIn?: string;
    checkOut?: string;
    parking?: L10n;
  };
  sightseeing: { lead: L10n; spots: Spot[]; facilities?: Facility[]; events?: SeasonalEvent[] };
};

const BREAKFAST_NOTE: L10n = {
  ja: '朝食の有無・内容はご宿泊プランにより異なります。詳しくはご予約時にご確認ください。',
  en: 'Whether breakfast is included, and what it is, depends on your plan — please check when you book.',
};

const stays: Record<Hotel['slug'], HotelStay> = {
  fuji: {
    heroSlides: ['/images/live/fuji/u6.jpg', '/images/fuji/fuji-03.webp', '/images/live/fuji/u2.jpg'],
    scenery: {
      inside: ['/images/fuji/fuji-01.webp', '/images/fuji/fuji-02.webp', '/images/fuji/onsen-01.webp', '/images/live/fuji/about-2.webp', '/images/live/fuji/about-1.webp', '/images/fuji/info-top.webp'],
      around: ['/images/live/fuji/u6.jpg', '/images/live/fuji/u3.jpg', '/images/live/fuji/u2.jpg', '/images/live/fuji/u4.jpg', '/images/live/fuji/u5.jpg', '/images/live/fuji/u1.jpg'],
    },
    // DRAFT: parking / front-desk hours / breakfast to be confirmed by the client.
    features: [
      { title: { ja: '富士山ビュー客室', en: 'Mt. Fuji view rooms' }, body: { ja: '全50室から、四季折々の富士山を望む', en: 'Mt. Fuji from all 50 rooms, in every season' }, image: '/images/fuji/fuji-01.webp' },
      { title: { ja: '麦飯石温泉大浴場', en: 'Bakuhanseki stone bath' }, body: { ja: '天然の麦飯石を使用した人工温泉。ご宿泊者専用', en: 'Hot-spring style bath for staying guests only' }, image: '/images/fuji/onsen-01.webp' },
      { title: { ja: '団体・グループ歓迎', en: 'Groups welcome' }, body: { ja: '研修・社員旅行・ツアーのご宿泊に', en: 'Training trips, company outings and tours' }, image: '/images/live/fuji/u5.jpg' },
      // Client: ご朝食 → 食事. Photo is the udon shot until the client's photo arrives.
      { title: { ja: 'お食事', en: 'Dining' }, body: { ja: '吉田のうどん・ほうとうなど、富士吉田の味をご堪能ください', en: 'Yoshida udon, hoto and more local flavours' }, image: '/images/spots/fuji-udon-v2.webp' },
      { title: { ja: '無料Wi-Fi', en: 'Free Wi-Fi' }, body: { ja: '館内全域で無料Wi-Fiをご利用いただけます', en: 'Free Wi-Fi throughout the hotel' }, image: '/images/live/fuji/u6.jpg' },
      { title: { ja: '24時間フロント', en: '24-hour front desk' }, body: { ja: '深夜のご到着・早朝のご出発も安心', en: 'Late arrivals and early departures made easy' }, image: '/images/live/fuji/building.webp' },
      { title: { ja: '駐車場', en: 'Parking' }, body: { ja: 'お車でお越しのお客様へ。\n詳しくはお問い合わせください', en: 'For guests arriving by car' }, image: '/images/fuji/info-top.webp' },
      { title: { ja: '周辺観光の拠点', en: 'A base for sightseeing' }, body: { ja: '河口湖・忍野八海・富士急ハイランドへ車で約10〜15分', en: 'Lake Kawaguchi, Oshino Hakkai and Fuji-Q in 10-15 min' }, image: '/images/live/fuji/u2.jpg' },
    ],
    // 客室: the intro text and サービス内容 box were removed at the client's request.
    rooms: {
      items: [
        {
          name: { ja: '富士山ビュー ツインルーム', en: 'Mt. Fuji View Twin' },
          image: '/images/fuji/fuji-02.webp',
          gallery: ['/images/fuji/fuji-01.webp', '/images/fuji/onsen-01.webp'],
          facts: [
            { label: { ja: '客室タイプ', en: 'Room type' }, value: { ja: 'ツインルーム', en: 'Twin' } },
            { label: { ja: 'ベッド', en: 'Beds' }, value: { ja: 'シングルベッド × 2', en: '2 single beds' } },
            { label: { ja: '定員', en: 'Capacity' }, value: { ja: '2名様', en: '2 guests' } },
            { label: { ja: '眺望', en: 'View' }, value: { ja: '富士山ビュー', en: 'Mt. Fuji' } },
          ],
          amenities: [
            { ja: '無料Wi-Fi', en: 'Free Wi-Fi' },
            { ja: 'テレビ', en: 'TV' },
            { ja: '冷蔵庫', en: 'Fridge' },
            { ja: 'エアコン', en: 'Air conditioning' },
            { ja: 'バス・トイレ', en: 'Bath & toilet' },
            { ja: 'アメニティ一式', en: 'Toiletries' },
          ],
          body: {
            ja: '大きな窓から富士山を望むツインルーム。朝焼けから夕暮れまで、刻々と表情を変える富士山を客室からお楽しみいただけます。',
            en: 'A twin room with a large window onto Mt. Fuji — watch the mountain change from dawn to dusk without leaving the room.',
          },
          specs: [
            { ja: '2名様', en: '2 guests' },
            { ja: 'ツインベッド', en: 'Twin beds' },
          ],
        },
      ],
    },
    dining: {
      lead: {
        ja: '富士吉田は「吉田のうどん」で知られる食の町。ホテル周辺には、地元ならではの味を楽しめるお店が点在しています。',
        en: 'Fujiyoshida is a food town famous for Yoshida udon, with local restaurants dotted around the hotel.',
      },
      items: [
        {
          label: 'Breakfast',
          title: { ja: 'ご朝食', en: 'Breakfast' },
          body: BREAKFAST_NOTE,
        },
        {
          label: 'Local Food',
          title: { ja: '吉田のうどん', en: 'Yoshida udon' },
          image: '/images/spots/fuji-udon-v2.webp',
          body: {
            ja: '富士吉田を代表する郷土料理。コシの強い太麺に、キャベツや馬肉をのせるのが定番です。市内には多くの専門店があります。',
            en: 'Fujiyoshida’s signature dish: thick, firm noodles, traditionally topped with cabbage and horse meat. The town is full of udon shops.',
          },
        },
        {
          label: 'Local Food',
          title: { ja: 'ほうとう', en: 'Hoto' },
          image: '/images/spots/fuji-hoto-v2.webp',
          body: {
            ja: '平打ち麺をかぼちゃや野菜と味噌で煮込んだ山梨の郷土料理。寒い季節の富士観光に、体の芯から温まる一杯をどうぞ。',
            en: 'Yamanashi’s flat noodles simmered in miso with pumpkin and vegetables — a bowl that warms you through on a cold day by Mt. Fuji.',
          },
        },
      ],
    },
    access: {
      lead: {
        ja: '河口湖と山中湖の間、富士吉田市に位置します。電車・高速バス・お車、いずれでもアクセスしやすい立地です。',
        en: 'In Fujiyoshida, between Lake Kawaguchi and Lake Yamanaka — easy to reach by train, highway bus or car.',
      },
      routes: [
        {
          mode: 'train',
          from: { ja: '富士急行線「富士山駅」', en: 'Fujikyu Line, Fujisan Station' },
          detail: { ja: 'タクシーで約7分', en: 'About 7 min by taxi' },
        },
        {
          mode: 'bus',
          from: { ja: 'バスタ新宿（高速バス）', en: 'Busta Shinjuku (highway bus)' },
          detail: { ja: '富士山駅まで約2時間', en: 'About 2 h to Fujisan Station' },
        },
        {
          mode: 'car',
          from: { ja: '中央自動車道「河口湖IC」', en: 'Chuo Expressway, Kawaguchiko IC' },
          detail: { ja: 'お車で約10分', en: 'About 10 min by car' },
        },
      ],
      journeys: [
        {
          title: { ja: '東京方面から（高速バス）', en: 'From Tokyo by highway bus' },
          steps: [
            { place: { ja: 'バスタ新宿', en: 'Busta Shinjuku' }, leg: { mode: 'bus', text: { ja: '高速バス 約2時間', en: 'Highway bus, about 2 h' } } },
            { place: { ja: '富士山駅', en: 'Fujisan Station' }, leg: { mode: 'car', text: { ja: 'タクシー 約7分', en: 'Taxi, about 7 min' } } },
            { place: { ja: 'ホテル', en: 'Hotel' } },
          ],
        },
        {
          title: { ja: 'お車でお越しの場合', en: 'By car' },
          steps: [
            { place: { ja: '東京方面（中央自動車道）', en: 'From Tokyo (Chuo Expressway)' }, leg: { mode: 'car', text: { ja: '約1時間30分', en: 'About 1 h 30 min' } } },
            { place: { ja: '河口湖IC', en: 'Kawaguchiko IC' }, leg: { mode: 'car', text: { ja: '約10分', en: 'About 10 min' } } },
            { place: { ja: 'ホテル', en: 'Hotel' } },
          ],
        },
      ],
    },
    sightseeing: {
      // DRAFT エリア情報: public facilities only. Convenience store / supermarket / drugstore / laundry entries need the client's picks.
      facilities: [
        {
          kind: { ja: '病院', en: 'Hospital' },
          name: { ja: '富士吉田市立病院', en: 'Fujiyoshida Municipal Hospital' },
          address: '〒403-0005 山梨県富士吉田市上吉田東7丁目11-1',
          time: { ja: '車で約5分', en: 'About 5 min by car' },
        },
        {
          kind: { ja: '駅・ショッピング', en: 'Station and shopping' },
          name: { ja: '富士山駅（富士急行線）・Q-STA', en: 'Fujisan Station (Fujikyu Line) and Q-STA' },
          address: '〒403-0012 山梨県富士吉田市上吉田2丁目5-1',
          time: { ja: 'タクシーで約7分', en: 'About 7 min by taxi' },
        },
        {
          kind: { ja: '道の駅', en: 'Roadside station' },
          name: { ja: '道の駅 富士吉田', en: 'Michi-no-Eki Fujiyoshida' },
          address: '〒403-0006 山梨県富士吉田市新屋1936-6',
          time: { ja: '車で約10分', en: 'About 10 min by car' },
        },
      ],
      lead: {
        ja: '富士山の麓ならではの名所が、ホテルから車でわずかな距離に。四季折々の富士山を巡る旅の拠点にどうぞ。',
        en: 'Sights only the foot of Mt. Fuji can offer, a short drive from the hotel — a base for exploring Mt. Fuji through the seasons.',
      },
      spots: [
        {
          name: { ja: '新倉山浅間公園（忠霊塔）', en: 'Arakurayama Sengen Park (Chureito Pagoda)' },
          image: '/images/spots/fuji-chureito.webp',
          time: { ja: '車で約10分', en: 'About 10 min by car' },
          body: {
            ja: '五重塔と富士山を一枚に収められる絶景スポット。春は桜、秋は紅葉と、季節ごとに表情を変えます。',
            en: 'The pagoda and Mt. Fuji in a single frame — cherry blossom in spring, autumn colour in the fall.',
          },
          query: '新倉山浅間公園',
        },
        {
          name: { ja: '北口本宮冨士浅間神社', en: 'Kitaguchi Hongu Fuji Sengen Shrine' },
          image: '/images/spots/fuji-kitaguchi.webp',
          time: { ja: '車で約5分', en: 'About 5 min by car' },
          body: {
            ja: '富士山信仰の拠点として古くから崇敬を集める神社。杉並木の参道と荘厳な社殿が、静かな時間へと誘います。',
            en: 'A centre of Mt. Fuji worship for centuries — a cedar-lined approach and a solemn shrine hall.',
          },
          query: '北口本宮冨士浅間神社',
          site: 'https://www.sengenjinja.jp/',
        },
        {
          name: { ja: '忍野八海', en: 'Oshino Hakkai' },
          image: '/images/spots/fuji-oshino.webp',
          time: { ja: '車で約10分', en: 'About 10 min by car' },
          body: {
            ja: '富士山の雪解け水が湧き出す八つの池。透き通った水面と茅葺き屋根の風景が広がります。',
            en: 'Eight ponds fed by Mt. Fuji’s snowmelt, with crystal-clear water and thatched roofs.',
          },
          query: '忍野八海',
        },
        {
          name: { ja: '富士急ハイランド', en: 'Fuji-Q Highland' },
          image: '/images/spots/fuji-fujiq.webp',
          time: { ja: '車で約10分', en: 'About 10 min by car' },
          body: {
            ja: '富士山を望む絶叫マシンで知られるテーマパーク。ご家族やグループでの旅行にもおすすめです。',
            en: 'The theme park famous for its thrill rides under Mt. Fuji — great for families and groups.',
          },
          query: '富士急ハイランド',
          site: 'https://www.fujiq.jp/',
        },
        {
          name: { ja: '河口湖', en: 'Lake Kawaguchi' },
          time: { ja: '車で約15分', en: 'About 15 min by car' },
          body: {
            ja: '湖面に映る「逆さ富士」で知られる富士五湖のひとつ。湖畔の散策や遊覧船をお楽しみください。',
            en: 'One of the Fuji Five Lakes, known for Mt. Fuji reflected in its surface — lakeside walks and boat cruises.',
          },
          image: '/images/fuji/fuji-03.webp',
          query: '河口湖',
          pickup: true,
        },
        {
          name: { ja: '山中湖', en: 'Lake Yamanaka' },
          image: '/images/spots/fuji-yamanaka.webp',
          time: { ja: '車で約15分', en: 'About 15 min by car' },
          body: {
            ja: '富士五湖で最も大きな湖。湖畔からの富士山の眺めは格別で、冬には「ダイヤモンド富士」も見られます。',
            en: 'The largest of the Fuji Five Lakes, with a superb view of the mountain — and “Diamond Fuji” in winter.',
          },
          query: '山中湖',
        },
        {
          name: { ja: '山中湖花の都公園', en: 'Hana no Miyako Park, Yamanakako' },
          image: '/images/spots/fuji-hananomiyako.webp',
          time: { ja: '車で約20分', en: 'About 20 min by car' },
          body: {
            ja: '富士山を背景に、春から秋まで季節の花畑が広がる公園。夏のポピーやひまわりは特に見事です。',
            en: 'Fields of seasonal flowers with Mt. Fuji behind them, spring to autumn — the summer poppies and sunflowers are a highlight.',
          },
          query: '山中湖花の都公園',
        },
        {
          name: { ja: '山中湖のカバ（水陸両用バス）', en: 'KABA amphibious bus, Lake Yamanaka' },
          image: '/images/spots/fuji-kaba.webp',
          time: { ja: '車で約20分', en: 'About 20 min by car' },
          body: {
            ja: 'バスのまま山中湖へ「ザブーン」と入水する水陸両用バス。湖上から富士山を眺める、ご家族に人気の体験です。',
            en: 'An amphibious bus that drives straight into Lake Yamanaka — Mt. Fuji from the water, a family favourite.',
          },
          query: '山中湖のカバ',
        },
        {
          name: { ja: '忍野 しのびの里', en: 'Oshino Shinobi no Sato (ninja village)' },
          image: '/images/spots/fuji-shinobi.webp',
          time: { ja: '車で約15分', en: 'About 15 min by car' },
          body: {
            ja: '迫力ある忍者ショーや手裏剣体験が楽しめる忍者のテーマパーク。日本庭園越しの富士山も見どころです。',
            en: 'A ninja theme park with live ninja shows and shuriken throwing, and Mt. Fuji beyond its Japanese garden.',
          },
          query: '忍野しのびの里',
        },
        {
          name: { ja: '山梨県立富士湧水の里水族館', en: 'Fuji Wakimizu no Sato Aquarium' },
          image: '/images/spots/fuji-aquarium.webp',
          time: { ja: '車で約15分', en: 'About 15 min by car' },
          body: {
            ja: '富士山の湧水で淡水魚を育てる「森の中の水族館」。澄んだ水の中を泳ぐ魚たちを間近に観察できます。',
            en: 'The “aquarium in the forest”, raising freshwater fish in Mt. Fuji’s spring water — see them up close in crystal-clear tanks.',
          },
          query: '山梨県立富士湧水の里水族館',
        },
      ],
      events: [
        {
          season: 'spring',
          name: { ja: '富士芝桜まつり', en: 'Fuji Shibazakura Festival' },
          when: { ja: '4月中旬〜5月下旬', en: 'Mid April – late May' },
          place: { ja: '富士本栖湖リゾート', en: 'Fuji Motosuko Resort' },
          body: { ja: '約50万株の芝桜が富士山の麓を彩る、春の人気イベント。', en: 'Some 500,000 moss phlox plants carpet the foot of Mt. Fuji.' },
          query: '富士芝桜まつり',
        },
        {
          season: 'summer',
          name: { ja: '吉田の火祭り', en: 'Yoshida Fire Festival' },
          when: { ja: '8月26日・27日', en: '26–27 August' },
          place: { ja: '北口本宮冨士浅間神社・富士吉田市街', en: 'Kitaguchi Hongu Fuji Sengen Shrine & town' },
          body: { ja: '富士山の山じまいを告げる日本三奇祭のひとつ。街中に大松明が灯ります。', en: 'One of Japan’s three great unusual festivals, closing the climbing season with giant torches.' },
          query: '吉田の火祭り',
        },
        {
          season: 'autumn',
          name: { ja: '富士河口湖紅葉まつり', en: 'Fujikawaguchiko Autumn Leaves Festival' },
          when: { ja: '10月下旬〜11月中旬', en: 'Late October – mid November' },
          place: { ja: '河口湖畔 もみじ回廊', en: 'Momiji Corridor, Lake Kawaguchi' },
          body: { ja: '紅葉のトンネルと富士山を一緒に楽しめる、秋の河口湖の風物詩。', en: 'A tunnel of red maples with Mt. Fuji behind — Lake Kawaguchi in autumn.' },
          query: '河口湖 もみじ回廊',
        },
        {
          season: 'winter',
          name: { ja: '河口湖冬花火', en: 'Lake Kawaguchi Winter Fireworks' },
          when: { ja: '1月下旬〜2月の週末', en: 'Weekends, late January – February' },
          place: { ja: '河口湖畔', en: 'Lake Kawaguchi' },
          body: { ja: '澄んだ冬の夜空に、富士山と湖を背景にした花火が上がります。', en: 'Fireworks over the lake under clear winter skies, with Mt. Fuji behind.' },
          query: '河口湖 冬花火',
        },
      ],
    },
  },

  nagoya: {
    // Photo strips. 周辺景色 = Nagoya sights (not rooms); 内景色 = rooms + bathroom.
    scenery: {
      inside: ['/images/nagoya/room-01.webp', '/images/nagoya/nagoya-03.webp', '/images/nagoya/room-02.webp', '/images/nagoya/nagoya-05.webp', '/images/nagoya/room-03.webp'],
      around: [
        '/images/spots/nagoya-konomiya-v2.webp',
        '/images/nagoya/castle-01.webp',
        '/images/spots/nagoya-atsuta-v2.webp',
        '/images/spots/nagoya-tokugawa-v2.webp',
        '/images/spots/nagoya-kiyosu-v2.webp',
      ],
    },
    // Short cards for WHATS SPECIAL (the live About copy is too long to sit on a photo).
    features: [
      { title: { ja: '駅から徒歩約5分', en: '5 min from the station' }, body: { ja: '名鉄「国府宮駅」から徒歩約5分。名古屋駅へ急行約15分', en: '5 min walk from Konomiya; 15 min express to Nagoya' }, image: '/images/spots/nagoya-konomiya-v2.webp' },
      { title: { ja: '3タイプの客室', en: 'Three room types' }, body: { ja: 'ダブル・ツイン・トリプル。一人旅からご家族まで', en: 'Double, twin and triple — solo trips to families' }, image: '/images/nagoya/room-03.webp' },
      { title: { ja: '名古屋観光の拠点', en: 'A base for Nagoya' }, body: { ja: '名古屋城・熱田神宮・徳川美術館へ', en: 'Nagoya Castle, Atsuta Shrine, Tokugawa Art Museum' }, image: '/images/nagoya/castle-01.webp' },
      { title: { ja: 'ビジネスにも', en: 'For business too' }, body: { ja: '観光にもビジネスにも便利な立地', en: 'Convenient for sightseeing and work alike' }, image: '/images/nagoya/room-01.webp' },
      { title: { ja: '団体・グループ歓迎', en: 'Groups welcome' }, body: { ja: '研修・社員旅行・ツアーのご宿泊に', en: 'Training trips, company outings and tours' }, image: '/images/nagoya/room-02.webp' },
      { title: { ja: '空港からも便利', en: 'Easy from the airport' }, body: { ja: '中部国際空港から名鉄で約1時間', en: 'About 1 h from Centrair on the Meitetsu line' }, image: '/images/spots/nagoya-atsuta-v2.webp' },
    ],
    rooms: {
      lead: {
        ja: '客室は、一人旅のお客様からご家族・団体でのご利用まで、さまざまなスタイルに寄り添えるよう設計されています。',
        en: 'Rooms are designed for every style of stay, from solo travellers to families and groups.',
      },
      items: [
        {
          name: { ja: 'ダブルルーム', en: 'Double Room' },
          image: '/images/nagoya/room-01.webp',
          // Only this room type's photos (+ the bathroom). No blue-bed photos.
          gallery: ['/images/nagoya/nagoya-03.webp'],
          facts: [
            { label: { ja: '客室タイプ', en: 'Room type' }, value: { ja: 'ダブルルーム', en: 'Double' } },
            { label: { ja: 'ベッド', en: 'Beds' }, value: { ja: 'ダブルベッド × 1', en: '1 double bed' } },
            { label: { ja: '定員', en: 'Capacity' }, value: { ja: '1〜2名様', en: '1–2 guests' } },
          ],
          amenities: [
            { ja: '無料Wi-Fi', en: 'Free Wi-Fi' },
            { ja: 'テレビ', en: 'TV' },
            { ja: '冷蔵庫', en: 'Fridge' },
            { ja: 'エアコン', en: 'Air conditioning' },
            { ja: 'バス・トイレ', en: 'Bath & toilet' },
            { ja: 'アメニティ一式', en: 'Toiletries' },
          ],
          body: {
            ja: 'お一人様やご夫婦でのご滞在に。落ち着いた色調で、観光やお仕事の後にゆっくりお休みいただけます。',
            en: 'For solo guests or couples — calm tones to rest well after sightseeing or work.',
          },
          specs: [{ ja: '1〜2名様', en: '1–2 guests' }],
        },
        {
          name: { ja: 'ツインルーム', en: 'Twin Room' },
          image: '/images/nagoya/room-02.webp',
          gallery: ['/images/nagoya/nagoya-05.webp', '/images/nagoya/nagoya-03.webp'],
          facts: [
            { label: { ja: '客室タイプ', en: 'Room type' }, value: { ja: 'ツインルーム', en: 'Twin' } },
            { label: { ja: 'ベッド', en: 'Beds' }, value: { ja: 'シングルベッド × 2', en: '2 single beds' } },
            { label: { ja: '定員', en: 'Capacity' }, value: { ja: '2名様', en: '2 guests' } },
          ],
          amenities: [
            { ja: '無料Wi-Fi', en: 'Free Wi-Fi' },
            { ja: 'テレビ', en: 'TV' },
            { ja: '冷蔵庫', en: 'Fridge' },
            { ja: 'エアコン', en: 'Air conditioning' },
            { ja: 'バス・トイレ', en: 'Bath & toilet' },
            { ja: 'アメニティ一式', en: 'Toiletries' },
          ],
          body: {
            ja: 'ご友人同士や出張にも便利なツインルーム。それぞれのベッドでゆったりとお過ごしいただけます。',
            en: 'A twin room for friends or colleagues, with a bed each to relax in.',
          },
          specs: [{ ja: '2名様', en: '2 guests' }],
        },
        {
          name: { ja: 'トリプルルーム', en: 'Triple Room' },
          image: '/images/nagoya/room-03.webp',
          gallery: ['/images/nagoya/nagoya-03.webp'],
          facts: [
            { label: { ja: '客室タイプ', en: 'Room type' }, value: { ja: 'トリプルルーム', en: 'Triple' } },
            { label: { ja: 'ベッド', en: 'Beds' }, value: { ja: 'シングルベッド × 3', en: '3 single beds' } },
            { label: { ja: '定員', en: 'Capacity' }, value: { ja: '3名様', en: '3 guests' } },
          ],
          amenities: [
            { ja: '無料Wi-Fi', en: 'Free Wi-Fi' },
            { ja: 'テレビ', en: 'TV' },
            { ja: '冷蔵庫', en: 'Fridge' },
            { ja: 'エアコン', en: 'Air conditioning' },
            { ja: 'バス・トイレ', en: 'Bath & toilet' },
            { ja: 'アメニティ一式', en: 'Toiletries' },
          ],
          body: {
            ja: 'ご家族や小グループでのご旅行に。皆さまご一緒に過ごせる、ゆとりある客室です。',
            en: 'For families and small groups — room for everyone together.',
          },
          specs: [{ ja: '3名様', en: '3 guests' }],
        },
      ],
    },
    dining: {
      lead: {
        ja: '味噌カツ、ひつまぶし、手羽先――名古屋は「名古屋めし」の宝庫。旅の楽しみは食事から。',
        en: 'Miso katsu, hitsumabushi, chicken wings — Nagoya is a treasure trove of local food.',
      },
      items: [
        {
          label: 'Breakfast',
          title: { ja: 'ご朝食', en: 'Breakfast' },
          body: BREAKFAST_NOTE,
        },
        {
          label: 'Nagoya Meshi',
          title: { ja: '味噌カツ・ひつまぶし', en: 'Miso katsu & hitsumabushi' },
          image: '/images/spots/nagoya-hitsumabushi-v2.webp',
          body: {
            ja: '濃厚な八丁味噌のタレをかけた味噌カツや、三通りの食べ方で楽しむうなぎのひつまぶしは、名古屋を訪れたらぜひ味わいたい名物です。',
            en: 'Pork cutlet in rich Hatcho miso sauce, and eel hitsumabushi eaten three ways — must-tries on any Nagoya trip.',
          },
        },
        {
          label: 'Nagoya Meshi',
          title: { ja: '手羽先', en: 'Tebasaki chicken wings' },
          image: '/images/spots/nagoya-tebasaki.webp',
          body: {
            ja: '甘辛いタレとごま、こしょうをまとった名古屋名物の手羽先。カリッと香ばしく、ビールのお供にも欠かせない一品です。',
            en: 'Nagoya’s famous wings, glazed in a sweet-savoury sauce with sesame and pepper — crisp, fragrant and made for a cold beer.',
          },
        },
        {
          label: 'Nagoya Meshi',
          title: { ja: '味噌煮込みうどん', en: 'Miso nikomi udon' },
          image: '/images/spots/nagoya-misonikomi.webp',
          body: {
            ja: 'コシの強い麺を土鍋で豆味噌のだしと煮込む、名古屋の冬の定番。卵や油揚げを添えて、熱々のままお楽しみください。',
            en: 'Firm udon simmered in a clay pot of soybean-miso broth with egg and fried tofu — a Nagoya winter classic, best eaten piping hot.',
          },
        },
        {
          label: 'Neighbourhood',
          title: { ja: '国府宮周辺のお店', en: 'Around Konomiya' },
          body: {
            ja: '国府宮駅周辺には、そば処や居酒屋など地元で親しまれるお店が揃い、夕食にも気軽にお出かけいただけます。',
            en: 'Around Konomiya Station you will find local favourites, from soba shops to izakaya — easy to pop out for dinner.',
          },
        },
      ],
    },
    access: {
      lead: {
        ja: '名鉄「国府宮駅」から近く、名古屋駅へも電車一本。観光にもビジネスにも便利な拠点です。',
        en: 'Close to Meitetsu Konomiya Station, with a direct train to Nagoya — handy for sightseeing and business.',
      },
      routes: [
        {
          mode: 'walk',
          from: { ja: '名鉄名古屋本線「国府宮駅」', en: 'Meitetsu Nagoya Line, Konomiya Station' },
          detail: { ja: '徒歩約5分', en: 'About 5 min on foot' },
        },
        {
          mode: 'train',
          from: { ja: '名鉄名古屋駅', en: 'Meitetsu Nagoya Station' },
          detail: { ja: '国府宮駅まで急行で約15分', en: 'About 15 min by express to Konomiya' },
        },
        {
          mode: 'plane',
          from: { ja: '中部国際空港（セントレア）', en: 'Chubu Centrair International Airport' },
          detail: { ja: '名鉄で国府宮駅まで約1時間', en: 'About 1 h to Konomiya on the Meitetsu line' },
        },
      ],
      journeys: [
        {
          title: { ja: '名古屋駅から', en: 'From Nagoya Station' },
          steps: [
            { place: { ja: '名鉄名古屋駅', en: 'Meitetsu Nagoya' }, leg: { mode: 'train', text: { ja: '急行 約15分', en: 'Express, about 15 min' } } },
            { place: { ja: '国府宮駅', en: 'Konomiya Station' }, leg: { mode: 'walk', text: { ja: '徒歩 約5分', en: 'About 5 min on foot' } } },
            { place: { ja: 'ホテル', en: 'Hotel' } },
          ],
        },
        {
          title: { ja: '空港から', en: 'From the airport' },
          steps: [
            { place: { ja: '中部国際空港', en: 'Centrair Airport' }, leg: { mode: 'train', text: { ja: '名鉄 約1時間', en: 'Meitetsu, about 1 h' } } },
            { place: { ja: '国府宮駅', en: 'Konomiya Station' }, leg: { mode: 'walk', text: { ja: '徒歩 約5分', en: 'About 5 min on foot' } } },
            { place: { ja: 'ホテル', en: 'Hotel' } },
          ],
        },
      ],
    },
    sightseeing: {
      lead: {
        ja: '国府宮の歴史ある神社から、名古屋城や熱田神宮まで。尾張・名古屋の魅力を巡る旅の拠点に。',
        en: 'From Konomiya’s historic shrine to Nagoya Castle and Atsuta Shrine — a base for exploring Owari and Nagoya.',
      },
      spots: [
        {
          name: { ja: '尾張大國霊神社（国府宮）', en: 'Owari Okunitama Shrine (Konomiya)' },
          image: '/images/spots/nagoya-konomiya-v2.webp',
          focus: 'center 55%',
          time: { ja: '徒歩約5分', en: 'About 5 min on foot' },
          body: {
            ja: '尾張の総社として知られる古社。毎年旧正月に行われる「はだか祭」は、多くの参拝者で賑わいます。',
            en: 'The ancient head shrine of Owari, famous for the Hadaka Matsuri “naked festival” held each lunar new year.',
          },
          query: '尾張大國霊神社',
        },
        {
          name: { ja: '清洲城', en: 'Kiyosu Castle' },
          image: '/images/spots/nagoya-kiyosu-v2.webp',
          focus: 'center 22%',
          time: { ja: '車で約15分', en: 'About 15 min by car' },
          body: {
            ja: '織田信長ゆかりの城。天守からは五条川と尾張の街並みを一望できます。',
            en: 'The castle linked to Oda Nobunaga, with views over the Gojo River and the Owari plain.',
          },
          query: '清洲城',
        },
        {
          name: { ja: '名古屋城', en: 'Nagoya Castle' },
          time: { ja: '電車・車で約30分', en: 'About 30 min by train or car' },
          body: {
            ja: '金のしゃちほこで知られる名古屋のシンボル。復元された本丸御殿の豪華絢爛な装飾も見どころです。',
            en: 'Nagoya’s symbol, crowned with golden shachihoko — and the lavishly restored Honmaru Palace.',
          },
          image: '/images/nagoya/castle-01.webp',
          query: '名古屋城',
          pickup: true,
          site: 'https://www.nagoyajo.city.nagoya.jp/',
        },
        {
          name: { ja: '熱田神宮', en: 'Atsuta Shrine' },
          image: '/images/spots/nagoya-atsuta-v2.webp',
          time: { ja: '電車で約40分', en: 'About 40 min by train' },
          body: {
            ja: '三種の神器のひとつ「草薙神剣」を祀る、由緒ある神宮。緑豊かな境内は都会の中の静かな森です。',
            en: 'Home of the sacred Kusanagi sword, one of the three imperial regalia — a quiet forest in the city.',
          },
          query: '熱田神宮',
          site: 'https://www.atsutajingu.or.jp/',
        },
        {
          name: { ja: '徳川美術館', en: 'Tokugawa Art Museum' },
          image: '/images/spots/nagoya-tokugawa-v2.webp',
          time: { ja: '車で約35分', en: 'About 35 min by car' },
          body: {
            ja: '尾張徳川家に伝わる大名道具を収蔵。国宝「源氏物語絵巻」をはじめ、貴重な名品を所蔵しています。',
            en: 'Treasures of the Owari Tokugawa family, including the national-treasure Tale of Genji scrolls.',
          },
          query: '徳川美術館',
          site: 'https://www.tokugawa-art-museum.jp/',
        },
      ],
      events: [
        {
          season: 'spring',
          name: { ja: '名古屋城 春まつり', en: 'Nagoya Castle Spring Festival' },
          when: { ja: '3月下旬〜4月上旬', en: 'Late March – early April' },
          place: { ja: '名古屋城', en: 'Nagoya Castle' },
          body: { ja: '約1,000本の桜が天守を彩り、夜はライトアップも行われます。', en: 'About 1,000 cherry trees frame the keep, lit up at night.' },
          query: '名古屋城',
        },
        {
          season: 'summer',
          name: { ja: '稲沢あじさいまつり', en: 'Inazawa Hydrangea Festival' },
          when: { ja: '6月上旬〜中旬', en: 'Early – mid June' },
          place: { ja: '性海寺・大塚性海寺歴史公園', en: 'Shokaiji Temple' },
          body: { ja: '約1万株のあじさいが境内と公園を埋め尽くします。', en: 'Around 10,000 hydrangeas fill the temple and park.' },
          query: '性海寺',
        },
        {
          season: 'autumn',
          name: { ja: 'そぶえイチョウ黄葉まつり', en: 'Sobue Ginkgo Festival' },
          when: { ja: '11月下旬〜12月上旬', en: 'Late November – early December' },
          place: { ja: '稲沢市祖父江町', en: 'Sobue, Inazawa' },
          body: { ja: '日本有数のイチョウの産地が黄金色に染まる、晩秋の祭りです。', en: 'One of Japan’s great ginkgo towns turns gold in late autumn.' },
          query: '祖父江 イチョウ',
        },
        {
          season: 'winter',
          name: { ja: '国府宮はだか祭', en: 'Konomiya Hadaka Matsuri' },
          when: { ja: '旧暦正月13日', en: '13th day of the lunar new year' },
          place: { ja: '尾張大國霊神社（国府宮）', en: 'Owari Okunitama Shrine' },
          body: { ja: '数千人の裸男が神男に触れて厄を落とす、1250年以上続く奇祭。', en: 'Thousands of loincloth-clad men reach for the “shin-otoko” to shed bad luck — a 1,250-year tradition.' },
          query: '尾張大國霊神社',
        },
      ],
    },
  },

  toji: {
    features: [
      { title: { ja: '世界遺産・東寺の目の前', en: 'Facing World Heritage Toji' }, body: { ja: '1200年の歴史を刻む東寺のすぐ前に', en: 'Right in front of 1,200-year-old Toji' }, image: '/images/toji/toji-01.webp' },
      { title: { ja: '五重塔を望む客室', en: 'Rooms with a pagoda view' }, body: { ja: '一部の客室から東寺の五重塔を望めます', en: 'Some rooms look out on Toji’s five-storey pagoda' }, image: '/images/toji/toji-04.webp' },
      { title: { ja: '京都駅から約5分', en: '5 min from Kyoto Station' }, body: { ja: '八条口からタクシーで約5分。観光にも移動にも', en: 'About 5 min by taxi from the Hachijo exit' }, image: '/images/toji/toji-07.webp' },
      { title: { ja: '光で変わる東寺', en: 'Toji in changing light' }, body: { ja: '朝の光、夕暮れ、夜のライトアップ', en: 'Morning light, dusk and the evening illumination' }, image: '/images/toji/toji-06.webp' },
      { title: { ja: '和のツインルーム', en: 'Japanese-accent twins' }, body: { ja: '静かな京都の夜をゆっくりと', en: 'Quiet Kyoto nights, at your own pace' }, image: '/images/toji/toji-08.webp' },
      { title: { ja: '朝夕の散策に', en: 'Morning and evening walks' }, body: { ja: '目の前の東寺へ、気軽に立ち寄れる距離', en: 'Toji is just across the street' }, image: '/images/toji/toji-03.webp' },
      { title: { ja: '団体・グループ歓迎', en: 'Groups welcome' }, body: { ja: '研修・社員旅行・ツアーのご宿泊に', en: 'Training trips, company outings and tours' }, image: '/images/toji/toji-02.webp' },
    ],
    rooms: {
      lead: {
        ja: '客室数をあえて15室に限定したスモールホテル。一部の客室からは、世界遺産・東寺の五重塔を望みます。',
        en: 'A small hotel deliberately limited to 15 rooms — some look out on the five-storey pagoda of World Heritage Toji.',
      },
      items: [
        {
          name: { ja: '五重塔ビューの客室', en: 'Pagoda View Room' },
          image: '/images/toji/toji-04.webp',
          gallery: ['/images/toji/toji-03.webp', '/images/toji/toji-06.webp'],
          facts: [
            { label: { ja: '客室タイプ', en: 'Room type' }, value: { ja: '五重塔ビュー', en: 'Pagoda view' } },
            { label: { ja: '定員', en: 'Capacity' }, value: { ja: '2名様', en: '2 guests' } },
            { label: { ja: '眺望', en: 'View' }, value: { ja: '東寺 五重塔', en: 'Toji pagoda' } },
          ],
          amenities: [
            { ja: '無料Wi-Fi', en: 'Free Wi-Fi' },
            { ja: 'テレビ', en: 'TV' },
            { ja: '冷蔵庫', en: 'Fridge' },
            { ja: 'エアコン', en: 'Air conditioning' },
            { ja: 'バス・トイレ', en: 'Bath & toilet' },
            { ja: 'アメニティ一式', en: 'Toiletries' },
          ],
          body: {
            ja: '窓の向こうに東寺の五重塔。朝の光、夕暮れ、夜のライトアップと、時間とともに変わる景色をお楽しみください。',
            en: 'Toji’s pagoda beyond the window — morning light, dusk and night illumination, changing through the day.',
          },
          specs: [{ ja: '東寺ビュー', en: 'Toji view' }],
        },
        {
          name: { ja: 'ツインルーム', en: 'Twin Room' },
          image: '/images/toji/toji-08.webp',
          // Client: no building/temple shots here; bathroom photo as on Nagoya.
          gallery: ['/images/nagoya/nagoya-03.webp'],
          facts: [
            { label: { ja: '客室タイプ', en: 'Room type' }, value: { ja: 'ツインルーム', en: 'Twin' } },
            { label: { ja: 'ベッド', en: 'Beds' }, value: { ja: 'シングルベッド × 2', en: '2 single beds' } },
            { label: { ja: '定員', en: 'Capacity' }, value: { ja: '2名様', en: '2 guests' } },
          ],
          amenities: [
            { ja: '無料Wi-Fi', en: 'Free Wi-Fi' },
            { ja: 'テレビ', en: 'TV' },
            { ja: '冷蔵庫', en: 'Fridge' },
            { ja: 'エアコン', en: 'Air conditioning' },
            { ja: 'バス・トイレ', en: 'Bath & toilet' },
            { ja: 'アメニティ一式', en: 'Toiletries' },
          ],
          body: {
            ja: '和のアクセントを取り入れた落ち着きのあるツインルーム。観光の後も、静かな京都の夜をゆっくりお過ごしいただけます。',
            en: 'A calm twin room with Japanese accents — a quiet Kyoto night after a day of sightseeing.',
          },
          specs: [
            { ja: '2名様', en: '2 guests' },
            { ja: 'ツインベッド', en: 'Twin beds' },
          ],
        },
      ],
    },
    dining: {
      lead: {
        ja: '京都駅にもほど近く、京料理から気軽な食事処まで、お食事の選択肢が豊富な立地です。',
        en: 'Close to Kyoto Station, with everything from Kyoto cuisine to casual eateries nearby.',
      },
      items: [
        {
          label: 'Breakfast',
          title: { ja: 'ご朝食', en: 'Breakfast' },
          body: BREAKFAST_NOTE,
        },
        {
          label: 'Kyoto Cuisine',
          title: { ja: '京料理（会席）', en: 'Kyoto kaiseki' },
          image: '/images/spots/toji-kaiseki-v2.webp',
          body: {
            ja: '旬の食材を美しい器に少しずつ盛り付ける京料理。目でも季節を味わえる会席は、京都の夜を特別なひとときにしてくれます。京都駅周辺には老舗から新しいお店まで揃っています。',
            en: 'Seasonal ingredients served a little at a time in beautiful dishes — a kaiseki dinner makes a Kyoto evening special. Around Kyoto Station you will find everything from old houses to new restaurants.',
          },
        },
        {
          label: 'Kyoto Cuisine',
          title: { ja: '湯豆腐・湯葉', en: 'Yudofu & yuba' },
          image: '/images/spots/toji-yudofu.webp',
          body: {
            ja: '京都の良質な水が生む、なめらかな豆腐と湯葉。昆布だしでやさしく温める湯豆腐は、寒い季節の京都で味わいたい定番の一品です。',
            en: 'Silky tofu and yuba made with Kyoto’s soft water. Yudofu, gently warmed in kombu broth, is a classic to enjoy on a cold Kyoto day.',
          },
        },
        {
          label: 'Kyoto Cuisine',
          title: { ja: '抹茶スイーツ', en: 'Matcha sweets' },
          image: '/images/spots/toji-matcha.webp',
          body: {
            ja: '宇治抹茶を使ったゼリーやパフェ、わらび餅など、京都ならではの甘味。京都駅周辺にも茶房が多く、観光の合間のひと休みにぴったりです。',
            en: 'Uji matcha jellies, parfaits and warabi-mochi — sweets that taste of Kyoto. Tea rooms around Kyoto Station make an easy break between sights.',
          },
        },
        {
          label: 'Neighbourhood',
          title: { ja: '東寺周辺', en: 'Around Toji' },
          body: {
            ja: '毎月21日の「弘法市」では、骨董や食べ歩きグルメの屋台が境内に並び、地元の賑わいを楽しめます。',
            en: 'On the 21st of every month the Kobo-ichi market fills the temple grounds with antiques and street food.',
          },
        },
      ],
    },
    access: {
      lead: {
        ja: '世界遺産・東寺の目の前。京都駅からも近く、観光にも移動にも使いやすい立地です。',
        en: 'Directly in front of World Heritage Toji and close to Kyoto Station — easy for sightseeing and travel.',
      },
      routes: [
        {
          mode: 'train',
          from: { ja: 'JR・新幹線「京都駅」（八条口）', en: 'JR / Shinkansen Kyoto Station (Hachijo exit)' },
          detail: { ja: 'タクシーで約5分／徒歩約20分', en: 'About 5 min by taxi / 20 min on foot' },
        },
        {
          mode: 'walk',
          from: { ja: '近鉄京都線「東寺駅」', en: 'Kintetsu Kyoto Line, Toji Station' },
          detail: { ja: '徒歩約10分', en: 'About 10 min on foot' },
        },
        {
          mode: 'plane',
          from: { ja: '関西国際空港', en: 'Kansai International Airport' },
          detail: { ja: '特急はるかで京都駅まで約75分', en: 'About 75 min to Kyoto on the Haruka express' },
        },
      ],
      journeys: [
        {
          title: { ja: '京都駅から', en: 'From Kyoto Station' },
          steps: [
            { place: { ja: '京都駅（八条口）', en: 'Kyoto Station (Hachijo exit)' }, leg: { mode: 'car', text: { ja: 'タクシー 約5分', en: 'Taxi, about 5 min' } } },
            { place: { ja: 'ホテル', en: 'Hotel' } },
          ],
        },
        {
          title: { ja: '近鉄でお越しの場合', en: 'By Kintetsu line' },
          steps: [
            { place: { ja: '京都駅', en: 'Kyoto Station' }, leg: { mode: 'train', text: { ja: '近鉄京都線 約2分', en: 'Kintetsu line, about 2 min' } } },
            { place: { ja: '東寺駅', en: 'Toji Station' }, leg: { mode: 'walk', text: { ja: '徒歩 約10分', en: 'About 10 min on foot' } } },
            { place: { ja: 'ホテル', en: 'Hotel' } },
          ],
        },
        {
          title: { ja: '関西空港から', en: 'From Kansai Airport' },
          steps: [
            { place: { ja: '関西国際空港', en: 'Kansai Airport' }, leg: { mode: 'train', text: { ja: '特急はるか 約75分', en: 'Haruka express, about 75 min' } } },
            { place: { ja: '京都駅', en: 'Kyoto Station' }, leg: { mode: 'car', text: { ja: 'タクシー 約5分', en: 'Taxi, about 5 min' } } },
            { place: { ja: 'ホテル', en: 'Hotel' } },
          ],
        },
      ],
    },
    sightseeing: {
      lead: {
        ja: '世界遺産・東寺を目の前に、京都駅を起点に市内の名所へ。千年の都を巡る旅の拠点に。',
        en: 'World Heritage Toji on the doorstep and Kyoto Station nearby — a base for the thousand-year capital.',
      },
      spots: [
        {
          name: { ja: '東寺（教王護国寺）', en: 'Toji Temple' },
          time: { ja: '徒歩すぐ（目の前）', en: 'Just across the street' },
          body: {
            ja: '平安京唯一の遺構として残る世界遺産。高さ約55mの五重塔は木造塔として日本一の高さを誇ります。',
            en: 'A World Heritage site and the only surviving structure of the Heian capital; its 55 m pagoda is Japan’s tallest wooden tower.',
          },
          image: '/images/spots/toji-night-toji.webp',
          focus: 'center 35%',
          query: '東寺',
          pickup: true,
          site: 'https://toji.or.jp/',
        },
        {
          name: { ja: '京都水族館', en: 'Kyoto Aquarium' },
          image: '/images/spots/toji-aquarium.webp',
          time: { ja: '徒歩約15分', en: 'About 15 min on foot' },
          body: {
            ja: '京都の川や海の生きものに出会える水族館。光が差し込む大水槽を群れで泳ぐ魚たちは迫力満点で、ご家族連れにもおすすめです。',
            en: 'An aquarium of Kyoto’s rivers and seas. Schools of fish sweep through the great sunlit tank — a favourite with families.',
          },
          query: '京都水族館',
          site: 'https://www.kyoto-aquarium.com/',
        },
        {
          name: { ja: '梅小路公園', en: 'Umekoji Park' },
          image: '/images/spots/toji-umekoji-park.webp',
          time: { ja: '徒歩約15分', en: 'About 15 min on foot' },
          body: {
            ja: '京都駅の西に広がる、芝生と緑の広大な公園。春には梅や桜が園内を彩り、京都水族館や京都鉄道博物館も同じ園内にあります。',
            en: 'A wide park of lawns and greenery west of Kyoto Station. Plum and cherry blossoms colour it in spring, and the Kyoto Aquarium and Railway Museum stand in the same grounds.',
          },
          query: '梅小路公園',
        },
        {
          name: { ja: '伏見稲荷大社', en: 'Fushimi Inari Taisha' },
          image: '/images/spots/toji-night-inari-v2.webp',
          time: { ja: '電車・車で約15分', en: 'About 15 min by train or car' },
          body: {
            ja: '朱色の鳥居が山へと続く「千本鳥居」で知られる、全国の稲荷神社の総本宮です。',
            en: 'Head shrine of all Inari shrines, famous for the thousands of vermilion torii climbing the mountain.',
          },
          query: '伏見稲荷大社',
          site: 'https://inari.jp/',
        },
        {
          name: { ja: '清水寺・東山', en: 'Kiyomizu-dera & Higashiyama' },
          time: { ja: '車で約20分', en: 'About 20 min by car' },
          body: {
            ja: '「清水の舞台」で知られる世界遺産と、八坂の塔や二年坂など石畳の町並みが続く京都らしい散策エリア。',
            en: 'The World Heritage temple with its famous stage, and the stone-paved lanes around Yasaka Pagoda and Ninenzaka.',
          },
          image: '/images/spots/toji-night-kiyomizu-v2.webp',
          focus: '62% center',
          query: '清水寺',
          site: 'https://www.kiyomizudera.or.jp/',
        },
        {
          name: { ja: '西本願寺', en: 'Nishi Hongan-ji' },
          image: '/images/spots/toji-night-nishihongan-v2.webp',
          time: { ja: '徒歩約20分', en: 'About 20 min on foot' },
          body: {
            ja: '浄土真宗本願寺派の本山で、世界遺産。国宝の唐門や御影堂など、桃山文化の華やかな建築が見られます。',
            en: 'World Heritage head temple of the Jodo Shinshu Honganji school, with lavish Momoyama-era architecture.',
          },
          query: '西本願寺',
          site: 'https://www.hongwanji.or.jp/',
        },
      ],
      events: [
        {
          season: 'spring',
          name: { ja: '東寺 桜の夜間特別拝観', en: 'Toji Cherry Blossom Night Viewing' },
          when: { ja: '3月中旬〜4月中旬', en: 'Mid March – mid April' },
          place: { ja: '東寺', en: 'Toji' },
          body: { ja: 'ライトアップされたしだれ桜「不二桜」と五重塔の共演。', en: 'The weeping cherry “Fuji-zakura” lit up beside the pagoda.' },
          query: '東寺',
        },
        {
          season: 'summer',
          name: { ja: '祇園祭', en: 'Gion Matsuri' },
          when: { ja: '7月1日〜31日', en: '1–31 July' },
          place: { ja: '八坂神社・四条烏丸周辺', en: 'Yasaka Shrine & Shijo-Karasuma' },
          body: { ja: '京都の夏を彩る日本三大祭のひとつ。山鉾巡行は17日・24日。', en: 'One of Japan’s three great festivals; the float parades are on the 17th and 24th.' },
          query: '八坂神社',
        },
        {
          season: 'autumn',
          name: { ja: '時代祭', en: 'Jidai Matsuri' },
          when: { ja: '10月22日', en: '22 October' },
          place: { ja: '京都御所〜平安神宮', en: 'Kyoto Imperial Palace to Heian Shrine' },
          body: { ja: '平安から明治までの装束をまとった行列が都大路を進みます。', en: 'A procession in costumes from the Heian to the Meiji era.' },
          query: '平安神宮',
        },
        {
          season: 'winter',
          name: { ja: '終い弘法', en: 'Shimai Kobo market' },
          when: { ja: '12月21日', en: '21 December' },
          place: { ja: '東寺', en: 'Toji' },
          body: { ja: '一年最後の弘法市。正月用品や骨董の露店で境内が賑わいます。', en: 'The year’s last Kobo-ichi market, packed with New Year goods and antiques.' },
          query: '東寺',
        },
      ],
    },
  },
};

export function getStay(slug: Hotel['slug']): HotelStay {
  return stays[slug];
}
