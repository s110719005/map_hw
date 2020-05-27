import React, { useState, useEffect } from "react";
import { StyleSheet, Platform, View, Image,Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { Icon } from "react-native-elements";
import metroJson from "./json/metro.json";
import mymapJson from "./json/mymap.json";
import ubikeJson from "./json/mymap.json";

const App = () => {
  const [region, setRegion] = useState({
    longitude: 121.544637,
    latitude: 25.024624,
    longitudeDelta: 0.01,
    latitudeDelta: 0.02,
  });
  const [marker, setMarker] = useState({
    coord: {
      longitude: 121.539997,
      latitude: 24.996524,
    },
    name: "國立臺北教育大學",
    address: "台北市和平東路二段134號",
  });
  const [onCurrentLocation, setOnCurrentLocation] = useState(false);
  const [metro, setMetro] = useState(metroJson);
  const [mymap, setmymap] = useState(mymapJson);
  const [ubike, setubike] = useState(ubikeJson);

  const onRegionChangeComplete = (rgn) => {
    if (
      Math.abs(rgn.latitude - region.latitude) > 0.0002 ||
      Math.abs(rgn.longitude - region.longitude) > 0.0002
    ) {
      setRegion(rgn);
      setOnCurrentLocation(false);
    }
  };

  const setRegionAndMarker = (location) => {
    setRegion({
      ...region,
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    });
    setMarker({
      ...marker,
      coord: {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      },
    });
  };

  const getLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setMsg("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setRegionAndMarker(location);
    setOnCurrentLocation(true);
  };

  useEffect(() => {
    if (Platform.OS === "android" && !Constants.isDevice) {
      setErrorMsg(
        "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      );
    } else {
      getLocation();
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        region={region}
        style={{ flex: 1 }}
        showsTraffic
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {metro.map((site) => (
          <Marker
            coordinate={{ latitude: site.latitude, longitude: site.longitude }}
            key={`${site.id}${site.line}`}
            title={site.name}
            description={site.address}
          >
            <View style={{width:70,height:30,backgroundColor:"#F16464",borderRadius:15,justifyContent:"center",alignItems:"center"}}>
              <View style={{backgroundColor:"#FEF9EF",width:60,height:20,borderRadius:10}}>
                  <Text>我是捷運</Text>
              </View>
            </View>
          </Marker>
        ))}
        {mymap.map((site) => (
          <Marker
            coordinate={{ latitude: site.latitude, longitude: site.longitude }}
            key={`${site.id}`}
            title={site.name}
            description={site.address}
          >
            <View style={{width:30,height:30,backgroundColor:"#FFCB77",borderRadius:15,justifyContent:"center",alignItems:"center"}}>
              <View style={{backgroundColor:"#7FB134",width:20,height:20,borderRadius:10}}>
                  <Text> :0</Text>
              </View>
            </View>
          </Marker>
        ))}
        {/* {ubike.map((site) => (
          <Marker
            coordinate={{ latitude: site.lat, longitude: site.lng }}
            key={`${site.sno}`}
            title={site.sna}
            description={site.ar}
          >
            <View style={{width:70,height:30,backgroundColor:"#F16464",borderRadius:15,justifyContent:"center",alignItems:"center"}}>
              <View style={{backgroundColor:"#FEF9EF",width:60,height:20,borderRadius:10}}>
                  <Text>我是ubike</Text>
              </View>
            </View>
          </Marker>
        ))} */}
      </MapView>
      {!onCurrentLocation && (
        <Icon
          raised
          name="ios-locate"
          type="ionicon"
          color="black"
          containerStyle={{
            backgroundColor: "#517fa4",
            position: "absolute",
            right: 20,
            bottom: 40,
          }}
          onPress={getLocation}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ring: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "rgba(130,4,150, 0.3)",
    borderWidth: 5,
    borderColor: "rgba(130,4,150, 0.5)",
  },
});

export default App;
