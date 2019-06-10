import * as moment from "moment";

export class Post {

    public id: number;
    public title: string;
    public content: string;
    public creation: Date;
    public isChecked: Boolean;
    public tags: Array<Tag>;
    public tagNames: string[];

    static fromObject(src) {
        var tmpObj: Post = Object.assign(new Post(), src);
        tmpObj.creation = moment.utc(src.creation).toDate();
        tmpObj.isChecked = false;
        tmpObj.tagNames = tmpObj.tags && tmpObj.tags.map(x => x.name);
        return tmpObj;
    }
 
    get firstLetter() {
      const name = this.title;
      return name ? name[0].toUpperCase() : '?';
    }

    get monthYear() 
    {
      var months = [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ];
      var month_index = this.creation.getMonth();
      return months[month_index] + ' ' + moment(this.creation).year();
    }

    get yearMonth(){
      return moment(this.creation).format('YYYY-MM');
    }

    get yearMonthDay(){
      return moment(this.creation).format('YYYY-MM-DD');
    }
}

export class Tag {
  public id: number;
  public name: string;
}
