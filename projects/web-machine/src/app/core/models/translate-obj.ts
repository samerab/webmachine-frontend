export class TranslateObj {
    ar: string;
    en: string;
    de: string;

    constructor(availableLangs?: string[]) {
        if (availableLangs) {
            for (const lang of availableLangs) {
                this[lang] = '';
            }
        }
        else {
            this.ar = '';
            this.en = '';
            this.de = '';
        }


    }

    static get availableLangs(): string[] {
        return ['ar', 'en', 'de']
    }

    static indexOf(lang: string): number {
        return this.availableLangs.indexOf(lang)
    }

}