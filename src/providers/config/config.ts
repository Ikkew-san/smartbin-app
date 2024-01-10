import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { API_URL } from "../api-url";

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigProvider {
  constructor(public http: HttpClient) {}

  findUser(id) {
    return this.http.get(`${API_URL}/findUser/${id}`);
  }

  latestRewards() {
    return this.http.get(`${API_URL}/latestRewards`);
  }

  getRewards() {
    return this.http.get(`${API_URL}/getRewardsApp`);
  }

  // calculatePoints(params) {
  //   return this.http.post(`${API_URL}/calculatePoints`, params);
  // }

  exchangeRewards(id, params) {
    return this.http.post(`${API_URL}/exchangeRewards/${id}`, params);
  }

  getExchange_All(id) {
    return this.http.get(`${API_URL}/getExchangeUser/${id}`);
  }

  getExchange_Status(id, param) {
    return this.http.post(`${API_URL}/getExchangeUser_Status/${id}`, param);
  }

  checkRewards(id) {
    return this.http.get(`${API_URL}/checkRewards/${id}`);
  }

  inBasket(params) {
    return this.http.post(`${API_URL}/inBasket`, params);
  }

  qrLogged(id, params){
    return this.http.post(`${API_URL}/qrLogged/${id}`, params);
  }

  onPoints(id) {
    return this.http.get(`${API_URL}/onPoints/${id}`);
  }

  getAmountBottle(id){
    return this.http.get(`${API_URL}/getAmountBottle/` + id);
  }

  logoutSmartbin(params){
    return this.http.post(`${API_URL}/logoutSmartbin`, params);
  }

  pointsHistory(id) {
    return this.http.get(`${API_URL}/pointsHistory/${id}`);
  }

  editProfile(id, params) {
    return this.http.post(`${API_URL}/editProfile/${id}`, params);
  }
  
  editImageProfile(id, param) {
    return this.http.post(`${API_URL}/editImageProfile/${id}`, param);
  }

  closeAccount(id, param) {
    return this.http.put(`${API_URL}/putUserstatus/${id}`, param);
  }
}
