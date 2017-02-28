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

//   items: Item[] = [
//     {name: "Light table", key: "item/garage/table/light", status: "off", values: ["on", "off"]},
//     {name: "Floor heating on", key: "action/floorHeatingOn"},
//     {name: "Thermostat", key: "item/garage/thermostat", status: 120, number: {min: 100, max: 200}},
//     {name: "Store", key: "item/garage/roof/store", status: "open", values: ["open", "stop", "close"]},
//     {name: "WC vmc", key: "item/garage/wc/vmc", status: "on", values: ["on", "off"]},
//     {name: "Light Kitchen", key: "item/garage/kitchen/light", status: "on", values: ["on", "off"]}
//   ];

  items: Item[] = [];

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
        this.items = JSON.parse(msg);
        this._loadConsumers();
      });
    // }
  }  

  _loadConsumers() {
    for(let item of this.items) {
      if (item.values && !item.status) {
        item.status = '';
      }
      this.mqttService.subscribe(item.key, msg => item.status = msg);
    }
  }  

  renderItems() {
    return this.items.map(item => this.renderCardAction(item));
  }

  renderCardAction(item: Item) {
    return (
        <Card>
            <CardItem header>
                <Text>{item.name}</Text>
            </CardItem>

            <CardItem>
                { !item.hasOwnProperty('status') && 
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