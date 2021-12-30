/**
 * Model celkového počtu 
 */
export class TotalsCountModel {
    totalPosts = 0;
    totalAuthors = 0;
    totalPending = 0;
    totalPayouts = 0;
    totalVotes = 0;
    totalNegativeVotes = 0;
    totalComments = 0;

    constructor(totalPosts:number, totalAuthors: number, totalPending:number, totalPayout:number, totalVotes:number,totalNegativeVotes:number, totalComments:number ) {
        this.totalPosts = totalPosts;
        this.totalAuthors = totalAuthors;
        this.totalPending = totalPending;
        this.totalPayouts = totalPayout;
        this.totalVotes = totalVotes;
        this.totalNegativeVotes = totalNegativeVotes;
        this.totalComments = totalComments;
    }
}