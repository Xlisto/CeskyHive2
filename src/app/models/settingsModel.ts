/**
 * model nastavení aplikace
 */
export class SettingsModel {

    loadPosts = 20; //počet načítaných postů při jednom dotazu
    maxPosts = 10000; //maximální počet postů při kterém se ukončí načítání a zobrazí se výsledeky
    days = 28; //početnačtených dní do historie
    rows = 5;//počet řádků na stránku
    showPayout = true;
    showComment = true;
    showVote = true;
    nodes = [
        "https://api.hive.blog",
        "https://api.openhive.network",
        "https://anyx.io",
        "https://rpc.ausbit.dev",
        "https://rpc.mahdiyari.info",
        "https://api.hive.blue",
        "https://techcoderx.com",
        "https://hive.roelandp.nl",
        "https://hived.emre.sh",
        "https://api.deathwing.me",
        "https://api.c0ff33a.uk",
        "https://hive-api.arcange.eu",
        "https://hive-api.3speak.tv",
        "https://hiveapi.actifit.io",
    ];
    node = this.nodes[0];
    hiveSites = [
        "https://hive.blog",
        "https://peakd.com",
        "https://ecency.com",
        "https://leofinance.io",
        "https://d.buzz"
    ];
    hiveSite = this.hiveSites[0];
}