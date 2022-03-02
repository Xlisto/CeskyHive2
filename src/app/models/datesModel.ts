import { DateFormat } from "./dateFormat";
/**
 * Model obsahující počáteční a koncové datum
 */
export class DatesModel {
    date: Date | null = new Date();
    dateFrom!: string;
    dateUntil!: string;
    dateFromAsDate!:Date;
    dateUntilAsDate!:Date;
    interval: number = 7;
    dateFormat = new DateFormat();


    constructor(date: Date, interval: number, isFirst: boolean) {
        this.interval = interval;
        this.date = date;

        //počáteční datum
        this.dateFromAsDate = new Date(date);
        this.dateFrom = this.dateFormat.getLocaleDate(this.dateFromAsDate);

        //konečný datum
        this.dateUntilAsDate = new Date(date);
        this.dateUntilAsDate.setDate(date.getDate() + interval);
        this.dateUntilAsDate.setMilliseconds(this.dateUntilAsDate.getMilliseconds() - 1000);
        if (isFirst)
            this.dateUntil = this.dateFormat.getDate(new Date());
        else
            this.dateUntil = this.dateFormat.getLocaleDate(this.dateUntilAsDate);
    }
}