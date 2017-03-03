/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
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
         Drawer } from 'native-base'; 

import SegmentedButton from 'react-native-segmented-button';

import type { Item } from './store/items';
import ItemsStore from './store/items';

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

  _drawer: any;

  constructor() {
      super();
      this.itemsStore = new ItemsStore;
    //   this.itemsStore.topicDefinitions = 'definitions';
    //   this.itemsStore.host = '192.168.0.13';
    //   this.itemsStore.port = 3030;
  }

  renderItems() {
    return this.itemsStore.items.map(item => this.renderCardAction(item));
  }

  renderCardAction(item: Item) {
    return (
        <Card>
            <CardItem header>
                <Text>{item.name}</Text>
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
                    <Text>Yo: {item.status}</Text>
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
            type="overlay"
            ref={(ref) => { this._drawer = ref; }}
            content={<Text>YoYo</Text>}
        >
            <Container>
                <Header>
                    <Left>
                        <Button onPress={() => this._drawer._root.open()} transparent>
                            <Icon name='menu' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Header</Title>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Icon name='settings' />
                        </Button>
                    </Right>
                </Header>              
                <Content>  
                  { this.renderItems() }
                </Content>
            </Container>
        </Drawer>            
    );
  }
}

AppRegistry.registerComponent('MyHomeBridge', () => MyHomeBridge);