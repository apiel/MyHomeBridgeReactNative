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

type Config = { name: string, topicDefinitions: string, host: string, port: number };

@observer export default class MyHomeBridge extends Component {
  itemsStore: ItemsStore;

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

  @observable _config: Config = {
      name: 'Garage',
      topicDefinitions: 'definitions',
      host: '192.168.0.13',
      port: 3030
  };

  _configBackup: Config;

  constructor() {
      super();
      this.itemsStore = new ItemsStore;    
      this._configBackup = toJS(this._config); // to remove when loadConfig is uncommented
      // this.loadConfig();
  }

  restoreConfig() {
      this._config = this._configBackup;
  }

  saveConfig() {
      this._drawerConfig._root.close();
      this.loadConfig();
  }

  loadConfig() {
      this._configBackup = toJS(this._config);
      this.itemsStore.topicDefinitions = this._config.topicDefinitions;
      this.itemsStore.host = this._config.host;
      this.itemsStore.port = this._config.port;      
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
          <Drawer
              ref={(ref) => { this._drawerConfig = ref; }}
              side="right"
              content={ <DrawerConfig config={ this._config } 
                                      onSave={ () => this.saveConfig() } 
                                      onCancel={ () => this.restoreConfig() } /> }
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
          </Drawer>  
        </Drawer>            
    );
  }
}

AppRegistry.registerComponent('MyHomeBridge', () => MyHomeBridge);