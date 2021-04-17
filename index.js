import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let url = 
    "http://127.0.0.1:5000/";
    //"https://littlerps.herokuapp.com/";

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
	this.setState({side:side,ingame:true,gamein:room});
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
	fightactive: false,
	team: "",
	activemon: "",
	activehealth: 0,
	foeactive: "",
	foehealth: 0,
	activemoves: [],
	switches: []
    }
    this.handleChange = this.handleChange.bind(this);
  }

    tick() {
      fetch(url).then(response => {return response.json()}).then(json => {this.setDisplay(json)})
    }

    setDisplay(json) {
	this.setState({fightactive: json.fightactive})
	if (this.props.side == 0) {
	    this.setState({activemon: json.p1mon,activehealth: json.p1health,foeactive: json.p2mon,foehealth: json.p2health,activemoves: json.p1moves, switches: json.p1switches})
	} else {
	    this.setState({activemon: json.p2mon,activehealth: json.p2health,foeactive: json.p1mon,foehealth: json.p1health,activemoves: json.p2moves, switches: json.p2switches})
	}
    }

    send(choice) {
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

    sendteam() {
	fetch(url, {
        method:"POST",
        cache: "no-cache",
        headers:{
            "content_type":"application/json",
        },
	    body:JSON.stringify({type:"team",side:this.props.side,...JSON.parse(this.state.team)})
        }
    ).then(response => {
    return response.json()
  })
  .then(json => {console.log(json)})
	console.log("sent")
    }



  renderSubmitButton() {
      return (
	  <button className="submitbutton" onClick={() => this.sendteam()}>
	  Submit Team
	  </button>)

  }
handleChange(event) {this.setState({team: event.target.value});}

  render() {
      if (this.state.fightactive) {
	return (
	    <div>
	    {this.state.activemon} VS {this.state.foeactive}
	    </div>);
      } else {

    return (
      <div className="game">
	{"Paste Team Below"}
	<textarea value={this.state.team} onChange={this.handleChange} />
	{this.renderSubmitButton()}
      </div>
    );
      }
  }
}

// ========================================

ReactDOM.render(
  <Manager />,
  document.getElementById('root')
);

