import {autoinject} from "aurelia-framework";
import {Router} from "aurelia-router";
import {AuthorGateway} from "../gateways/author-gateway";
import {Author} from "../models/author-models";
import {Box} from "../dialogs/box";
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject()
export class AuthorList {
  private router: Router;
  private authorGateway: AuthorGateway;
  private box: Box;
  private eventAggregator: EventAggregator;
  private authors: Array<Author> = [];
  private zipFile: any;
  constructor(router: Router, authorGateway: AuthorGateway, box: Box, eventAggregator: EventAggregator) {
        this.router = router;
        this.authorGateway = authorGateway;
        this.box = box;
        this.eventAggregator = eventAggregator;
  }
  private activate() {
      return this.authorGateway.getAllAuthors()
      .then(authors => {
          this.authors.splice(0);
          this.authors.push.apply(this.authors, authors);
      });
  }
  private attached(){
  }
  private createNewAuthor() {
      this.router.navigateToRoute('authorEdit');
  }
  private deleteAuthor(author: Author) {
    var message = 'Voulez-vous vraiment supprimer l\'élément ?';
    var title = 'Suppression';
    var buttonYes = 'Oui';
    var buttonNo = 'Non';

    this.box.showQuestion(message, title, buttonYes, buttonNo).whenClosed(response => 
      {
        if (!response.wasCancelled && response.output == buttonYes) 
          performTheDelete(this); 
      });

      async function performTheDelete(self: AuthorList) {
        await self.authorGateway.deleteAuthor(author.id);
        var pos = self.authors.findIndex(x => x.id == author.id);
        self.authors.splice(pos, 1);
      }
  }
  private deleteSelectedAuthors() {
    var cptr = this.selectedAuthors.length;
    var message = `Voulez-vous vraiment supprimer ${ cptr==1 ? 'l\'élément' : 'les ' + cptr + ' éléments' } ?`;
    var title = 'Suppression';
    var buttonYes = 'Oui';
    var buttonNo = 'Non';

    this.box.showQuestion(message, title, buttonYes, buttonNo).whenClosed(response => 
      {
        if (!response.wasCancelled && response.output == buttonYes) 
        {
          this.authors.forEach(author => 
            {
              if (author.isChecked)
                performTheDelete(this, author);
            });
        }
      });

      async function performTheDelete(self: AuthorList, author: Author) {
        await self.authorGateway.deleteAuthor(author.id);
        var pos = self.authors.findIndex(x => x.id == author.id);
        self.authors.splice(pos, 1);
      }
  }
  private checkChange(value, groupKey, groupItems) {
      this.eventAggregator.publish('checkChange', { groupKey: groupKey, groupItems: groupItems});
  }
  private get selectedAuthors(){
    return this.authors.filter(post => post.isChecked == true);
  }
}
