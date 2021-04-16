import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Room extends React.Component {
    render() {
        return ( <
            div >
            <
            button className = "side"
            onClick = {
                () => this.props.onClick(0)
            } > {
                "Join Red Team"
            } <
            /button> <
            button className = "side"
            onClick = {
                () => this.props.onClick(1)
            } > {
                "Join Blue Team"
            } <
            /button> < /
            div >
        );
    }
}

class Manager extends React.Component {
    constructor() {
        super();
        this.state = {
            ingame: false,
            gamein: -99,
            side: 0,
        }
    }

    setPlayerInRoom(room, side) {
        this.setState({
            side: side,
            ingame: true
        });
    }

    render() {
        if (this.state.ingame) {
            return ( < div >
                In game {
                    this.gamein
                } <
                /div>)
            }
            else {
                return ( <
                    Room onClick = {
                        (side) => this.setPlayerInRoom(0, side)
                    }
                    />
                )
            }
        }
    }
}

class Game extends React.Component {
    constructor() {
        super();

        this.state = {
            glob: -99
        }
    }

    tick() {
        fetch('http://127.0.0.1:5000/')
            .then(response => response.json())
            .then(response => this.setState({
                glob: response.glob
            }))
        console.log(this.state.glob)
    }

    send(choice) {
        fetch('http://127.0.0.1:5000/', {
                method: "POST",
                cache: "no-cache",
                headers: {
                    "content_type": "application/json",
                },
                body: JSON.stringify({
                    side: this.props.side,
                    move: choice
                })
            }).then(response => {
                return response.json()
            })
            .then(json => {
                console.log(json)
            })
    }

    render() {


        return ( <
            div className = "game" >
            <
            div className = "game-board" > {
                "glob"
            } <
            /div> <
            div className = "game-info" > {
                this.state.glob
            } <
            /div> < /
            div >
        );
    }
}

// ========================================

ReactDOM.render( <
    Manager / > ,
    document.getElementById('root')
);
