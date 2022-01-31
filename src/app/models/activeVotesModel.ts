import { Input } from "@angular/core";
import { Price } from "@hiveio/dhive";
import { CurrentRevardFundModel } from "./currentRewardFundModel";

export class ActiveVotesModel {
    percent!: number;
    reputation!: number;
    rshares!: number;
    time!: string; //přepsat na datum
    voter!: string;
    dolars = "";

    price!: Price;
    currentRewardFunds!: CurrentRevardFundModel;

    constructor(percent: number, reputation: number, rshares: number, time: string, voter: string, price: Price, currentRevardFund: CurrentRevardFundModel) {
        this.percent = percent / 100;
        this.rshares = rshares;
        this.time = time;
        this.voter = voter;
        this.reputation = this.getReputation(reputation);
        this.price = price;
        this.currentRewardFunds = currentRevardFund;
        this.getPriceDolars();
    }


    /**
     * Vypočátá hodnotu reputace
     * @param  
     * @returns 
     */
    private getReputation(input: number) {
        if (input === 0) {
            return 25;
        }

        let reputation = Math.log10(Math.abs(input));
        reputation = Math.max(reputation - 9, 0);

        if (reputation < 0) reputation = 0;
        if (input < 0) reputation *= -1;

        reputation = reputation * 9 + 25;

        return Math.floor(reputation);
    }

    private getPriceDolars() {

        let recentClaims = this.currentRewardFunds.recent_claims;
        let rewardBalance = this.currentRewardFunds.reward_balance.replace("HIVE", "");
        let hbdMediaPrice = this.price.base.amount;

        let value = (this.rshares / recentClaims * rewardBalance * hbdMediaPrice).toFixed(3);
        //console.log(this.voter+":"+value);
        this.dolars = value + "$";
    }

}