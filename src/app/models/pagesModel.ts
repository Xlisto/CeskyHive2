/**
 * Model stránkování
 */

export class PagesModel {

    actualViewPost = 0;

    actualPages = 1;

    //totalPages = 1;

    totalPosts = 0;

    rowsPages = 100;

    getTotalPages() {
        return Math.ceil(this.totalPosts/this.rowsPages);
    }

}