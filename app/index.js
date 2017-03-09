/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import { observable, toJS } from 'mobx'
import { observer } from 'mobx-react/native';
import React, { Component } from 'react';
import {
  StyleSheet,
  AppRegistry,
  View,
  Slider
} from 'react-native';

import { Container, Header, Content, 
         Text, Title, Button, Left, Segment,
         Right, Body, Icon, Card, CardItem,
         Drawer, Badge } from 'native-base'; 

import SegmentedButton from 'react-native-segmented-button';

import DrawerConfig from './config';
import DrawerMenu from './menu';

import type { Item } from './store/items';
import ItemsStore from './store/items';

import type { Config } from './store/configs';
import ConfigStore from './store/configs';

@observer export default class MyHomeBridge extends Component {
  itemsStore: ItemsStore;
  configStore: ConfigStore;

  styles = StyleSheet.create({
    container: {
      flex: 1,
      marginLeft: 10,
      marginRight: 10,
      alignItems: 'stretch',
      justifyContent: 'center',
    },
  });

  _drawerMenu: any;
  _drawerConfig: any;

  constructor() {
      super();
      this.itemsStore = new ItemsStore;  
      this.configStore = new ConfigStore;  
      this.init();
  }

  async init() {
      await this.configStore.init();
      // this.loadConfig();
  }

  onCloseDrawerConfig() {
      this.configStore.restore();
  }

  saveConfig() {
      this._drawerConfig._root.close();
      this.configStore.save();
      this.loadConfig();
  }

  loadConfig() {
    const config: Config = this.configStore.get();
    this.itemsStore.topicDefinitions = config.topicDefinitions;
    this.itemsStore.host = config.host;
    this.itemsStore.port = config.port;      
  }

  renderItems() {
    return this.itemsStore.items.map(item => this.renderCardAction(item));
  }

  renderCardAction(item: Item) {
    return (
        <Card>
            <CardItem header>
                <Text>{item.name}</Text>
                { (item.values || item.number) && <Right>
                    <Badge info>
                        <Text>{item.status}</Text>
                    </Badge>
                </Right> }
            </CardItem>

            <CardItem>
                { !item.number && !item.values && 
                <Body>
                    <Button block>
                        <Text>DO</Text>
                    </Button>                    
                </Body> }
                { item.number && 
                <View style={this.styles.container}>
                    <Slider />
                </View> }
                { item.values && 
                <View style={this.styles.container}>                    
                    <SegmentedButton
                          activeIndex={item.values.indexOf(item.status)}
                          items={item.values}
                          onSegmentBtnPress={(btn,index)=>{}}
                      />
                </View> }                             
            </CardItem>
        </Card>      
    );
  } 

  render() {
    return (
        <Drawer
            ref={(ref) => { this._drawerMenu = ref; }}
            content={ <DrawerMenu /> }
        >
          { this.configStore.isNotEmpty() && <Drawer
              ref={(ref) => { this._drawerConfig = ref; }}
              side="right"
              onClose={ () => this.onCloseDrawerConfig() }
              content={ <DrawerConfig configStore={ this.configStore }
                                      onSave={ () => this.saveConfig() } /> }
          >
            <Container>
                <Header>
                    <Left>
                        <Button onPress={() => this._drawerMenu._root.open()} transparent>
                            <Icon name='menu' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Header</Title>
                    </Body>
                    <Right>
                        <Button onPress={() => this._drawerConfig._root.open()} transparent>
                            <Icon name='settings' />
                        </Button>
                    </Right>
                </Header>              
                <Content>  
                  { this.renderItems() }
                </Content>
            </Container>
          </Drawer>}
        </Drawer>           
    );
  }
}

AppRegistry.registerComponent('MyHomeBridge', () => MyHomeBridge);