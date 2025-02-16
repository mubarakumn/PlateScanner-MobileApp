import React from 'react';
import { Stack, useRouter } from 'expo-router';

export default function AppLayout() {
  const router = useRouter();

  return (
    <Stack initialRouteName='Auth/LoginScreen'>
      <Stack.Screen name="index" options={{
        title: "Home",
        headerStyle: { backgroundColor: "white" },
        headerTintColor: "#007BFF",
      }} />
      {/* <Stack.Screen name="/"  options={{ headerShown: false }} /> */}
      <Stack.Screen name="Auth/LoginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="Auth/SignupScreen" options={{ headerShown: false }} />
      <Stack.Screen name='Admin' options={{ headerShown: false }} />
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
    </Stack>
  );
}
 