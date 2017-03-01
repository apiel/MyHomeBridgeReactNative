/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  AppRegistry,
  View,
  Slider
} from 'react-native';

import { Container, Header, Content, 
         Text, Title, Button, Left, Segment,
         Right, Body, Icon, Card, CardItem } from 'native-base'; 

import SegmentedButton from 'react-native-segmented-button';

import MqttService from './lib/mqtt.service';

type Item = {
  name: string; 
  key: string;
  status?: string|number; 
  values?: string[]; 
  number?: { min: number, max: number };
}

export default class MyHomeBridge extends Component {
  mqttService: MqttService = new MqttService;

  state: any = { items: [] };

  styles = StyleSheet.create({
    container: {
      flex: 1,
      marginLeft: 10,
      marginRight: 10,
      alignItems: 'stretch',
      justifyContent: 'center',
    },
  });

  constructor() {
      super();
      this.mqttService.init(() => this._loadItems() );
  }

  _loadItems() {
      console.log('loadItems after connect', this);
    // if (this.settings.topicDefinition) {
      // this.mqttService.subscribe(this.settings.topicDefinition, msg => {
      this.mqttService.subscribe('definitions', msg => {
        console.log('subscribe definitions', msg);
        const items: Item[] = JSON.parse(msg);
        this.setState({ items: items }); // , () => this._loadConsumers()
        // this._loadConsumers();
      });
    // }
  }  

  _loadConsumers() {
    for(let i in this.state.items) {
      const item: Item = this.state.items[i];
      this.mqttService.subscribe(item.key, msg => {
          console.log('setStatus', this.state.items[i].name, msg);
          // const state = Object.assign({}, this.state);
          // state.items[i].status = msg;
          // this.setState(state);
          // console.log('afterSetStatus', this.state);
          // this.state.items[i].status = msg;
          // this.forceUpdate();
      });
    }
  }  

  renderItems() {
    return this.state.items.map(item => this.renderCardAction(item));
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
                    {item.status}
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
            <Container>
                <Header>
                    <Left>
                        <Button transparent>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Header</Title>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Icon name='menu' />
                        </Button>
                    </Right>
                </Header>              
                <Content>  
                  { this.renderItems() }
                </Content>
            </Container>
    );
  }
}

AppRegistry.registerComponent('MyHomeBridge', () => MyHomeBridge);