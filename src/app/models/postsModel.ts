import { Discussion, DynamicGlobalProperties, Price } from "@hiveio/dhive";
import { AuthorSortModel } from "./authorSortModel";
import { CurrentRevardFundModel } from "./currentRewardFundModel";
import { DatesModel } from "./datesModel";
import { TotalsCountModel } from "./totalsCountModel";

/**
 * Model obsahující rozčleněný seznam diskusí (postů)
 */
export class PostsModel {
    dates: DatesModel[] = [];//datumové intervaly
    posts: Discussion[] = [];//načtené posty
    postsSorted: [Discussion[]] | any = [[]]; //načtené posty, rozdělené podle datumu a setříděné
    postsAuthor: [AuthorSortModel[]] = [[]];
    totalCount: TotalsCountModel[] = [];
    dynamicGlobalProperties!: DynamicGlobalProperties;
    price!: Price;
    rewardFund!: CurrentRevardFundModel;


    /**
     * Vrátí počet negativních hlasů na postu
     * @param post 
     * @returns 
     */
    public negativeVotes(post: Discussion) {
        let countNegativeVote = 0;
        for (let vote of post.active_votes) {
            if (vote.rshares < 0) countNegativeVote++;
        }
        return countNegativeVote;
    }

    /**
     * Sestaví statistiku
     */
    public counts() {

        for (let postAuthor of this.postsAuthor) {
            let posts = 0;
            let authors = 0;
            let pendings = 0;
            let payouts = 0;
            let votes = 0;
            let negativeVotes = 0;
            let comments = 0;
            for (let authors of postAuthor) {
                posts += authors.posts;
                pendings += authors.pendingPayoutValue;
                payouts += authors.totalPayoutValue;
                votes += authors.votes;
                negativeVotes += authors.negativeVotes;
                comments += authors.comments;
            }
            authors = postAuthor.length;
            this.totalCount.push(new TotalsCountModel(posts,authors,pendings,payouts,votes,negativeVotes,comments));
            
            console.log(pendings);
        }
    }

}