import { PostGateway } from "./blog-gateway";
import { inject, bindable } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Post } from "./blog-models";

@inject(PostGateway, Router)
export class PostView {
  constructor(postGateway: PostGateway, router: Router) {
    this.postGateway = postGateway;
    this.router = router;
  }
  private postGateway: PostGateway;
  private router: Router;
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
      var post = await self.postGateway.getById(params.id);
      self.post = post;
      config.navModel.setTitle(post.title);
    }
  }
}
