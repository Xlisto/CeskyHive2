import { DateFormat } from "./dateFormat";
/**
 * Model obsahující počáteční a koncové datum
 */
export class DatesModel {
    date: Date | null = new Date();
    dateFrom!: string;
    dateUntil!: string;
    interval: number = 7;
    dateFormat = new DateFormat();


    constructor(date: Date, interval: number, isFirst: boolean) {
        this.interval = interval;
        this.date = date;
        
        //počáteční datum
        let dateFrom = new Date(date);
        this.dateFrom = this.dateFormat.getLocaleDate(dateFrom);
        
        //konečný datum
        let dateUntil = new Date(date);
        dateUntil.setDate(date.getDate() + interval);
        dateUntil.setMilliseconds(dateUntil.getMilliseconds()-1000);
        if (isFirst)
            this.dateUntil = this.dateFormat.getDate(new Date());
        else
            this.dateUntil = this.dateFormat.getLocaleDate(dateUntil);
    }
}