// @flow

import { observable } from 'mobx';

import { AsyncStorage } from 'react-native';

export type Config = { 
    name: string, 
    topicDefinitions: string, 
    host: string, 
    port: number 
};

export default class {  
  STORAGE_KEY: string = '@MyHomeBridge:configs';

  @observable configs: Config[] = [];

  constructor() {
    this.init();
  }

  async init() {
      try {
          const configs: string = await AsyncStorage.getItem(this.STORAGE_KEY);
          if (configs) this.configs =  JSON.parse(configs);
          else await this.add();
          console.log('AsyncStorage get item', this.configs);
      } catch (error) {
          console.log(error);
      }
  }

  async add() {
      const config: Config = {
          name: 'New bridge',
          topicDefinitions: 'definitions',
          host: '127.0.0.1',
          port: 1883
      };
      this.configs.push(config);
      // await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.configs));
  }
}