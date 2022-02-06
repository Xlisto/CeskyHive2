/**
 * Konverze formátu Date na string
 */
export class DateFormat {

    formatDate = {
        //weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    } as const;

    constructor() {};

    /**
       * Vrátí zkratku národního prostředí
       * @returns 
       */
    getLang() {
        if (navigator.language !== undefined)
            return navigator.languages[0]
        else
            return navigator.language;
    }

    /**
     * Nastaví zobrazení na lokální formát datumu, s přepočtem časových pásem
     * @param date 
     * @returns 
     */
    getLocaleDate(date: Date) {
        const dt = new Date(date);
        dt.setUTCDate(dt.getDate())
        dt.setUTCHours(dt.getHours());
        dt.setUTCMinutes(dt.getMinutes());
        return dt.toLocaleTimeString(this.getLang(), this.formatDate);
    }

    /**
     * Nastaví zobrazení na lokální formát datumu, bez přepočtu časových pásem
     * @param date 
     * @returns 
     */
    getDate(date: Date) {
        const dt = new Date(date);
        return dt.toLocaleTimeString(this.getLang(), this.formatDate);
    }

}