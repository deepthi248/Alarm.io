import React, { Component } from 'react'

export default class AddAlarm extends Component {

    constructor() {
        super();
        this.state = {
            alarm_details: [],
            count: 0,
            display_active: false,

        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.calculateDiff = this.calculateDiff.bind(this)
        this.stopAlarm = this.stopAlarm.bind(this)
        this.setAnAlarm = this.setAnAlarm.bind(this)
        this.snoozeAlarm = this.snoozeAlarm.bind(this)
        this.id = 0;
        this.timer = 0;
        this.temp = Infinity;
        this.alarm_ringtone = new Audio('https://raw.githubusercontent.com/Newton-School/audio-video-HTML-cypress-boilerplate/main/public/Let%20Her%20Go.mp3')

    }

    calculateDiff(alarm_time) {
        const alarm = new Date(alarm_time);
        return alarm - new Date()
    }

    handleInputChange(event) {
        //setting the alarm details
        const diff = this.calculateDiff(event.target.value)
        if (diff <= 0) {
            alert("Time choosen is already passed")
            return
        }
        else if (event.target.value === "") {
            alert("Choose time and date");
            return
        }
        this.setState(
            { ...this.state, alarm_details: [...this.state.alarm_details, { alarm_time: event.target.value, alarm_id: this.id, alarm_diff: diff, active: true }] }
        )
        this.id += 1;

    }

    setAnAlarm() {
        this.state.alarm_details.map(alarm => {
            if (alarm.active) {
                this.temp = alarm.alarm_diff < this.temp ? alarm.alarm_diff : this.temp;
                console.log(this.temp, "in the alarm", alarm)
            }
        })
        if (this.temp != Infinity) {
            this.timer = setTimeout(() => { this.setState({ ...this.state, display_active: true }); return this.alarm_ringtone.play() }, this.temp);
            // toggling the display

        }

    }

    stopAlarm(id) {
        this.temp = Infinity;
        console.log("set infinity inside the stop")
        this.alarm_ringtone.pause();
        this.alarm_ringtone.currentTime = 0;
        clearTimeout(this.timer);
        const new_list = this.state.alarm_details.filter(alarm => {

            if (id == alarm.alarm_id)
                alarm.active = false;
            return id != alarm.alarm_id

        });
        this.setState(prevState => {
            return ({
                ...this.state, alarm_details: new_list
            })
        })

        this.setAnAlarm();

    }

    snoozeAlarm(id) {
        if (this.state.count < 3) {
            this.alarm_ringtone.pause();
            this.alarm_ringtone.currentTime = 0;
            setTimeout(() => { this.alarm_ringtone.play(); }, 5000);
            this.setState((prevState) => {
                return ({ ...this.state, count: prevState.count + 1 })
            })
        }
        else {
            this.stopAlarm(id)
        }

    }

    render() {
        return (
            <div>
                <h1> Select time for alarm</h1>
                <input
                    value={this.state.alarm_details.alarm_time}
                    onChange={this.handleInputChange}
                    type="datetime-local"
                />
                <button onClick={this.setAnAlarm}>Set Alarm</button>
                {
                    this.state.alarm_details.map(alarm => {
                        return (
                            <div>
                                <p>{alarm.alarm_time}</p>
                                <button className={!this.state.display_active ? '' : "Notactive"} onClick={() => this.stopAlarm(alarm.alarm_id)}>Cancel Alarm</button>
                                <div className={this.state.display_active ? '' : "Notactive"}>
                                    <button onClick={() => this.stopAlarm(alarm.alarm_id)}>Stop Alarm</button>
                                    <button onClick={() => this.snoozeAlarm(alarm.alarm_id)}>Snooze Alarm</button>
                                </div>
                            </div>
                        )
                    })

                }
            </div >
        )
    }
}
