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
		room {this.props.number}
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


	this.timerID = setInterval(
	    () => this.tick(),
	    1000
	);

	this.state = {
	    ingame:false,
	    gamein:null,
	    numrooms:0
	}
    }

    tick() {
      fetch(url,{method:"POST",
        cache: "no-cache",
        headers:{
            "content_type":"application/json",
        },
	  body:'{"type":"getrooms"}'}).then(response => {return response.json()}).then(json => {this.setDisplay(json)})
    }

    setDisplay(json) {
	this.setState({numrooms:json.numrooms})
	console.log("set number rooms")
    }

    setPlayerInRoom(room,side) {
	this.setState({ingame:true});
	this.setState({gamein:(<GameViewer side={side} room={room}/>)})
    }

    requestnewroom(){
	fetch(url, {
        method:"POST",
        cache: "no-cache",
        headers:{
            "content_type":"application/json",
        },
	    body:JSON.stringify({type:"makeroom"})
        })

    }

    render(){
	if (this.state.ingame) {
	    return (<div>
		{this.state.gamein}
		</div>)
	} else {
	    var foo = [];
	    for (var i = 1; i <= this.state.numrooms; i++) {
	       foo.push(i);
	    }
	    return (<div>
	        <button onClick={() => this.requestnewroom()}>
	            {"make new room"}
	        </button>
		{foo.map((value, index) => {
        return 	<Room onClick={(side) => this.setPlayerInRoom(index,side)} number={index}/>
		})}</div>);}
	
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
	switches: [],
	fightfinished: "",
	fightwinner: "",
	log: [],
	foemons: [],
	foehealths: [],
	ourmons: [],
	ourhealths: []
    }
    this.handleChange = this.handleChange.bind(this);
  }

    tick() {
      fetch(url,{method:"POST",
        cache: "no-cache",
        headers:{
            "content_type":"application/json",
        },

	  body:JSON.stringify({room:this.props.room,type:"getinfo"})}).then(response => {return response.json()}).then(json => {this.setDisplay(json)})
    }

    renderOptions() {
	if (this.state.activemoves) {
	return (<div><p>
	    {this.state.activemoves.map((value, index) => {
        return <button onClick={() => this.sendMove(index)}>{value}</button>})}</p><p>
	    {this.state.switches.map((value, index) => {
        return <button onClick={() => this.sendSwitch(index)}>{value}</button>})}</p>
	</div>);
	} else {
	return (<div>
	    {this.state.switches.map((value, index) => {
        return <button onClick={() => this.sendSwitch(index)}>{value}</button>})}
	</div>);


	}

    }

    setDisplay(json) {
	this.setState({log: json.log})
	if ((json.winner == "p1") || (json.winner == "p2")) {
	    console.log("FIGHT FINISHED")
	    this.setState({fightfinished: true,fightwinner: json.winner,fightactive: false})
	    return
	}
	if (this.props.side == 0) {
	    this.setState({activemon: json.p1mon,activehealth: json.p1health,ourStatus: json.p1status,foeactive: json.p2mon,foehealth: json.p2health,foeStatus: json.p2status,activemoves: json.p1moves, switches: json.p1switches, foemons: json.p2mons, foehealths: json.p2healths, ourmons: json.p1mons, ourhealths: json.p1healths})
	} else {
	    this.setState({activemon: json.p2mon,activehealth: json.p2health,ourStatus: json.p2status,foeactive: json.p1mon,foehealth: json.p1health,foeStatus: json.p1status,activemoves: json.p2moves, switches: json.p2switches, foemons: json.p1mons, foehealths: json.p1healths, ourmons: json.p2mons, ourhealths: json.p2healths})
	}
	this.setState({fightactive: json.fightactive})
    }

    send(choice) {
      fetch(url, {
        method:"POST",
        cache: "no-cache",
        headers:{
            "content_type":"application/json",
        },
	  body:JSON.stringify({side:this.props.side,move:choice,room:this.props.room})
        }
    ).then(response => {
    return response.json()
  })
  .then(json => {console.log(json)})
	console.log("sent")
	console.log(choice)
    }
    sendMove(move){
	fetch(url, {
        method:"POST",
        cache: "no-cache",
        headers:{
            "content_type":"application/json",
        },
	    body:JSON.stringify({type:"move",move:move,side:this.props.side,room:this.props.room})
        })
    }

    sendSwitch(mon){
	fetch(url, {
        method:"POST",
        cache: "no-cache",
        headers:{
            "content_type":"application/json",
        },
	    body:JSON.stringify({type:"swap",mon:mon,room:this.props.room,side:this.props.side})
        })
    }

    sendteam() {
	fetch(url, {
        method:"POST",
        cache: "no-cache",
        headers:{
            "content_type":"application/json",
        },
	    body:JSON.stringify({type:"team",room:this.props.room,side:this.props.side,...JSON.parse(this.state.team)})
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

    renderlog() {
	    return (<div className="logcol">
	    {this.state.log.map((value, index) => {
        return <p>{value}</p>})}
	    </div>);
    }

    renderStatus(stat) {
	return (<div>
	    {stat.map((value,index) => {
		return <p>{value}</p>})}
	    </div>);
    }

    renderMonsAndHealth(mons,healths){
	return (<div>
	    {mons.map((value, index) => {return <p>{value}{"  "}{healths[index]}</p>})}</div>);
    }

  render() {
      if (this.state.fightactive) {
	return (
	    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20 }}>
	    <div><h2>{this.state.activemon}</h2><p>{this.state.activehealth}</p><p>{this.renderStatus(this.state.ourStatus)}</p>{this.renderOptions()}{this.renderMonsAndHealth(this.state.ourmons,this.state.ourhealths)}</div>
	    <div><h2>{this.state.foeactive}</h2><p>{this.state.foehealth}</p><p>{this.renderStatus(this.state.foeStatus)}</p>{this.renderMonsAndHealth(this.state.foemons,this.state.foehealths)}</div>
	    {this.renderlog()}

  </div>);
      } else if (this.state.fightfinished) {
	  console.log("printin out that fight finished!")
	  return (
<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20 }}>
	    <div>
	      
	      Game over!
	      Winner is:
	      {" "}
	      {this.state.fightwinner}
	      </div>
	    <div></div>
	    {this.renderlog()}

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

