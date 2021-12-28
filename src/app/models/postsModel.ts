import { Discussion, DynamicGlobalProperties, Price } from "@hiveio/dhive";
import { AuthorSortModel } from "./authorSortModel";
import { CurrentRevardFundModel } from "./currentRewardFundModel";
import { DatesModel } from "./datesModel";

/**
 * Model obsahující rozčleněný seznam diskusí (postů)
 */
export class PostsModel {
    dates: DatesModel[] = [];//datumové intervaly
    posts: Discussion[] = [];//načtené posty
    postsSorted: [Discussion[]] | any = [[]]; //načtené posty, rozdělené podle datumu a setříděné
    postsAuthor: [AuthorSortModel[]] = [[]];
    dynamicGlobalProperties!: DynamicGlobalProperties;
    price!: Price;
    rewardFund!:CurrentRevardFundModel;
}