import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

function TabsComponent() {
  return (
    <Tabs
      defaultActiveKey="All"
      transition={true}
      justify
      id="noanim-tab-example"
      className="mb-3"
    >
      <Tab eventKey="all" title="All"></Tab>
      <Tab eventKey="climber" title="Climbers"></Tab>
      <Tab eventKey="oneday" title="One Day Specialists"></Tab>
      <Tab eventKey="timetrial" title="Time Trialsts"></Tab>
      <Tab eventKey="sprint" title="Sprinters"></Tab>
    </Tabs>
  );
}

export default TabsComponent;
