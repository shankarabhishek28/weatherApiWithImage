import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StatusBar, Image, TextInput, KeyboardAvoidingView, Platform, FlatList, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { debounce } from 'lodash';
import { fetchCurrentWeather, fetchlocationEndPoint } from '../api/weather';
import fetchWeatherImages from '../api/fetchWeatherImages';

const Home = () => {
    const [showSearch, toggleSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [weather, setWeather] = useState({});
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        const weatherCondition = weather.current?.condition?.text;
        if (weatherCondition) {
            fetchWeatherImages(weatherCondition)
                .then(urls => {
                    setImageUrls(urls);
                })
                .catch(error => {
                    console.error('Error fetching weather images:', error);
                });
        }
    }, [weather]);

    const handleLoc = (loc) => {
        toggleSearch(false);
        setLocations([]);
        fetchCurrentWeather({ cityName: loc.name })
            .then(data => {
                setWeather(data);
            })
            .catch(error => {
                console.error('Error fetching current weather:', error);
            });
    }

    const handleSearch = value => {
        if (value.length > 2) {
            fetchlocationEndPoint({ cityName: value })
                .then(data => {
                    setLocations(data);
                })
                .catch(error => {
                    console.error('Error fetching location endpoint:', error);
                });
        }
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
    const { current, location } = weather;

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#6080E2',padding:20 }}>
            <StatusBar backgroundColor='black' />
            <View style={{ flex: 1, marginBottom:20 }}>
                <View style={{ paddingTop: 0, paddingTop:50 }}>
                    <View style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'transparent' }}>
                            {showSearch &&
                                <TextInput
                                    onChangeText={handleTextDebounce}
                                    placeholder="Search city"
                                    placeholderTextColor="white"
                                    style={{ paddingLeft: 16, height: 40, flex: 1, fontSize: 16, color: 'white', backgroundColor: 'transparent', borderWidth:1,borderColor:'white' }}
                                />
                            }
                            <TouchableOpacity
                                onPress={() => toggleSearch(!showSearch)}
                                style={{ backgroundColor: 'darkblue', padding: 8, height: 40, width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text style={{ color: 'white' }}>{showSearch ? 'Close' : 'Search'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, paddingTop: 10 }}>
                    {locations?.length > 0 && showSearch && (
                        <FlatList
                        style={{marginTop:10}}
                            data={locations}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleLoc(item)} style={{ padding: 10, borderBottomWidth: 1,backgroundColor:'white' }}>
                                    <Text style={{color:'black'}}>{item?.name}, {item?.country}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
                {weather.current?                <View style={{ flex: 1.5, padding: 0 }}>
                    <View style={{ marginBottom: 20 , alignSelf:'center'}}>
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>{location?.name}</Text>
                        <Text style={{ color: '#ccc', fontSize: 18, fontWeight: '600', textAlign: 'center' }}> {location?.country}</Text>
                        <WeatherDetail label="Last Updated" icon={require('../assets/icons/sun.png')} value={current?.last_updated} />

                    </View>
                    <FlatList
                        horizontal
                        data={imageUrls}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false} 
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item }}
                                style={{ width: 130, height: 130, marginRight: 10, borderRadius:12 }}
                            />
                        )}
                    />
                    <View style={{ marginTop: 0, alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 48 }}>{current?.temp_c}°</Text>
                        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 28 }}>{current?.condition?.text}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <WeatherDetail label="Wind" icon={require('../assets/icons/wind.png')} value={`${current?.wind_kph} km/h`} />
                        <WeatherDetail label="Humidity" icon={require('../assets/icons/drop.png')} value={`${current?.humidity}%`} />
                    </View>
                </View>:
                <View style={{alignSelf:'center',backgroundColor:'darkblue', padding:10}}>
                    <Text style={{color:'white', fontSize:22,textAlign:'justify'}}>Data will show after your Search Click on Search button above, search on it...with text length greater than 2,wait for 2 secs for suggestions,  tap to the location</Text>
                    </View> }

            </View>
        </KeyboardAvoidingView>
    );
}

const WeatherDetail = ({ label, icon, value }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Image source={icon} style={{ height: 24, width: 24 }} />
        <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>{label}: {value}</Text>
    </View>
);

export default Home;
