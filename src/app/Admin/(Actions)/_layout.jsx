import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // Choose the icon based on the route name
          const icons = {
            Status: focused ? 'list-circle' : 'list-circle-outline',
            Comments: focused ? 'chatbubbles' : 'chatbubbles-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
         },
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
      })}
    >
      {/* Status Screen */}
      <Tabs.Screen
        name="Status"
        options={{
          tabBarLabel: 'Status',
          headerTitle: 'Update Plate Status',  // Customize the header title
          headerStyle: {
            backgroundColor: '#f8f9fa',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
          },
        }}
      />

      {/* Comments Screen */}
      <Tabs.Screen
        name="Comments"
        options={{
          tabBarLabel: 'Comments',
          headerTitle: 'Edit Plate Comments',  // Customize the header title
          headerStyle: {
            backgroundColor: '#f8f9fa',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
          },
        }}
      />
    </Tabs>
  );
}
