/**
 * model nastavení aplikace
 */
export class SettingsModel {

    loadPosts = 50; //počet načítaných postů při jednom dotazu
    maxPosts = 10000; //maximální počet postů při kterém se ukončí načítání a zobrazí se výsledeky
    days = 28; //početnačtených dní do historie
    rows = 5;//počet řádků na stránku
    showPayout = true;
    showComment = true;
    showVote = true;
    node = "https://api.hive.blog";
    nodes = [
        "https://api.hive.blog",
        "https://api.openhive.network",
        "https://anyx.io",
        "https://hived.privex.io",
        "https://rpc.ausbit.dev",
        "https://techcoderx.com",
        "https://rpc.ecency.com",
        "https://hive.roelandp.nl",
        "https://hived.emre.sh",
        "https://api.deathwing.me",
        "https://api.c0ff33a.uk",
        "https://hive-api.arcange.eu",
        "https://api.pharesim.me"
    ]

}