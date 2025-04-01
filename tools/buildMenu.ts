/// <reference lib="deno.ns" />
import 'jsr:@std/dotenv/load';
import { parse as parseCsv } from 'jsr:@std/csv';

const JSON_SPACE: Record<string, number> = {
    'DEV': 4,
    'TEST': 4,
};

const TEMPERATURE_SET: Record<string, Array<string>> = {
    'a': ['DRINKS_ICE', 'DRINKS_HOT'],
    'b': ['DRINKS_ICE', 'DRINKS_ROOM_TEMPERATURE']
}

class Dish {
    id: string;
    price: number;
    priceLarge: number;
    takeoutBox: boolean;
    vegetarian: boolean;
    description: boolean;
    sugar: boolean;
    temperature: Array<string>;
    flavors: Record<string, number | Array<string>>;
    addons: Record<string, number>;

    constructor(
        id: string,
        price: number,
        priceLarge: number,
        takeoutBox: string,
        vegetarian: string,
        description: string,
        sugar: string,
        temperature: string,
        flavors: string,
        addons: string,
    ) {
        this.id = id;
        this.price = price;
        this.priceLarge = priceLarge;
        this.takeoutBox = takeoutBox?.toLowerCase() == 'v';
        this.vegetarian = vegetarian?.toLowerCase() == 'v';
        this.description = description?.toLowerCase() == 'v';
        this.sugar = sugar?.toLowerCase() == 'v';
        switch (temperature?.toLowerCase()) {
            case 'a':
                this.temperature = TEMPERATURE_SET['a'];
                break;
            case 'b':
                this.temperature = TEMPERATURE_SET['b'];
                break;
            default:
                this.temperature = [];
        }
        this.flavors = {};
        if (flavors) {
            this.flavors = JSON.parse(flavors);
        }
        this.addons = {}
        if (addons) {
            this.addons = JSON.parse(addons);
        }
    }
}

class LoaderConfig {
    appEnv: string;
    pricingUrl: string;
    i18nUrl: string;
    menuJsonPath: string;
    localeJsonPath: string;
    localesFolderPath: string;

    constructor() {
        this.appEnv = Deno.env.get('APP_ENV') ?? 'DEV';
        this.pricingUrl = Deno.env.get('PRICING_URL') ?? '';
        this.i18nUrl = Deno.env.get('I18N_URL') ?? '';
        this.menuJsonPath = Deno.env.get('MENU_JSON') ?? '';
        this.localeJsonPath = Deno.env.get('LOCALE_JSON') ?? '';
        this.localesFolderPath = Deno.env.get('LOCALES_FOLDER') ?? '';
    }
}

class Loader {
    config: LoaderConfig;
    constructor(config: LoaderConfig) {
        this.config = config;
    }

    public loadMenuFromUrl(): void {
        fetch(this.config.pricingUrl)
            .then((response) => response.text())
            .then((csvText) => this.handleMenuResponseCsv(csvText))
            .then((menu) => this.createMenuJson(menu));
    }

    private handleMenuResponseCsv(
        csvText: string,
    ): Map<string, Map<string, Dish>> {
        const data = parseCsv(csvText, { skipFirstRow: true });
        const result: Map<string, Map<string, Dish>> = new Map();
        let currentCategory: Map<string, Dish> | undefined = undefined;
        for (let index = 0; index < data.length; index += 1) {
            const item_id = data[index]['id'];
            if (item_id.startsWith('CATEGORY_')) {
                if (!result.has(item_id)) {
                    result.set(item_id, new Map());
                }
                currentCategory = result.get(item_id);
            } else if (item_id.startsWith('ITEM_')) {
                const dish = new Dish(
                    item_id,
                    parseInt(data[index]['price']),
                    parseInt(data[index]['price-large']),
                    data[index]['takeout-box'],
                    data[index]['vegetarian'],
                    data[index]['description'],
                    data[index]['sugar'],
                    data[index]['temperature'],
                    data[index]['flavors'],
                    data[index]['addons'],
                );
                if (currentCategory !== undefined) {
                    currentCategory.set(item_id, dish);
                } else {
                    console.error(`Skip row(${index}): ${item_id}, no category found.`);
                }
            } else {
                console.error(`Skip row(${index}): ${item_id}, unknown prefix.`);
            }
        }

        return result;
    }

    private async createMenuJson(
        menu: Map<string, Map<string, Dish>>,
    ): Promise<void> {
        const menuObj = Object.fromEntries(
            Array.from(menu, ([key, value]) => [key, Object.fromEntries(value)]),
        );
        const jsonSpace = this.config.appEnv in JSON_SPACE ? JSON_SPACE[this.config.appEnv] : 0;
        const jsonString = JSON.stringify(menuObj, null, jsonSpace);
        await Deno.writeTextFile(this.config.menuJsonPath, jsonString);
    }

    public loadLocalesFromUrl(): void {
        fetch(this.config.i18nUrl)
            .then((response) => response.text())
            .then((csvText) => this.handleLocaleResponseCsv(csvText))
            .then((locales) => this.createLocalesJson(locales));
    }

    private handleLocaleResponseCsv(
        csvText: string,
    ): Map<string, Map<string, string>> {
        const data = parseCsv(csvText, { skipFirstRow: true });
        const result: Map<string, Map<string, string>> = new Map();
        const locales = Object.keys(data[0]).filter((key: string) => key !== 'id');
        locales.forEach((locale) => {
            result.set(locale, new Map());
        });
        data.forEach((row) => {
            const row_id = row['id'];
            Object.keys(row).forEach((key) => {
                if (key !== 'id' && row[key] !== '') {
                    result.get(key)!.set(row_id, row[key]);
                }
            });
        });

        return result;
    }

    private async createLocalesJson(
        locales: Map<string, Map<string, string>>,
    ): Promise<void> {
        const jsonSpace = this.config.appEnv in JSON_SPACE ? JSON_SPACE[this.config.appEnv] : 0;
        const localesObj = [];
        for (const locale_key of locales.keys()) {
            localesObj.push({
                key: locale_key,
                text: locales!.get(locale_key)!.get('LOCALE_TEXT'),
                json: `${this.config.localesFolderPath}/${locale_key}.json`,
            });
        }
        // locale.json
        await Deno.writeTextFile(
            this.config.localeJsonPath,
            JSON.stringify(localesObj, null, jsonSpace),
        );
        // locales/{locale}.json
        for (const localeConfig of localesObj) {
            const localeObj = Object.fromEntries(locales!.get(localeConfig['key'])!.entries());
            await Deno.writeTextFile(
                localeConfig['json'],
                JSON.stringify(localeObj, null, jsonSpace),
            );
        }
    }
}

const config = new LoaderConfig();
const loader = new Loader(config);
loader.loadMenuFromUrl();
loader.loadLocalesFromUrl();
