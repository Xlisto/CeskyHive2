export class AuthorSortModel {
    author = "";
    posts = 0;
    comments = 0;
    votes = 0;
    negativeVotes = 0;
    pendingPayoutValue = 0;
    totalPayoutValue = 0;

    constructor(author: string, comments: number, votes: number, negativeVotes: number, pending: string, payout: string) {
        this.author = author;
        this.posts = 1;
        this.comments = comments;
        this.votes = votes;
        this.negativeVotes = negativeVotes;
        this.pendingPayoutValue = this.convertHBD(pending);
        this.totalPayoutValue = this.convertHBD(payout);
    }

    add(comments: number, votes: number, negativeVotes: number, pending: string, payout: string) {
        this.posts += 1;
        this.comments += comments;
        this.votes += votes;
        this.negativeVotes += negativeVotes;
        this.pendingPayoutValue += this.convertHBD(pending);
        this.totalPayoutValue += this.convertHBD(payout);
    }

    private convertHBD(s: String) {
        return Number(s.toString().replace("HBD", ""));
    }
}