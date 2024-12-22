import { Tabs } from 'expo-router';
import React from 'react';
import { Feather } from '@expo/vector-icons';
function _layout() {
  return (
    <Tabs>
        <Tabs.Screen name='PlateScan' options={{
            tabBarIcon: ({color})=>{
                return <Feather name='camera' size={24} color={color}/>
            },
            tabBarLabel: "Scan",
            headerTitle:"Scanner",
            headerStyle:{ backgroundColor: "white"},
            headerTintColor:"#007BFF"
        }}/>
        <Tabs.Screen name='PlateDetailsScreen' options={{
            tabBarIcon: ({color})=>{
                return <Feather name='list' size={24} color={color}/>
            },
            tabBarLabel: "Get Details",
            headerTitle:"Details",
            headerStyle:{ backgroundColor: "white"},
            headerTintColor:"#007BFF"
        }}/>
    </Tabs>
  )
}

export default _layout