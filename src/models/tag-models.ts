import * as moment from "moment";

export class Tag {
    static fromObject(src) {
        var tmpObj: Tag = Object.assign(new Tag(), src);
        return tmpObj;
    }
    public id: number;
    public language: string;
    public name: string;
    public postItemId: number;
}
