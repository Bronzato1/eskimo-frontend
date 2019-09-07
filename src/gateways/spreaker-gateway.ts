import { HttpClient } from 'aurelia-fetch-client';
import { autoinject } from "aurelia-framework";
import environment from 'environment';

@autoinject()
export class SpreakerGateway {
    private httpClient: HttpClient;
    constructor() {
        this.httpClient = new HttpClient();
    }
    public searchEpisodes(searchCriteria: string): Promise<any> {
        return this.httpClient.fetch(`${environment.spreakerUrl}search?type=episodes&q=${searchCriteria}`)
            .then(response => response.json())
            .then(data => data.response)
            .catch(error => console.log(error));
    }
    public loadNextEpisodes(nextUrl) {
        return this.httpClient.fetch(nextUrl)
            .then(response => response.json())
            .then(data => data.response)
            .catch(error => console.log(error));
    }
    public searchUser(id: number): Promise<any> {
        return this.httpClient.fetch(`${environment.spreakerUrl}users/${id}`)
            .then(response => response.json())
            .then(data => data.response.user)
            .catch(error => console.log(error));
    }
}
