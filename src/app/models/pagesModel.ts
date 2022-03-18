/**
 * Model stránkování
 */

export class PagesModel {

    actualView = 0;

    actualPages = 1;

    //totalPages = 1;

    totalItems = 0;

    rowsPages = 100;

    getTotalPages() {
        return Math.ceil(this.totalItems/this.rowsPages);
    }

}