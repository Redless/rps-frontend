import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let url = 
    //"http://127.0.0.1:5000/";
    "https://littlerps.herokuapp.com/";

class Room extends React.Component {
    render() {
	return (
	    <div>
	        <button className="side" onClick={() => this.props.onClick(0)}>
	            {"Join Red Team"}
	        </button>
	        <button className="side" onClick={() => this.props.onClick(1)}>
	            {"Join Blue Team"}
	        </button>
	    </div>
	);
    }
}

class Manager extends React.Component {
    constructor(){
	super();
	this.state = {
	    ingame:false,
	    gamein:null,
	    side:0,
	}
    }

    setPlayerInRoom(room,side) {
	this.setState({side:side,ingame:true});
	this.setState({gamein:(<GameViewer side={side}/>)})
    }

    render(){
	if (this.state.ingame) {
	    return (<div>
		{this.state.gamein}
		</div>)
	} else {
	    return (
		<Room onClick={(side) => this.setPlayerInRoom(0,side)}/>
	    )
	}
    }
}

class GameViewer extends React.Component {
constructor() {
    super();
    this.timerID = setInterval(
	() => this.tick(),
	1000
    );

    this.state = {
	p1score:0,
	p2score:0,
    }
  }

    tick() {
      fetch(url).then(response => {return response.json()}).then(json => {this.updateScores(json.p1score,json.p2score)})
    }

    updateScores(score1,score2){
	this.setState({p1score:score1,p2score:score2})
    }

    send(choice) {
      console.log(this.props.side,choice)
      fetch(url, {
        method:"POST",
        cache: "no-cache",
        headers:{
            "content_type":"application/json",
        },
	  body:JSON.stringify({side:this.props.side,move:choice})
        }
    ).then(response => {
    return response.json()
  })
  .then(json => {console.log(json)})
	console.log("sent")
	console.log(choice)
    }

  renderOptionButton(option) {
      return (
	  <button className="optionbutton" onClick={() => this.send(option)}>
	  {option}
	  </button>)

  }

  render() {
    return (
      <div className="game">
	{this.renderOptionButton("rock")}
	{this.renderOptionButton("paper")}
	{this.renderOptionButton("scissors")}
	{this.state.p1score}{this.state.p2score}
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Manager />,
  document.getElementById('root')
);

