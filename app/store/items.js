// @flow

import { observable } from 'mobx'
import MqttService from '../lib/mqtt.service';

export type Item = {
  name: string; 
  key: string;
  status?: string|number; 
  values?: string[]; 
  number?: { min: number, max: number };
}

type MqttConfig = {
    host: string,
    port: number,
    topicDefinitions: string
}

export default class {
  mqttService: MqttService = new MqttService;
  
  @observable items: Item[] = [];

  _config: MqttConfig = {
    host: '',
    port: 0,
    topicDefinitions: ''
  }

  setter(key: string, newValue: string|number, callback: Function) {
    if (this._config[key] !== newValue) {
        this._config[key] = newValue;
        if ((this.topicDefinitions && this.mqttService.isConnected())
         || (this.host && this.port)) {
            callback();
        }
    }      
  }

  set topicDefinitions(topicDefinitions: string) {
      this.setter('topicDefinitions', topicDefinitions, () => this._loadItems());
  }

  get topicDefinitions(): string {
      return this._config['topicDefinitions'];
  }

  set host(host: string) {
      this.setter('host', host, () => this._init());
  }

  get host(): string {
      return this._config['host'];
  }   

  set port(port: number) {
      this.setter('port', port, () => this._init());
  }

  get port(): number {
      return this._config['port'];
  }      

  _init() {
      console.log('init connection');
      this.mqttService.init(this.host, this.port, () => this._loadItems() );
  }

  _loadItems() {
      console.log('loadItems after connect', this);
      this.mqttService.subscribe(this.topicDefinitions, msg => {
        this.items = JSON.parse(msg).map(item => { item.status = ''; return item; });
        this._loadConsumers();
      });
  }  

  _loadConsumers() {
    for(let item of this.items) {
       this.mqttService.subscribe(item.key, msg => item.status = msg);        
    }
  }    
}