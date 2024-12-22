import { Stack } from "expo-router";

function _layout() {
  return (
    <Stack
      initialRouteName="Admindash"
      screenOptions={{
        headerStyle: { backgroundColor: "white" },  // Consistent header styling
        headerTintColor: "#007BFF",  // White text/icons for header
        headerShown: true, 
      }}
    >
      {/* Admin Dashboard */}
      <Stack.Screen
        name="Admindash"
        options={{
          title: "Admin Dashboard",  // Title for Admin Dashboard
        }}
      />

      {/* Tab Navigation */}
      <Stack.Screen
        name="(tabs)"
        options={{
          title: "Plate Services",  // Title for the Tabs screen
        }}
      />

      {/* Actions Screen */}
      <Stack.Screen
        name="(Actions)"
        options={{
          title: "Quick Actions",  // Title for Quick Actions
        }}
      />
    </Stack>
  );
}

export default _layout;
