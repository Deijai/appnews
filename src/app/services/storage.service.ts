/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Article } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;
  private _localArticles: Article[] = [];

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
    this.loadFavorites();
  }
  get getLocalArticles(){
    return [...this._localArticles];
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  async saveAndRemoveArticle(article: Article){
    const existing = this._localArticles.find(item => item.title === article.title );

    if(existing){
      this._localArticles = this._localArticles.filter(item => item.title !== article.title);
    } else {
      this._localArticles = [article, ...this._localArticles];
    }
      this._storage.set('articles', this._localArticles);
  }

  async loadFavorites(){
    try {
        const articles = await this._storage.get('articles');
        this._localArticles = articles || [];
    } catch (error) {
      //this._localArticles = [];
    }
  }

  public articleInFovorites( article: Article){
    return !!this._localArticles.find(item => item.title === article.title );
  }
}
