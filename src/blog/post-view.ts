import {PostGateway} from "../models/post-gateway";
import {autoinject, bindable} from "aurelia-framework";
import {I18N} from 'aurelia-i18n';
import {Router} from "aurelia-router";
import {Post} from "../models/post-models";
import { Tag } from "../models/tag-models";

@autoinject()
export class PostView {
  constructor(postGateway: PostGateway, router: Router, i18n: I18N) {
    this.postGateway = postGateway;
    this.router = router;
    this.i18n = i18n;
  }
  private postGateway: PostGateway;
  private router: Router;
  private i18n: I18N;
  private post: Post;
  private activate(params, config) {
    var self = this;
    
    // return self.postGateway.getById(params.id).then(post => 
    //   {
    //     self.post = post;
    //     config.navModel.setTitle(post.title);
    //   });
    
    
    if (params && params.id)
      return loadThePost();

    async function loadThePost() {
      var post = await self.postGateway.getPost(params.id);
      self.post = post;
      config.navModel.setTitle(post.frenchTitle);
    }
  }
  private get currentLanguage() {
      return this.i18n.getLocale();
  }
  private filtered(tags: Tag[], currentLanguage) {
    return tags.filter(x => x.language==currentLanguage);
}
}
