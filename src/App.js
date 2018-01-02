import React from 'react'
import './App.css'
import { parseApiResponse, API_URL, getJSONP } from './Api'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            time: new Date(),
            options: [],
        }
    }

    async fetch() {
        const response = await getJSONP(API_URL)
        const options = parseApiResponse(response)
        this.setState({ options , response })
    }

    tick() {
        const wantedDinnerPreviously = this.wantsDinner()
        this.setState({ time: new Date() })
        if (!wantedDinnerPreviously && this.wantsDinner()) {
            this.fetch()
        }
    }

    async componentDidMount() {
        this.fetch()
        this.interval = setInterval(() => this.tick(), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    wantsDinner() {
        return this.state.time.getHours() >= 17
    }

    render() {
        const meal = this.wantsDinner() ? 'jantar' : 'almoço'

        return (
            <div className={this.wantsDinner() ? "App App--night" : "App"}>
                <header className="App-header">
                    <h1>O que é o {meal}?</h1>
                    <p>{this.state.time.toLocaleTimeString()}</p>
                </header>
                <main className="App-body">
                    <dl>
                        {this.state.options.map(option =>
                            <div>
                                <dt>{option.canteen}</dt>
                                <dd>
                                    <ul>
                                        {Object.entries(option.foods).filter(e => e[1]).map(food =>
                                            <li>{food[0]}: {food[1].name} <span onClick={() => food[1].like()}>X</span></li>
                                        )}
                                    </ul>
                                </dd>
                            </div>
                        )}
                    </dl>
                </main>
            </div>
        )
    }
}

export default App
