import { Component, Input, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';

import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
  @Input() article: Article;
  @Input() index: number;
  constructor(
    private iaBrowser: InAppBrowser,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing,
    private storageService: StorageService
  ) {}

  ngOnInit() {}

  public async onOpenActionSheet() {
    const articleInFovorite = this.storageService.articleInFovorites(this.article);
    const nomalBtns: ActionSheetButton[] = [
      {
        text: articleInFovorite ? 'Remover Favorito' : 'Favorito',
        icon: articleInFovorite ? 'heart' : 'heart-outline',
        handler: () => this.onToggleFavorite(this.article),
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        cssClass: 'secondary',
        role: 'cancel',
      }
    ];

    const shareBtn: ActionSheetButton = {
      text: 'Compartilhar',
      icon: 'share-outline',
      handler: () => this.onShareArticle(),
    };

    if(this.platform.is('capacitor')){
        nomalBtns.unshift(shareBtn);
    }


    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opções',
      cssClass: '',
      buttons: nomalBtns,
   });

     await actionSheet.present();

  }

  public openArticle() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      const browser = this.iaBrowser.create(this.article.url);
      browser.show();
      return;
    }

    window.open(this.article.url, '_blank');
  }

  private onShareArticle() {
    const {title, source, url} = this.article;

    this.socialSharing.share(
      title,
      source.name,
      null,
      url
    );
  }

  private onToggleFavorite(article: Article){
    this.storageService.saveAndRemoveArticle(article);
      console.log(article);
  }
}
