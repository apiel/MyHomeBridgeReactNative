// @flow
import { observer } from 'mobx-react/native';
import React, { Component } from 'react';
import { View } from 'react-native';

import { Content, Text, List, ListItem,
         H1, Title, Button, Icon, Right  } from 'native-base'; 

import ConfigsStore from './store/configs';         
import type { Config } from './store/configs'; 

@observer export default class extends Component {
  configsStore: ConfigsStore;

  render() {
    this.configsStore = this.props.configsStore;
    return (
        <Content style={{backgroundColor: '#DDDDDD', opacity:0.9, padding: 10, flex: 1}}>  
            <H1>MyHomeBridge</H1>                 
            {this.configsStore.configs.map((config: Config, key: number) =>
                <ListItem key={key} onPress={() => this.props.onPressItem(key) }>
                    <Text>{config.name}</Text>
                </ListItem> 
            )}           

            <Button onPress={() => this.configsStore.add() } transparent>
                <Icon name='add' />
            </Button>            
        </Content>
    );
  }
}