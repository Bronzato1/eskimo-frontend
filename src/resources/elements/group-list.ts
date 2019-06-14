import { autoinject, customElement, bindable, bindingMode } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';

@autoinject()
@customElement('group-list')
export class GroupList {
  constructor(eventAggregator: EventAggregator, i18n: I18N) {
    this.eventAggregator = eventAggregator;
    this.i18n = i18n;
  }
  @bindable items: any[];
  @bindable groupBy;
  @bindable orderBy;
  @bindable label;
  private i18n: I18N;
  private eventAggregator: EventAggregator;
  private checkedGroupKeys = [];
  private subscriber;
  private attached() {
    var self = this;
    this.subscriber = this.eventAggregator.subscribe('checkChange', response => {
      var groupKey = response.groupKey;
      var groupItems = response.groupItems;
      var cptrCheckedItemsInGroup: number = groupItems.filter(x => x.isChecked).length;
      var cptrTotalItemsInGroup: number = groupItems.length;
      var pos = self.checkedGroupKeys.indexOf(groupKey);

      if (cptrCheckedItemsInGroup == cptrTotalItemsInGroup) 
      {
        if (pos == -1) self.checkedGroupKeys.push(groupKey); 
      }
      else 
      {
        if (pos > -1) self.checkedGroupKeys.splice(pos, 1);
      }
    });
  }
  private detached() {
    this.subscriber.dispose();
  }
  private checkAllChanged(group, value) {
    var groupItems = group.items;
    groupItems.forEach(element => {
      element.isChecked = value;
    });
  }
  private get currentLanguage() {
      return this.i18n.getLocale();
  }
}
