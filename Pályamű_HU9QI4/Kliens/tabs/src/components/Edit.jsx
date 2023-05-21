import * as React from "react";
import { List, Segment, Button, Flex, TextArea, ArrowUpIcon, ArrowDownIcon, CloseIcon,} from "@fluentui/react-northstar";
import "./App.css";


export class Editmode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            BasicValues: [],
            Values: [],
            MaxPosition: 0,
            Loaded: false,
            ChatId: ""
        }
    }

    componentDidMount() {
        var url = "http://localhost:5000/getlines";
        fetch(url, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:5000/getlines',
                'Access-Control-Allow-Credentials': 'true',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chanelOrChatId: this.props.ChatId })
        }).then(response => response.json()).then(data => {
            if (typeof data != "undefined") {
                this.setState({
                    BasicValues: data,
                    ChatId: this.props.ChatId,
                });
            }
        }).then(() => {
            var Records = this.state.BasicValues;
            var value = [];
            var max = Records.length;
            for (let i = 0; i < Records.length; i++) {
                var row = {
                    id: Records[i].id,
                    key: Records[i].position,
                    header: <Flex   gap="gap.small"><TextArea id={Records[i].position} placeholder="Irja be a kívánt szöveget" fluid variables={{ "height": "100px" }} onKeyUp={() => this.UpdateTexts(Records[i].position)} defaultValue={Records[i].description} /></Flex>,
                    endMedia: <Flex><Flex column  gap="gap.small"><Button icon={<ArrowUpIcon />} iconOnly onClick={() => this.MoveBoxUp(Records[i].position)} /><Button icon={<ArrowDownIcon />} iconOnly onClick={() => this.MoveBoxDown(Records[i].position)} /></Flex><Button icon={<CloseIcon />} text iconOnly onClick={() => this.RemoveBox(Records[i].position)} /></Flex>,
                    value: Records[i].description,
                    className: "box"
                };
                value.push(row);
            }
            var current_key = 0;
            var p = {
                key: current_key,
                header: <Flex><Button content="Szögedoboz hozzáadása" secondary onClick={() => this.AddTextBox()} /> <Button content="Mentés" primary onClick={() => this.SaveData()} /></Flex>,
            }
            value.push(p);
            this.setState({
                Values: value,
                MaxPosition: max,
                Loaded: true,
                BasicValues: value
            });
        });
        

    }

    
    
    AddTextBox() {
        var value = this.state.Values;
        var value_key = this.state.MaxPosition;
        value_key++;
        var p = {
            key: value_key,
            header: <Flex  gap="gap.small"><TextArea id={value_key} placeholder="Irja be a kívánt szöveget" fluid variables={{ "height": "100px" }} onKeyUp={() => this.UpdateTexts(value_key)} defaultValue="" /></Flex>,
            endMedia: <Flex><Flex column  gap="gap.small"><Button icon={<ArrowUpIcon />} iconOnly onClick={() => this.MoveBoxUp(value_key)} /><Button icon={<ArrowDownIcon />} iconOnly onClick={() => this.MoveBoxDown(value_key)} /></Flex><Button icon={<CloseIcon />} text iconOnly onClick={() => this.RemoveBox(value_key)} /></Flex>,
            value: "",
            className:"box"
        }
        value.push(p);
        var buttons = value[value.length - 2];
        value[value.length - 2] = value[value.length - 1];
        value[value.length - 1] = buttons;
        this.setState({
            Values: value,
            MaxPosition: value_key,

        });
    }

    MoveBoxUp(box_key) {
        var value = this.state.Values;
        for (let i = 1; i < value.length; i++) {
            if (value[i].key === box_key) {
                var change = value[i];
                value[i] = value[i - 1];
                value[i - 1] = change;
            }
        }
        this.setState({
            Values: value,
        });
    }

    MoveBoxDown(box_key) {
        var value = this.state.Values;
        for (let i = 0; i < value.length - 2; i++) {
            if (value[i].key === box_key) {
                var intermed = value[i + 1];
                value[i + 1] = value[i];
                value[i] = intermed;
                break;
            }
        }
        this.setState({
            Values: value,
        });
    }

    UpdateTexts(box_key) {
        var value = this.state.Values;
        for (let i = 0; i < value.length - 1; i++) {
            if (value[i].key === box_key) {
                value[i].value = document.getElementById(box_key).value;
                value[i].header = <Flex gap="gap.small"><TextArea id={value[i].key} placeholder="Irja be a kívánt szöveget" fluid variables={{ "height": "100px" }} onKeyUp={() => this.UpdateTexts(value[i].key)} defaultValue={value[i].value} /></Flex>
            }
        }
        this.setState({
            Values: value,
        });
    }


    RemoveBox(key) {
        var value = this.state.Values;
        for (let i = 0; i < value.length; i++) {
            if (value[i].key == key) {
                value.splice(i, 1);
            }
        }
        this.setState({
            Values: value,
        });

    }

    SaveData() {
        var data = this.state.Values;
        var requestbody = [];
        var channel = {
            chanelOrChatId: this.state.ChatId
        };
        requestbody.push(channel);
        for (let i = 0; i < data.length -1; i++) {
            if (data[i].value != "") {
                var row;
                if (data[i].hasOwnProperty("id")) {
                    row = {
                        id: data[i].id,
                        description: data[i].value,
                        position: i + 1,
                        chanelOrChatId: this.state.ChatId
                    };
                } else {
                    row = {
                        description: data[i].value,
                        position: i + 1,
                        chanelOrChatId: this.state.ChatId
                    };
                }
                if (Object.keys(row).length != 0) {
                    requestbody.push(row);
                }
                
            }
        }
        var url = "http://localhost:5000/postlines";
            fetch(url, {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:5000/postlines',
                    'Access-Control-Allow-Credentials': 'true',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestbody)
            }).then(response => response.json()).then(data => {
                if (typeof data != "undefined") {
                    window.location.reload(false);
                }
            }); 
    }
    render() {
        return (
            <div className="flex" >
                <h1> Szövegdobozok szerkesztés és új szövegdobozok hozzáadása</h1>
                <Segment content={<List items={this.state.Values} />} />
            </div>
        )
    }
}