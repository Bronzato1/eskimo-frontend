import {autoinject} from "aurelia-framework";
import {Router} from "aurelia-router";
import {CategoryGateway} from "../gateways/category-gateway";
import {Category} from "../models/category-models";
import {Box} from "../dialogs/box";
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject()
export class CategoryList {
  private router: Router;
  private categoryGateway: CategoryGateway;
  private box: Box;
  private eventAggregator: EventAggregator;
  private categories: Array<Category> = [];
  private zipFile: any;
  constructor(router: Router, categoryGateway: CategoryGateway, box: Box, eventAggregator: EventAggregator) {
        this.router = router;
        this.categoryGateway = categoryGateway;
        this.box = box;
        this.eventAggregator = eventAggregator;
  }
  private activate() {
      return this.categoryGateway.getAllCategories()
      .then(categories => {
          this.categories.splice(0);
          this.categories.push.apply(this.categories, categories);
      });
  }
  private attached(){
  }
  private createNewCategory() {
      this.router.navigateToRoute('categoryEdit');
  }
  private deleteCategory(category: Category) {
    var message = 'Voulez-vous vraiment supprimer l\'élément ?';
    var title = 'Suppression';
    var buttonYes = 'Oui';
    var buttonNo = 'Non';

    this.box.showQuestion(message, title, buttonYes, buttonNo).whenClosed(response => 
      {
        if (!response.wasCancelled && response.output == buttonYes) 
          performTheDelete(this); 
      });

      async function performTheDelete(self: CategoryList) {
        await self.categoryGateway.deleteCategory(category.id);
        var pos = self.categories.findIndex(x => x.id == category.id);
        self.categories.splice(pos, 1);
      }
  }
  private deleteSelectedCategories() {
    var cptr = this.selectedCategories.length;
    var message = `Voulez-vous vraiment supprimer ${ cptr==1 ? 'l\'élément' : 'les ' + cptr + ' éléments' } ?`;
    var title = 'Suppression';
    var buttonYes = 'Oui';
    var buttonNo = 'Non';

    this.box.showQuestion(message, title, buttonYes, buttonNo).whenClosed(response => 
      {
        if (!response.wasCancelled && response.output == buttonYes) 
        {
          this.categories.forEach(category => 
            {
              if (category.isChecked)
                performTheDelete(this, category);
            });
        }
      });

      async function performTheDelete(self: CategoryList, category: Category) {
        await self.categoryGateway.deleteCategory(category.id);
        var pos = self.categories.findIndex(x => x.id == category.id);
        self.categories.splice(pos, 1);
      }
  }
  private checkChange(value, groupKey, groupItems) {
      this.eventAggregator.publish('checkChange', { groupKey: groupKey, groupItems: groupItems});
  }
  private get selectedCategories(){
    return this.categories.filter(post => post.isChecked == true);
  }
}
