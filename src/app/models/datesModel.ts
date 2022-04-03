import { DateFormat } from "./dateFormat";
/**
 * Model obsahující počáteční a koncové datum
 */
export class DatesModel {
    date: Date | null = new Date();
    dateFrom!: string;
    dateUntil!: string;
    dateFromAsDate!:Date;//datum pro zobrazení v seznamu
    dateFromAsDateUTC!:Date;//datum pro třídění postů
    dateUntilAsDate!:Date;//datum pro zobrazení v seznamu
    dateUntilAsDateUTC!:Date;//datum pro třídění postů
    interval: number = 7;
    dateFormat = new DateFormat();


    constructor(date: Date, interval: number, isFirst: boolean) {
        this.interval = interval;
        this.date = date;

        //počáteční datum
        this.dateFromAsDate = new Date(date);
        this.dateFrom = this.dateFormat.getDate(this.dateFromAsDate);
        this.dateFromAsDateUTC = new Date(this.dateFromAsDate);
        this.dateFromAsDateUTC.setHours(this.dateFromAsDate.getUTCHours());
        this.dateFromAsDateUTC.setMinutes(this.dateFromAsDate.getUTCMinutes());

        //konečný datum
        this.dateUntilAsDate = new Date(date);
        this.dateUntilAsDate.setDate(date.getDate() + interval);
        this.dateUntilAsDate.setMilliseconds(this.dateUntilAsDate.getMilliseconds() - 1000);
        this.dateUntilAsDateUTC = new Date(this.dateUntilAsDate);
        this.dateUntilAsDateUTC.setHours(this.dateUntilAsDate.getUTCHours());
        this.dateUntilAsDateUTC.setMinutes(this.dateUntilAsDate.getUTCMinutes());

        if (isFirst)
            this.dateUntil = this.dateFormat.getDate(new Date());
        else
            this.dateUntil = this.dateFormat.getDate(this.dateUntilAsDate);
    }
}