// @flow
import { observer } from 'mobx-react/native';
import React, { Component } from 'react';
import { View } from 'react-native';

import { Content, Text, Button, Form, Input, Item, Label } from 'native-base'; 

@observer export default class extends Component {
  render() {
    return (
        <Content style={{backgroundColor: '#DDDDDD', opacity:0.9, padding: 10, flex: 1}}>
            <Form style={{marginBottom: 15}}>
                <Item stackedLabel>
                    <Label>Name</Label>
                    <Input value={this.props.config.name}
                           onChangeText={(value) => { this.props.config.name = value; }}/>
                </Item>
                <Item stackedLabel>
                    <Label>Host</Label>
                    <Input value={this.props.config.host}
                           onChangeText={(value) => { this.props.config.host = value; }}/>
                </Item>
                <Item stackedLabel>
                    <Label>Port</Label>
                    <Input value={this.props.config.port.toString()}
                           keyboardType="numeric"
                           onChangeText={(value) => { this.props.config.port = value; }}/>
                </Item>
                <Item stackedLabel last>
                    <Label>Topic definitions</Label>
                    <Input value={this.props.config.topicDefinitions}
                           onChangeText={(value) => { this.props.config.topicDefinitions = value; }}/>
                </Item>                                                               
            </Form>
            <Button block style={{margin: 5}} onPress={() => this.props.onSave()}>
                <Text>Save</Text>
            </Button>    
            <Button light block style={{margin: 5}} onPress={() => this.props.onCancel()}>
                <Text>Cancel</Text>
            </Button>               
        </Content>
    );
  }
}