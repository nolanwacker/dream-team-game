import React from 'react';
import Team from './Team'
//import { render } from '@testing-library/react';
import axios from "axios";

class App extends React.Component {

  constructor(props){
    super(props);
    this.state={
      playerName: null,
      playerStats: {}
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.getPlayerId();
    console.log(this.state.playerName)
  }

  handleChange = (event) => {
    const replace = event.target.value.split(" ").join(" ");
    if(replace.length > 0){
      this.setState({playerName: replace})
    }
    else{
      alert("Please Type Players Name")
    }
  }
  

  getPlayerId = () => {
    axios.get(`https://www.balldontlie.io/api/v1/players?search=${this.state.playerName}`)
    .then(async res =>{
      console.log(res.data.data)
      if(res.data.data[0] === undefined){
        alert("This player is either injured or hasn't played yet")
      }
      else if(res.data.data.length > 1){
        alert("Please specify name more")
      }
      else{
        await this.getPlayerStats(res.data.data[0].id)
      }
      
    })
    .catch(err=> {
      console.log(err)
    })
  }

  getPlayerStats = (playerId) => {
    axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=2019&player_ids[]=${playerId}`)
    .then(async res => {
      console.log(res.data.data)
      
      this.setState({playerStats:res.data.data[0]})
    })
    .catch(err => {
      console.log(err)
    })
  }
  
  render(){
    return (
      <div className="App">
        <Team name =  "Team 1" />
        <Team name = "Team 2" />
        <form onSubmit={this.handleSubmit}>
          <label>
            Name
            <input
              type = "text"
              value={this.state.value}
              onChange={this.handleChange}
              placeholder="please enter players name"
            />
          </label>
          <input type="submit" value="Submit"/>
        </form>
        games played: {this.state.playerStats["games_played"]}
        <br />
        points averaged: {this.state.playerStats["pts"]}
        <br />
        rebounds averaged: {this.state.playerStats["reb"]}
        <br />
        assists averaged: {this.state.playerStats["ast"]}
      </div>

    );
  }
}
//need to test an input and retrieve the stats of a player based on the search of the user

export default App;