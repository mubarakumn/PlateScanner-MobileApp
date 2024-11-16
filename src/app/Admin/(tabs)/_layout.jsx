import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007BFF',  // Active tab color (blue)
        tabBarInactiveTintColor: '#888',  // Inactive tab color (gray)
        tabBarStyle: {
          backgroundColor: '#fff',  // Tab bar background color
          paddingBottom: 5,
        },
        headerStyle: {
          backgroundColor: '#007BFF',  // Header color
        },
        headerTintColor: '#fff',  // Header text/icon color
        headerShown: false,  // Hide the header in all screens by default
      }}
    >
      {/* Register Plate Tab */}
      <Tabs.Screen
        name='RegisterPlate'
        options={{
          title: 'Register Plate',  // Title displayed in the tab
          tabBarIcon: ({ color }) => (
            <Feather name='plus-circle' size={24} color={color} />  // Icon for Register Plate
          ),
        }}
      />

      {/* View Plate Tab */}
      <Tabs.Screen
        name='ViewPlate'
        options={{
          title: 'View Plates',  // Title displayed in the tab
          tabBarIcon: ({ color }) => (
            <Feather name='list' size={24} color={color} />  // Icon for View Plates
          ),
        }}
      />
    </Tabs>
  );
}
