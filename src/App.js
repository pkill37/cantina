import React, { Component } from 'react'
import './App.css'
import { API_URL, getJSONP } from './Api'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            response: {},
            time: new Date()
        }
    }

    tick() {
        this.setState({ time: new Date() })
    }

    async componentDidMount() {
        const response = await getJSONP(API_URL)
        this.setState({ response })
        this.interval = setInterval(() => this.tick(), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    wantsDinner() {
        return this.state.time.getHours() >= 14
    }

    render() {
        console.log(this.state.response)
        const meal = this.wantsDinner() ? 'jantar' : 'almoço'
        return (
            <div>
                <h1>O que é o {meal}?</h1>
                <ul>
                    <li>{this.state.time.toLocaleTimeString()}</li>
                    <li>omg</li>
                    <li>omg</li>
                    <li>omg</li>
                </ul>
            </div>
        );
    }
}

export default App;
