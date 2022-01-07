import react from 'react';
import React, { Component } from 'react'
export class SetAlarm extends Component {


    constructor(props) {
        super();
        //setting the state
        this.state = {
            alarm_time: "",
            active: false,
            count: 0,
            alarms: [],

        }

        //binding the methods 
        this.handleChange = this.handleChange.bind(this)
        this.setAnAlarm = this.setAnAlarm.bind(this)
        this.initAlarm = this.initAlarm.bind(this)
        this.stopAlarm = this.stopAlarm.bind(this)
        this.snoozeAlarm = this.snoozeAlarm.bind(this)
        //alarm ringtone
        this.alarm_ringtone = new Audio('https://raw.githubusercontent.com/Newton-School/audio-video-HTML-cypress-boilerplate/main/public/Let%20Her%20Go.mp3')
        this.timer = 0;
        this.setIntervaltimer = 0;
    }


    // componentDidUpdate() {
    //     this.state.alarms.map(singleAlarm => {
    //         console.log("in compoenent did update")
    //         const diff = this.calculateTimeOut(singleAlarm.alarm);
    //         this.timer = setTimeout(this.initAlarm, diff)

    //     })
    // }

    //catching the input given by user
    handleChange(event) {
        this.setState({
            ...this.state,
            alarm_time: event.target.value,
            active: false,

        })

    }

    calculateTimeOut(AlarmTime) {
        const diff = AlarmTime - new Date();
        return diff;
    }



    setAnAlarm(alarm_time) {
        const alarm = new Date(this.state.alarm_time)
        const diff = this.calculateTimeOut(alarm)

        if (this.state.alarm_time === "") {
            alert("Invalid Time Input")
            this.setState(
                {
                    ...this.state, alarm_time: ""
                }
            )
            return;
        }
        else if (diff < 0) {
            alert("time chosen is already passed");
            this.setState(
                {
                    ...this.state, alarm_time: ""
                }
            )
            return;
        }
        console.log(this.state.alarm_time)
        //adding the value to the alarms
        this.setState(prevState => {
            console.log(prevState);
            return {
                ...this.state, alarms: [...prevState.alarms, this.state.alarm_time],
            }
        })

        this.timer = setTimeout(this.initAlarm, diff)
    }

    cancelAlaram(id) {
        clearTimeout(this.timer)
        const newList = this.state.alarms.filter((alaram, index) => { console.log(index, id, "inside the cancel"); return index != id })
        console.log("inside cancel", newList)
        this.setState({ ...this.state, alarms: newList })

        let result = "", temp = 0;
        for (let singleAlaram of newList) {
            const diff = singleAlaram.alram - new Date();
            temp = diff < temp ? diff : temp;
            result = singleAlaram.index;
        }
        this.setAnAlarm(newList[result])
    }

    initAlarm() {
        this.alarm_ringtone.play();
        this.toggleClass();
        this.setState({ ...this.state, alarm_time: "" })
    }

    pauseRingTone() {
        this.alarm_ringtone.pause();
        this.alarm_ringtone.currentTime = 0;

    }
    stopAlarm(id) {
        this.pauseRingTone();
        clearTimeout(this.timer)
        const newList = this.state.alarms.filter((alaram, index) => { return index != id })
        this.setState({ ...this.state, alarm_time: "", active: false, alarms: newList })

        let result = "", temp = 0;
        for (let singleAlaram of newList) {
            const diff = singleAlaram.alram - new Date();
            temp = diff < temp ? diff : temp;
            result = singleAlaram.index;
        }
        this.setAnAlarm(newList[result])
    }

    toggleClass() {
        if (this.state.active === true) {
            this.setState({ ...this.state, active: false })
        }
        else {
            this.setState({ ...this.state, active: true })
        }
    }

    snoozeAlarm(index) {
        if (this.state.count < 2) {
            this.pauseRingTone();
            setTimeout(() => { this.alarm_ringtone.play(); }, 5000);
            this.setState((prevState) => { return { ...this.state, count: prevState.count + 1 } })

        }
        else {
            this.stopAlarm(index)
        }

    }
    render() {
        return (
            <div>
                <input type="datetime-local"
                    value={this.state.alarm_time}
                    onChange={this.handleChange} />

                <button onClick={() => this.setAnAlarm(this.state.alarm_time)}>Set Alarm</button>

                {
                    this.state.alarms.map((alarm, index) => {

                        return (
                            <div key={index}>
                                <p>{alarm}</p>
                                <button className={!this.state.active ? 'no_display' : ""} onClick={() => this.stopAlarm(index)} >Stop Alarm </button>
                                <button className={!this.state.active ? 'no_display' : ""} onClick={() => this.snoozeAlarm(index)} >Snooze Alarm </button>
                                <button className={this.state.active ? 'no_display' : ""} onClick={() => this.cancelAlaram(index)} >Cancel Alarm</button>
                            </div>
                        )
                    })
                }
            </div >
        )
    }
}

export default SetAlarm
