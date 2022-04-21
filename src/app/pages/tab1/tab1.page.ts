import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Article } from 'src/app/interfaces';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

  public articles: Article[] = [];
  public selectedCategory = 'business';

  constructor(private newsService: NewsService) {}
  ngOnInit(): void {
    this.newsService.getTopHeadlines().subscribe(
      articles => {
        this.articles.push(...articles);
      }
    );
  }

  public loadData(){
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory, true).subscribe(
      articles => {
       if( articles.length === this.articles.length ){
        this.infiniteScroll.disabled = true;
         return;
       }

       this.articles = articles;
       setTimeout(() => {
        this.infiniteScroll.complete();
       }, 1000 );
      }
    );
}

}
