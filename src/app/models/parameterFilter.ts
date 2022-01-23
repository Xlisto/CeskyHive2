/**
 * Model filtru parametru vyhledávání a třídění
 */
export class ParameterFilter {
    tag = "cesky";
    time = "12:00";
    interval = "tyden";
    day = "4";
    dayCount = 1;

    getInterval(): number {
        if (this.interval === "tyden")
            return 7;
        else
            return this.dayCount;
    }

}