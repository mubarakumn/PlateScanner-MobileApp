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
        tabBarActiveTintColor: '#42f44b',  // Active tab color (green)
        tabBarInactiveTintColor: 'gray',   // Inactive tab color (gray)
        tabBarStyle: {
          paddingVertical: 10,
          backgroundColor: '#f8f9fa',
          borderTopWidth: 0.5,
          borderTopColor: '#dcdcdc',
          height: 60,  // Taller tab bar for better look
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
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
