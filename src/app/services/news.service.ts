import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Article, ArticleByCategoryAndPage, NewsResponse } from '../interfaces';

const apiKey = environment.apiKey;
const apiUrl = `https://newsapi.org/v2`;

@Injectable({
  providedIn: 'root'
})
export class NewsService {


  private articleByCategoryAndPage: ArticleByCategoryAndPage = {};

  constructor(private http: HttpClient) { }


  public getTopHeadlines(): Observable<Article[]> {
    return this.getTopHeadlinesByCategory('business');
  }

  public getTopHeadlinesByCategory( category: string, loadMore: boolean = false ) : Observable<Article[]> {

    if(loadMore) {
      return this.getArticlesByCategory(category);
    }

    if( this.articleByCategoryAndPage[category] ) {
      return of(this.articleByCategoryAndPage[category].articles);
    }

    return this.getArticlesByCategory(category);

  }

  private executeQuery<T>(endpoint: string) {
    return this.http.get<T>(`${ apiUrl }${ endpoint }`, {
      params: {apiKey,
      country: 'us'
      }
    });
  }

  private getArticlesByCategory(category: string): Observable<Article[]> {

    if( Object.keys( this.articleByCategoryAndPage ).includes(category) ) {
        //this.articleByCategoryAndPage[category].page += 0;
    } else {
      this.articleByCategoryAndPage[category] = {
        page: 0,
        articles: []
      };
    }

    const page = this.articleByCategoryAndPage[category].page + 1;
    return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}&page=${page}&apiKey=${apiKey}`).pipe(
      map( ( { articles } ) => {

        if(articles.length === 0) {return this.articleByCategoryAndPage[category].articles;}

        this.articleByCategoryAndPage[category] = {
          page,
          articles: [... this.articleByCategoryAndPage[category].articles, ... articles],
        };

        return this.articleByCategoryAndPage[category].articles;
      })
    );

  }

}
