// @flow

import Mqtt from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';

export default class {
    mqtt: any;
    // isConnected: boolean = false;
    _subscribeCallback: { [topic: string]: (message: string, topic ?: string) => any } = {};

    constructor() {
        Mqtt({
            size: 10000,
            storageBackend: AsyncStorage,
            defaultExpires: 1000 * 3600 * 24,
            enableCache: true,
            sync : {}
        });
    }

    init(host: string, port: number, connectedCallback: Function) { // host: string, port: number
        if (this.mqtt) this.mqtt.disconnect();
        this.mqtt = new Paho.MQTT.Client(host, port, 'unique_client_name');
        // this.mqtt = new Paho.MQTT.Client('192.168.2.224', 3030, 'unique_client_name');
        // this.mqtt.onConnectionLost = () => this.isConnected = false;
        this.mqtt.onMessageArrived = (message: any) => this._consume(message);
        this.mqtt.connect({ onSuccess: () => { /* this.isConnected = true; */ connectedCallback(); }});
    }

    _consume(message: any) {
        console.log('onMessageArrived', message);
        const topic = message.destinationName;
        console.log('topic', topic);
        console.log('topic in this._subscribeCallback', this._subscribeCallback);
        if (topic in this._subscribeCallback) {
           this._subscribeCallback[topic](message.payloadString, topic);
        }
    }

    subscribe(topic: string, callback: (message: string, topic ?: string) => any) {
        if (this.mqtt) {
            console.log('Subscribe to topic', topic);
            this.mqtt.subscribe(topic);
            this._subscribeCallback[topic] = callback;            
        }        
    }

    publish(topic: string, message: string) {
        if (this.mqtt) {
            const message = new Paho.MQTT.Message(message);
            message.destinationName = topic;
            message.retained = true;
            this.mqtt.send(message);            
        }
    }

    isConnected() {
        return this.mqtt && this.mqtt.isConnected;
    }
}