// @flow

import { observable, toJS } from 'mobx';

import { AsyncStorage } from 'react-native';

export type Config = { 
    name: string, 
    topicDefinitions: string, 
    host: string, 
    port: number 
};

export default class {  
  STORAGE_KEY_CONFIGS: string = '@MyHomeBridge:configs';
  STORAGE_KEY_ACTIVE: string = '@MyHomeBridge:activeConfig';

  @observable configs: Config[] = [];
  @observable activeKey: number = 0;

  backup: Config;

  default: Config = {
    name: 'New bridge',
    topicDefinitions: 'definitions',
    // host: '127.0.0.1',
    // port: 1883
    host: '192.168.0.13',
    port: 3030
  }  

//   constructor() {
//     this.init();
//   }

  async init() {
      try {
          const configs: string = await AsyncStorage.getItem(this.STORAGE_KEY_CONFIGS);
          if (configs) this.configs = JSON.parse(configs);
          else await this.add();
          this.backup = toJS(this.get());
          console.log('AsyncStorage get item', this.configs);
      } catch (error) {
          console.log(error);
      }
  }

  async add() {
      this.configs.push(this.default);
  }

  get(): Config | null {
      return this.configs.length ? this.configs[this.activeKey] : null;
  }

  async set(key: number) {
    this.activeKey = key;
    await AsyncStorage.setItem(this.STORAGE_KEY_ACTIVE, this.activeKey.toString());
  }

  restore() {
    this.configs[this.activeKey] = this.backup;
  }

  async save() {
    await AsyncStorage.setItem(this.STORAGE_KEY_CONFIGS, JSON.stringify(this.configs));
  }
}