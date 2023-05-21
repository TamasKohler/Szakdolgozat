import * as React from "react";
import { List, Segment, Table, Button, Flex, EyeFriendlierIcon, Menu, TextArea, Divider, Alert, Form, Popup, Text } from "@fluentui/react-northstar";
import { TeamsFxContext } from "./Context";
import "./App.css";

export class Previewmode extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            values: [],
            Loaded: false
        });
    }
    componentDidMount() {
        this.ConvertData();
        this.setState({
            Loaded: true
        });
    }
    ConvertData() {
        var Records = this.props.Rows;
        var value = [];
        for (let i = 0; i < Records.length; i++) {
            for (let j = 0; j < Records.length - 1; j++) {
                if (Records[j].position > Records[i].position) {
                    var change = Records[j];
                    Records[j] = Records[i];
                    Records[i] = change;
                }
            }
        }
        for (let i = 0; i < Records.length; i++) {
            var row = {
                key: Records[i].position,
                header: <Text content={Records[i].description}></Text>,
                className: "box"
            };
            value.push(row);

        }
        this.setState({
            values: value
        });
    }
    render() {
        if (this.state.Loaded) {
            return (
                <div>
                    <Segment content={<List items={this.state.values} />} />
                </div>
            );
        } else {
            return null;
        }


    }
}