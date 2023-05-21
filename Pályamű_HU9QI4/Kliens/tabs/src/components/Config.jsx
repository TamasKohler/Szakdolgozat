// https://fluentsite.z22.web.core.windows.net/quick-start
import { Provider, teamsTheme, Loader } from "@fluentui/react-northstar";
import { HashRouter as Router, Redirect, Route } from "react-router-dom";
import { useTeamsFx } from "@microsoft/teamsfx-react";
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import App from "./App";
import "./App.css";
import TabConfig from "./TabConfig";
import { TeamsFxContext } from "./Context";




export default function Config() {
 
  const { loading, theme, themeString, teamsfx } = useTeamsFx();
  var backgroundcolor;
  if (themeString === "default") {
    backgroundcolor = "#eeeeee";
  } else {
    backgroundcolor = "#292929";
  }
  return (
    <TeamsFxContext.Provider value={{theme, themeString, teamsfx}}>
      <Provider theme={theme || teamsTheme} styles={{ backgroundColor: backgroundcolor }}>
        <Router>
          <Route exact path="/">
            <Redirect to="/tab" />
          </Route>
          {loading ? (
            <Loader style={{ margin: 100 }} />
          ) : (
            <>
              <Route exact path="/privacy" component={Privacy} />
              <Route exact path="/termsofuse" component={TermsOfUse} />
              <Route exact path="/tab" component={App} />
              <Route exact path="/config" component={TabConfig} />
            </>
          )}
        </Router>
      </Provider>
      </TeamsFxContext.Provider>
  );
}