import { bindable,bindingMode,computedFrom } from 'aurelia-framework';

export class TagsInput {

  @bindable tags;
  @bindable onAdded;
  @bindable onDeleted;
  @bindable onChanged;

  constructor() {
    this.tags = [];
    this.onClick = this.onClick.bind(this);
    this.onTagClick = this.onTagClick.bind(this);
    this.onTagBlur = this.onTagBlur.bind(this);
    this.onTagKey = this.onTagKey.bind(this);
  }

  tagsChanged(value) {
    if (value instanceof Array) {
      this.tags = value.map(value => { return { value } });
      this.addNewTag();
    }
  }
  
  onClick() {
    if(!this.tags.length) {
      this.tags[this.tags.length-1].focus = true;
    }

  }

  addNewTag(tag?) {
    if (!this.tags.find(x => x.editing)) {
      this.addTag('',true,true);
      if (tag && typeof this.onAdded === 'function') {
        this.onAdded({ tagName: tag.value });
      }
    }
  }

  addTag(value, editing = false, focus = false) {
    this.tags.push({
      value,
      editing,
      focus,
    });
  }

  removeTag(tag) {
    let idx = this.tags.indexOf(tag);
    if (idx > -1) {
      this.tags.splice(idx,1);
      this.onDeleted({ tagName: tag.value });
    }
  }

  editTag(tag, edit) {
    if (edit == false && tag.value !== '')
      if (this.tags.find(x => x.editing))
        this.onChanged({ tagOldName: tag.oldValue, tagNewName: tag.value });

      tag.editing = edit;
      tag.oldValue = tag.value;
  }

  onTagClick(tag, action) {
    if (action === 'delete') {
      this.removeTag(tag);
      return;
    }

    this.editTag(tag, true);
  }

  onTagBlur(tag, e) {
    let emptyTag = (!tag.value || !tag.value.length);
    let lastTag = (this.tags.indexOf(tag) === this.tags.length - 1);

    if (!emptyTag && lastTag) {
        tag.editing = false;
        this.addNewTag(tag); 
    }

    if (!emptyTag && !lastTag) {
      this.editTag(tag,false);
    }

    if (!lastTag && emptyTag) {
      this.removeTag(tag);
    }
  }

  onTagKey(tag, e) {
    let emptyTag = (!tag.value || !tag.value.length);
    let lastTag = (this.tags.indexOf(tag) === this.tags.length - 1);
    let key = e.which || e.keyCode;

    if (key === 13) {
      if (!emptyTag && lastTag) {
        tag.editing = false;
        this.addNewTag(tag); 
        return false;
      }
      if (!emptyTag && !lastTag) {
        this.editTag(tag,false);
        // NOTE: Blur active element to trigger a blur on Enter key press
        if (document && document.activeElement) (<any>document.activeElement).blur()
        return false;
      }
    }

    return true;
  }
}
