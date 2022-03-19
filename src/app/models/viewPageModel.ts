/**
 * Společný model pro stránkování postů a autorů
 */

import { PagesModel } from "./pagesModel";

export class ViewPageModel {

    rowsPages = 100;

    actualViewPosts: PagesModel[] = [];

    actualViewAuthors: PagesModel[] = [];
}