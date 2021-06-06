import React, { Component } from 'react';
import './../css/App.css';
import AddAppointments from './AddAppointments';
import ListAppointments from './ListAppointments';
import SearchAppointments from './SearchAppointments';
import {without, findIndex} from "lodash"

class App extends Component {
  // initialize things
  constructor() {
    super();
    this.state = {
      myAppointments: [],
      formDisplay: false,
      lastIndex: 1,
      orderBy: 'petName',
      orderDir: 'asc',
      queryText: '',
    };
    // binds 'this' object to function
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.searchApts = this.searchApts.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  };

  updateInfo(name, value, id) {
    let tempApt = this.state.myAppointments;
    let aptIndex = findIndex(this.state.myAppointments, {
      aptId: id
    })
    tempApt[aptIndex][name] = value;
    this.setState({
      myAppointments: tempApt
    });
  }

  searchApts(query) {
    this.setState({
      queryText: query
    })
  }

  changeOrder(order, dir) {
    this.setState({
      orderBy: order,
      orderDir: dir
    })
  }

  toggleForm() {
    this.setState({
      formDisplay: !this.state.formDisplay
    })
  }

  addAppointment(apt) {
    let tempApt = this.state.myAppointments;
    apt.aptId = this.state.lastIndex;
    tempApt.unshift(apt);
    this.setState({
      myAppointments: tempApt,
      lastIndex: this.state.lastIndex + 1,
    })
  }

  deleteAppointment(apt) {
    let tempApt = this.state.myAppointments;
    tempApt = without(tempApt, apt);
    // 'this' here is from main class not in this function
    this.setState({
      myAppointments: tempApt,
      temp: 'test'
    })
    console.log(this.state.temp);
  }

  // lifecyle method
  componentDidMount(){
    fetch('./data.json')
      .then(response => response.json())
      .then(result => {
        const appointments = result.map(item => {
          item.aptId = this.state.lastIndex;
          this.setState({lastIndex: this.state.lastIndex + 1})
          return item;
        });
        // dont update state directly
        this.setState({
          myAppointments: appointments
        })
      })
  }
  render(){
    // this point = start to render but before display template
    let order;
    let filteredApts = this.state.myAppointments;
    if(this.state.orderDir === 'asc') {
      order = 1;
    } else {
      order = -1;
    }

    filteredApts = filteredApts.sort((a,b) => {
      let first = a[this.state.orderBy].toLowerCase();
      let second = b[this.state.orderBy].toLowerCase();
      if ( first < second ) {
        return -1 * order;
      } else {
        return 1 * order;
      }
    }).filter(item => {
      return (
        item['petName']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase()) ||
        item['ownerName']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase()) ||
        item['aptNotes']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase())
      )
    });
    // display template
    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments
                  formDisplay={this.state.formDisplay}
                  toggleForm={this.toggleForm}
                  AddAppointment={this.addAppointment}
                />
                <SearchAppointments
                  orderBy={this.state.orderBy}
                  orderDir={this.state.orderDir}
                  changeOrder={this.changeOrder}
                  searchApts={this.searchApts}
                />
                <ListAppointments
                  appointments={filteredApts}
                  deleteAppointment={this.deleteAppointment}
                  updateInfo={this.updateInfo}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
