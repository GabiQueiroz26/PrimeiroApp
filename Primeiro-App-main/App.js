import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import ExemploCamera from './exemplos/Camera'


export default function App() {
	return (
		<View style={styles.container}>
			<ExemploCamera />
			<StatusBar style="auto" />
		</View>
	);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
