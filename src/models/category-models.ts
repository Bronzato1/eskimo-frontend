import * as moment from "moment";

export class Category {
    static fromObject(src) {
        var tmpObj: Category = Object.assign(new Category(), src);
        tmpObj.isChecked = false;
        return tmpObj;
    }
    public id: number;
    public frenchName: string;
    public englishName: string;
    public color: string;
    public image: string;
    public isChecked: Boolean;
}
