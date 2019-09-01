import * as moment from "moment";

export class Author {
    static fromObject(src) {
        var tmpObj: Author = Object.assign(new Author(), src);
        tmpObj.isChecked = false;
        return tmpObj;
    }
    public id: number;
    public name: string;
    public url: string;
    public isChecked: Boolean;
}
