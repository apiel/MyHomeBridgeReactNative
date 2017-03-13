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

  @observable configs: Config[] = [this.default];
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

  async init() {
      try {
          await this.initConfigs();
          await this.initActiveConfig();
      } catch (error) {
          console.log(error);
      }
  }

  async initConfigs() {
    const configs: string = await AsyncStorage.getItem(this.STORAGE_KEY_CONFIGS);
    if (configs) this.configs = JSON.parse(configs);
    this.setBackup();
  }

  setBackup() {
    this.backup = toJS(this.get());
  }

  async initActiveConfig() {
    this.activeKey = await AsyncStorage.getItem(this.STORAGE_KEY_ACTIVE);
  }

  async add() {
      this.configs.push(this.default);
  }

  isNotEmpty(): boolean {
    return this.configs.length > 0;
  }

  get(): Config {
    const activeConfig = this.configs[this.activeKey];
    return activeConfig;
  }

  async set(key: number) {
    this.activeKey = key;
    await AsyncStorage.setItem(this.STORAGE_KEY_ACTIVE, this.activeKey.toString());
  }

  restore() {
    this.configs[this.activeKey] = this.backup;
  }

  async save() {
    console.log('save config', this.configs, this.get().name);
    await AsyncStorage.setItem(this.STORAGE_KEY_CONFIGS, JSON.stringify(this.configs));
    this.setBackup();
  }
}