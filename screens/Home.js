import { View, Text, SafeAreaView, TouchableOpacity, StatusBar, Image, TextInput, KeyboardAvoidingView, Platform, FlatList } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import fetchWeatherImages from '../api/fetchWeatherImages';
import { debounce } from 'lodash'
import { fetchCurrentWeather, fetchlocationEndPoint } from '../api/weather';

const Home = () => {
    const [showSearch, toggleSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [weather, setWeather] = useState({});
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        const weatherCondition = weather.current?.condition?.text;
        if (weatherCondition) {
            fetchWeatherImages(weatherCondition).then(urls => {
                setImageUrls(urls);
            }).catch(error => {
                console.error('Error fetching weather images:', error);
            });
        }
    }, [weather]);

    const handleLoc = (loc) => {
        toggleSearch(false);
        setLocations([]);
        fetchCurrentWeather({ cityName: loc.name }).then(data => {
            setWeather(data);
        }).catch(error => {
            console.error('Error fetching current weather:', error);
        });
    }

    const handleSearch = value => {
        if (value.length > 2) {
            fetchlocationEndPoint({ cityName: value }).then(data => {
                setLocations(data);
            }).catch(error => {
                console.error('Error fetching location endpoint:', error);
            });
        }
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
    const { current, location } = weather;

    return (
        <View style={{ flex: 1, backgroundColor: '#6080E2' }}>
            <StatusBar backgroundColor='black' />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, paddingTop:50 }}>
                    <View style={{ padding: 20 }}>
                        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', borderRadius: 999, backgroundColor: showSearch ? 'lightgray' : 'transparent' }}>
                                {showSearch &&
                                    <TextInput
                                        onChangeText={handleTextDebounce}
                                        placeholder="Search city"
                                        placeholderTextColor="black"
                                        style={{ paddingLeft: 16, height: 40, flex: 1, fontSize: 16, color: 'black', backgroundColor: 'transparent' }}
                                    />
                                }
                                <TouchableOpacity
                                    onPress={() => toggleSearch(!showSearch)}
                                    style={{ backgroundColor: 'blue', borderRadius: 50, padding: 8, height: 60, width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Text style={{ color: 'white' }}>Press</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                    {locations?.length > 0 && showSearch && (
                        <View style={{ position: 'absolute', width: '90%', backgroundColor: '#ccc', top: 90, borderRadius: 10, left: 20, height: '76%' }}>
                            {locations.map((loc, index) => (
                                <TouchableOpacity onPress={() => {
                                    handleLoc(loc);
                                    console.log("pressed")
                                }} key={index} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, marginBottom: 8, borderBottomWidth: 1 }}>
                                    <Text>{loc?.name},{loc?.country}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
                <KeyboardAvoidingView style={{ flex: 3 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                    <View style={{ marginLeft: 16, marginRight: 16, display: 'flex', gap: 20, alignItems: 'center', marginTop: showSearch ? 60 : 0 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>{location?.name}</Text>
                            <Text style={{ color: '#ccc', fontSize: 18, fontWeight: '600' }}>{" " + location?.country}</Text>
                        </View>
                        <FlatList
                            horizontal
                            data={imageUrls}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <Image
                                    source={{ uri: item }}
                                    style={{ width: 130, height: 130, marginRight: 10 }}
                                />
                            )}
                        />
                        <View style={{ marginTop: 8 }}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white', fontSize: 48 }}>{current?.temp_c}°</Text>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white', fontSize: 28 }}>{current?.condition?.text}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Image source={require('../assets/icons/wind.png')} style={{ height: 24, width: 24 }} />
                                <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>{current?.wind_kph} km/h</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Image source={require('../assets/icons/drop.png')} style={{ height: 24, width: 24 }} />
                                <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>{current?.humidity}%</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Image source={require('../assets/icons/sun.png')} style={{ height: 24, width: 24 }} />
                                <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>{current?.last_updated}</Text>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    )
}

export default Home
