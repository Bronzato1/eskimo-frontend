import * as moment from "moment";
import {Tag} from './tag-models';

export class Post {

    public id: number;
    public image: string;
    public frenchTitle: string;
    public englishTitle: string;
    public frenchContent: string;
    public englishContent: string;
    public creation: Date;
    public readingTime: number;
    public favorite: boolean;
    public media: number;
    public youtubeVideoId: string;
    public isChecked: Boolean;
    public categoryId: number;
    public tags: Array<Tag>;
    public tagNamesForFrench: string[] = [];
    public tagNamesForEnglish: string[] = [];

    static fromObject(src) {
        var tmpObj: Post = Object.assign(new Post(), src);
        tmpObj.creation = moment.utc(src.creation).toDate();
        tmpObj.isChecked = false;
        tmpObj.tagNamesForFrench = src.tags && src.tags.filter((x: Tag) => x.language == 'fr').map((x: Tag) => x.name) || [];
        tmpObj.tagNamesForEnglish = src.tags && src.tags.filter((x: Tag) => x.language == 'en').map((x: Tag) => x.name) || [];
        return tmpObj;
    }

    get firstLetter() {
        const name = this.frenchTitle;
        return name ? name[0].toUpperCase() : '?';
    }

    get monthYear() {
        var months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
        var month_index = this.creation.getMonth();
        return months[month_index] + ' ' + moment(this.creation).year();
    }

    get yearMonth() {
        return moment(this.creation).format('YYYY-MM');
    }

    get yearMonthDay() {
        return moment(this.creation).format('YYYY-MM-DD');
    }
}
