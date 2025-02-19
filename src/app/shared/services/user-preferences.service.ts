import {Injectable, signal} from '@angular/core';
import {pushIfNotIndluded, removeItemFromArray} from '../helpers/arrays.helpers';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {

  private _expandedCategories = signal<string[]>([]);

  get expandedCategories() {
    return this._expandedCategories.asReadonly();
  }

  addExpandedCategory(category: string) {
    this._expandedCategories.set(pushIfNotIndluded(this._expandedCategories(), category));
  }

  removedExpandedCategory(category: string) {
    this._expandedCategories.set(removeItemFromArray(this._expandedCategories(), category));
  }

}
