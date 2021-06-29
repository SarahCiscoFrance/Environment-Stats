import xapi from 'xapi';

var touchPanelIDNumber = 0;
var touchPanelFound = false;
var listenerIsSet = false;
var roomAnalyticsListener;

const TempUnit = "Celsius"; //Fahrenheit or Celsius or Both

function guiEvent(event) {
  if (event.WidgetId === 'btn_stop_data' && event.Type === 'clicked') {
    setTextOff();
    console.log("stop listening roomAnalytics");
    listenerIsSet = false;
    roomAnalyticsListener();
    xapi.Command.UserInterface.Extensions.Panel.Close({});
  }
}

function getCurrentDate() {
  let date = new Date();
  let seconds = date.getSeconds();
  seconds = seconds < 10 ? "0" + seconds : seconds;
  let minute = date.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  let hour = date.getHours();
  hour = hour < 10 ? "0" + hour : hour;
  let today = date.toLocaleDateString();

  return today + " " + hour + ":" + minute + ":" + seconds;
}

function setTempWidget(tempUnit, temp) {
  if(tempUnit === "Fahrenheit"){
    var newTemp = temp * 9 / 5 + 32;
    newTemp = Number.parseFloat(newTemp).toFixed(1);
    setWidgetValue("temp_value", newTemp + ' ' + tempUnit);
  }
  else if(tempUnit === "Both"){
    var newTemp = temp * 9 / 5 + 32;
    setWidgetValue("temp_value", temp + '°C / ' + newTemp + '°F');
  }
  else{
    setWidgetValue("temp_value", temp + ' ' + tempUnit);
  }
}


xapi.Event.UserInterface.Extensions.on(event => {
  try {
    if (event.Panel.Clicked.PanelId === 'env_stats') {
      updateUI();
      if (!listenerIsSet) {
        listenerIsSet = true;
        console.log("start listening roomAnalytics");
        roomAnalyticsListener = xapi.Status.RoomAnalytics.on(value => updateUI_Events(value));
      }
    }
  } catch (error) {}
});

async function updateUI_Events(value) {
  setWidgetValue("date_time", getCurrentDate());
  // if there is a Touch Panel run the following code otherwise try and get data from Desk Pro
  if (touchPanelFound === true) {
    try {
      const devices = await xapi.Status.Peripherals.ConnectedDevice.get();
      let temp = devices.find((d) => d.id === touchPanelIDNumber).RoomAnalytics.AmbientTemperature;
      setTempWidget(TempUnit, temp);
    } catch (error) {

    }
    try {
      const devices = await xapi.Status.Peripherals.ConnectedDevice.get();
      const hum = devices.find((d) => d.id === touchPanelIDNumber).RoomAnalytics.RelativeHumidity;
      setWidgetValue("hum_value", hum + '%');
    } catch (error) {

    }
    try {
      const devices = await xapi.Status.Peripherals.ConnectedDevice.get();
      const aq = devices.find((d) => d.id === touchPanelIDNumber).RoomAnalytics.AirQuality.Index;
      setWidgetValue("aq_value", aq);
    } catch (error) {

    }
  } else {
    try {
      let temp = await xapi.Status.RoomAnalytics.AmbientTemperature.get();
      setTempWidget(TempUnit, temp);
    } catch (error) {

    }
    try {
      const hum = await xapi.Status.RoomAnalytics.RelativeHumidity.get();
      setWidgetValue("hum_value", hum + '%');
    } catch (error) {

    }
  }

  try {
    if (value.AmbientNoise.Level.A) {
      setWidgetValue("amb_value", value.AmbientNoise.Level.A + ' dbA');
    }
  } catch (error) {

  }

  try {
    if (value.Sound.Level.A) {
      setWidgetValue("sound_value", value.Sound.Level.A + ' dbA');
    }
  } catch (error) {

  }

  try {
    const presence = await xapi.Status.RoomAnalytics.PeoplePresence.get();
    setWidgetValue("pres_value", presence);
  } catch (error) {

  }

  try {
    if (value.PeopleCount.Current) {
      setWidgetValue("count_value", value.PeopleCount.Current >= 0 ? value.PeopleCount.Current : 0);
    }
  } catch (error) {

  }

  try {
    if (value.Engagement.CloseProximity) {
      setWidgetValue("engage_value", value.Engagement.CloseProximity);
    }
  } catch (error) {

  }
}

async function updateUI() {
  setWidgetValue("date_time", getCurrentDate());
  // if there is a Touch Panel run the following code otherwise try and get data from Desk Pro
  if (touchPanelFound === true) {
    try {
      const devices = await xapi.Status.Peripherals.ConnectedDevice.get();
      let temp = devices.find((d) => d.id === touchPanelIDNumber).RoomAnalytics.AmbientTemperature;
      setTempWidget(TempUnit, temp);
    } catch (error) {

    }
    try {
      const devices = await xapi.Status.Peripherals.ConnectedDevice.get();
      const hum = devices.find((d) => d.id === touchPanelIDNumber).RoomAnalytics.RelativeHumidity;
      setWidgetValue("hum_value", hum + '%');
    } catch (error) {

    }
    try {
      const devices = await xapi.Status.Peripherals.ConnectedDevice.get();
      const aq = devices.find((d) => d.id === touchPanelIDNumber).RoomAnalytics.AirQuality.Index;
      setWidgetValue("aq_value", aq);
    } catch (error) {

    }
  } else {
    try {
      let temp = await xapi.Status.RoomAnalytics.AmbientTemperature.get();
      setTempWidget(TempUnit, temp);
    } catch (error) {

    }
    try {
      const hum = await xapi.Status.RoomAnalytics.RelativeHumidity.get();
      setWidgetValue("hum_value", hum + '%');
    } catch (error) {

    }
  }

  try {
    const ambnoise = await xapi.Status.RoomAnalytics.AmbientNoise.Level.A.get();
    setWidgetValue("amb_value", ambnoise + ' dbA');
  } catch (error) {

  }

  try {
    const soundlevel = await xapi.Status.RoomAnalytics.Sound.Level.A.get();
    setWidgetValue("sound_value", soundlevel + ' dbA');
  } catch (error) {

  }

  try {
    const presence = await xapi.Status.RoomAnalytics.PeoplePresence.get();
    setWidgetValue("pres_value", presence);
  } catch (error) {

  }

  try {
    const count = await xapi.Status.RoomAnalytics.PeopleCount.Current.get();
    setWidgetValue("count_value", count >= 0 ? count : 0);
  } catch (error) {

  }

  try {
    const engage = await xapi.Status.RoomAnalytics.Engagement.CloseProximity.get();
    setWidgetValue("engage_value", engage);
  } catch (error) {

  }
}

async function setAudioConfig() {
  try {
    await
    xapi.Config.RoomAnalytics.AmbientNoiseEstimation.Mode.set("On");
  } catch (error) {

  }
}

async function setPeopleConfig() {
  try {
    await
    xapi.Config.RoomAnalytics.PeoplePresenceDetector.set("On");
  } catch (error) {

  }

  try {
    await
    xapi.Config.RoomAnalytics.PeopleCountOutOfCall.set("On");
  } catch (error) {

  }
}

async function setTouchPanelID() {
  try {
    const devices = await xapi.Status.Peripherals.ConnectedDevice.get();
    const result = devices.find((d) => d.Type === "TouchPanel" || d.Name === "Cisco Webex Room Navigator");
    touchPanelIDNumber = result.id;
    if (touchPanelIDNumber != 0) {
      touchPanelFound = true;
    }
    console.log("Touch Panel Found: ID = " + result.id);
  } catch (error) {

  }
}

async function checkIfDeskProOrNavigator() {
  try {
    const device = await xapi.Status.Peripherals.ConnectedDevice.get();
    if (device === "Cisco Webex Desk Pro") {
      console.log("Desk Pro Found");
    } else {
      await setTouchPanelID();
    }
  } catch (error) {

  }
}

async function generateUI() {
  var xml = `<Extensions>
  <Version>1.7</Version>
  <Panel>
    <Order>2</Order>
    <Origin>local</Origin>
    <Type>Statusbar</Type>
    <Icon>Hvac</Icon>
    <Color>#FFB400</Color>
    <Name>Environmental Stats</Name>
    <ActivityType>Custom</ActivityType>
    <Page>
      <Name>Environmental Stats</Name>
      <Row>
      <Name>Row</Name>
        <Widget>
          <WidgetId>date_time</WidgetId>
          <Name>Date Time</Name>
          <Type>Text</Type>
          <Options>size=3;fontSize=normal;align=center</Options>
        </Widget>
      </Row>`;
  if (touchPanelFound === true) {
    try {
      const devices = await xapi.Status.Peripherals.ConnectedDevice.get();
      devices.find((d) => d.id === touchPanelIDNumber).RoomAnalytics.AmbientTemperature;
      xml = xml + `      
      <Row>
        <Name>Temperature</Name>
        <Widget>
          <WidgetId>widget_1</WidgetId>
          <Name>Temperature</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
        <Widget>
          <WidgetId>temp_value</WidgetId>
          <Name>Value</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
      </Row>`

    } catch (error) {

    }
    try {
      const devices = await xapi.Status.Peripherals.ConnectedDevice.get();
      devices.find((d) => d.id === touchPanelIDNumber).RoomAnalytics.RelativeHumidity;
      xml = xml + `      
      <Row>
        <Name>Humidity</Name>
        <Widget>
          <WidgetId>widget_2</WidgetId>
          <Name>Humidity</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
        <Widget>
          <WidgetId>hum_value</WidgetId>
          <Name>Value</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
      </Row>`
    } catch (error) {

    }

    try {
      const devices = await xapi.Status.Peripherals.ConnectedDevice.get();
      devices.find((d) => d.id === touchPanelIDNumber).RoomAnalytics.AirQuality.Index;
      xml = xml + `      
      <Row>
        <Name>Air Quality</Name>
        <Widget>
          <WidgetId>widget_2</WidgetId>
          <Name>Air Quality</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
        <Widget>
          <WidgetId>aq_value</WidgetId>
          <Name>Value</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
      </Row>`
    } catch (error) {

    }

  } else {
    try {
      await xapi.Status.RoomAnalytics.AmbientTemperature.get();
      xml = xml + `      
      <Row>
        <Name>Temperature</Name>
        <Widget>
          <WidgetId>widget_1</WidgetId>
          <Name>Temperature</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
        <Widget>
          <WidgetId>temp_value</WidgetId>
          <Name>Value</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
      </Row>`
    } catch (error) {

    }
    try {
      await xapi.Status.RoomAnalytics.RelativeHumidity.get();
      xml = xml + `      
      <Row>
        <Name>Humidity</Name>
        <Widget>
          <WidgetId>widget_2</WidgetId>
          <Name>Humidity</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
        <Widget>
          <WidgetId>hum_value</WidgetId>
          <Name>Value</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
      </Row>`
    } catch (error) {

    }
  }

  try {
    await xapi.Status.RoomAnalytics.AmbientNoise.Level.A.get();
    xml = xml + `      
      <Row>
        <Name>Ambient Noise</Name>
        <Widget>
          <WidgetId>widget_3</WidgetId>
          <Name>Ambiant Noise</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
        <Widget>
          <WidgetId>amb_value</WidgetId>
          <Name>Value</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
      </Row>`
  } catch (error) {

  }

  try {
    await xapi.Status.RoomAnalytics.Sound.Level.A.get();
    xml = xml + `      
      <Row>
        <Name>Sound Level</Name>
        <Widget>
          <WidgetId>widget_4</WidgetId>
          <Name>Sound level</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
        <Widget>
          <WidgetId>sound_value</WidgetId>
          <Name>Value</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
      </Row>`
  } catch (error) {
    console.error(error);
  }

  xml = xml + `
      <Row>
        <Name>Stop polling &amp; QUIT</Name>
        <Widget>
          <WidgetId>btn_stop_data</WidgetId>
          <Type>Button</Type>
          <Options>size=1;icon=end</Options>
        </Widget>
      </Row>
      <Options>hideRowNames=1</Options>
    </Page>
    <Page>
      <Name>Presence</Name>
      <Row>
        <Name>Row</Name>
        <Widget>
          <WidgetId>date_time</WidgetId>
          <Name>Date Time</Name>
          <Type>Text</Type>
          <Options>size=3;fontSize=normal;align=center</Options>
        </Widget>
      </Row>`



  try {
    await xapi.Status.RoomAnalytics.PeopleCount.Current.get();
    xml = xml + `
      <Row>
        <Name>People Count</Name>
        <Widget>
          <WidgetId>widget_6</WidgetId>
          <Name>People Count</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
        <Widget>
          <WidgetId>count_value</WidgetId>
          <Name>Text</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
      </Row>`;

  } catch (error) {

  }

  try {
    await xapi.Status.RoomAnalytics.PeoplePresence.get();
    xml = xml + `
      <Row>
        <Name>People Presence</Name>
        <Widget>
          <WidgetId>widget_7</WidgetId>
          <Name>People Presence</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
        <Widget>
          <WidgetId>pres_value</WidgetId>
          <Name>Text</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
      </Row>`;
  } catch (error) {

  }

  try {
    await xapi.Status.RoomAnalytics.Engagement.CloseProximity.get();
    xml = xml + `
      <Row>
        <Name>Close Engagement</Name>
        <Widget>
          <WidgetId>widget_8</WidgetId>
          <Name>Close engagement</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
        <Widget>
          <WidgetId>engage_value</WidgetId>
          <Name>Text</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
      </Row>`;
  } catch (error) {

  }

  xml = xml + `      
  <Row>
        <Name/>
        <Widget>
          <WidgetId>btn_stop_data</WidgetId>
          <Type>Button</Type>
          <Options>size=1;icon=end</Options>
        </Widget>
      </Row>
      <PageId>date_Time</PageId>
      <Options>hideRowNames=1</Options>
    </Page>
  </Panel>
</Extensions>`
  xapi.Command.UserInterface.Extensions.Panel.Save({
    PanelId: "env_stats"
  }, xml);
}

//Run on Start to set the Panel first Values
function init() {
  //Set Configurations to True for data required from this Macro
  setAudioConfig();
  setPeopleConfig();
  checkIfDeskProOrNavigator().then(async () => {
    await generateUI();
    setTextOff();
  });
}

//Set the Text Values to Off on the Stats Page
async function setTextOff() {

  await Promise.all([
    setWidgetValue("temp_value", "Off"),
    setWidgetValue("hum_value", "Off"),
    setWidgetValue("aq_value", "Off"),
    setWidgetValue("amb_value", "Off"),
    //setWidgetValue("ambL_value", "Coming Soon"),
    setWidgetValue("sound_value", "Off"),
    //setWidgetValue("dry_value", "Coming Soon"),
    setWidgetValue("count_value", "Off"),
    setWidgetValue("engage_value", "Off"),
  ]);

}

async function setWidgetValue(id, value) {
  try {
    return await xapi.Command.UserInterface.Extensions.Widget.SetValue({
      WidgetId: id,
      Value: value,
    });
  } catch (error) {

  }
}

init();
xapi.Event.UserInterface.Extensions.Widget.Action.on(guiEvent);