import * as React from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import { Menu } from "@fluentui/react-northstar";
import { Editmode } from "./Edit";
import { Previewmode } from "./Preview";
import "./App.css";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMenuItem: "Preview",
            activebutton: 0,
            ChatId: "",
            UserRole: 1,
            Loaded: false,
            Rows: []
        }
    }
 
    componentDidMount() {
        var url = "http://localhost:5000/getlines";
        microsoftTeams.app.initialize().then(() => {
            microsoftTeams.app.getContext().then((context) => {
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Access-Control-Allow-Origin': 'http://localhost:5000/getlines',
                        'Access-Control-Allow-Credentials': 'true',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ chanelOrChatId: context.team.groupId })
                }).then(response => response.json()).then(data => {
                    
                    if (typeof data != "undefined") {
                        this.setState({
                            Rows: data,
                            ChatId: context.team.groupId,
                            UserRole: context.team.userRole
                        });
                    }
                }).then(() => {
                    this.setState({
                        Loaded: true
                    });
                });
            })
        })
    }

    render() {
        if (this.state.Loaded) {
            return (
                <div className="welcome page">
                    {this.state.UserRole == 0 && this.state.Loaded ?
                        (<div className="page-pading">
                            <Menu defaultActiveIndex={this.state.activebutton} items={[
                                {
                                    key: "Preview",
                                    content: { content: "Preview", className: "menutext" },
                                    onClick: () => this.setState({ selectedMenuItem: "Preview" }),
                                    className: "menubutton"
                                },
                                {
                                    key: "Edit",
                                    content: { content: "Edit", className: "menutext" },
                                    onClick: () => this.setState({ selectedMenuItem: "Edit" }),
                                    className: "menubutton"
                                },
                            ]}
                                primary />
                            <div>
                                {this.state.selectedMenuItem === "Preview" && (
                                    <div>
                                        <Previewmode
                                            Rows={this.state.Rows}
                                            LoadApp={this.LoadApp}
                                        />
                                    </div>
                                )}
                                {this.state.selectedMenuItem === "Edit" && (
                                    <div>
                                        <Editmode
                                            ChatId={this.state.ChatId}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>) : (<div>
                            <Previewmode
                                Rows={this.state.Rows}
                            />
                        </div>)
                    }
                </div>
            );
        } else {
            return null;
        }
    }



    

    

    

    



}







