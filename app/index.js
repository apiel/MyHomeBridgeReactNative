/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import { observable } from 'mobx';
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

@observer export default class MyHomeBridge extends Component {
  mqttService: MqttService = new MqttService;

  @observable items: Item[] = [];

//   items = observable([
//         {name:"Stop floor heating",key:"action/floorHeatingOff"},
//         {name:"Spot light chillarea",key:"item/garage/chill/light",values:["on","off"]}
//    ]);

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
      console.log('init connection');
      this.mqttService.init(() => this._loadItems() );
  }

  _loadItems() {
      console.log('loadItems after connect', this);
    // if (this.settings.topicDefinition) {
      // this.mqttService.subscribe(this.settings.topicDefinition, msg => {
      this.mqttService.subscribe('definitions', msg => {
        console.log('subscribe definitions', msg);
        this.items = JSON.parse(msg).map(item => { item.status = ''; return item; });
        // this.items = JSON.parse(msg);
        this._loadConsumers();
      });
    // }
  }  

  _loadConsumers() {
    for(let item of this.items) {
       this.mqttService.subscribe(item.key, msg => {
          console.log('setStatus', item.name, msg);       
          item.status = msg;
       });        
    }

    // for (let i = 0; i < this.items.length; i++) { 
    //   const item: Item = this.items[i];
    //   this.mqttService.subscribe(item.key, msg => {
    //       console.log('setStatus', item.name, msg);
    //     //   const items = this.items.slice();
    //     //   items[i].status = msg;
    //     //   this.items = items;
    //     this.items[i].status = msg;
    //   });
    // }
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



// import { autorun} from "mobx";

// var todos = observable([
//     { title: "Spoil tea", completed: true },
//     { title: "Make coffee", completed: false }
// ]);

// autorun(() => {
//     console.log("Remaining:", todos
//         .filter(todo => !todo.completed)
//         .map(todo => todo.title)
//         .join(", ")
//     );
// });
// // Prints: 'Remaining: Make coffee'

// todos[2] = { title: 'Take a nap', completed: false };

// todos.forEach(todo => {
//     todo.completed = false;
// })