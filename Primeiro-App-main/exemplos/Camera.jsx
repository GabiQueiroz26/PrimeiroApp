import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Button } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Linking from 'expo-linking';
import { Share } from 'react-native';

const { width } = Dimensions.get('window');

export default function ExemploCamera() {
  const [tipoCamera, setTipoCamera] = useState(Camera.Constants.Type.back);
  const [permissao, solicitaPermissao] = Camera.useCameraPermissions();
  const [qrCodeData, setQrCodeData] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [exibirCamera, setExibirCamera] = useState(false);
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [linkGerado, setLinkGerado] = useState(null);

  const camera = useRef();

  const iniciarLeitura = () => {
    setQrCodeData(null);
    setExibirCamera(true);
    setMenuVisivel(false);
    setLinkGerado(null);
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setQrCodeData(data);
    setMenuVisivel(true);
    setExibirCamera(false);
    setLinkGerado(data);
  };

  const abrirLink = () => {
    if (qrCodeData) {
      Linking.openURL(qrCodeData);
    }
  };

  const compartilharLink = () => {
    if (qrCodeData) {
      Share.share({
        message: qrCodeData,
      })
      .then(result => {
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            console.log(`Link compartilhado com sucesso através de ${result.activityType}`);
          } else {
            console.log('Link compartilhado com sucesso');
          }
        } else if (result.action === Share.dismissedAction) {
          console.log('Compartilhamento cancelado');
        }
      })
      .catch(error => {
        console.error('Erro ao compartilhar o link:', error);
      });
    }
  };

  const mostrarCamera = () => {
    setExibirCamera(true);
    setMenuVisivel(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {exibirCamera ? (
          <Camera
            ref={camera}
            style={styles.camera}
            type={tipoCamera}
            onBarCodeScanned={handleBarCodeScanned}
          />
        ) : (
          !qrCodeData && (
            <TouchableOpacity
              onPress={mostrarCamera}
              style={styles.buttonWithBorder}
            >
              <Text style={styles.buttonText}>Leia um QR Code</Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {linkGerado && (
        <TouchableOpacity onPress={abrirLink}>
          <Text style={styles.linkText}>Link gerado: {linkGerado}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.menuContainer1}>
        {menuVisivel && (
          <Button
            title="Ler outro QR Code"
            onPress={iniciarLeitura}
          />
        )}
        
        {linkGerado && (
          <Button
            title="Compartilhar Link"
            onPress={compartilharLink}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    width,
  },
  camera: {
    flex: 1,
  },
  menuContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#eee',

  },
  buttonWithBorder: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: 225,
    left: 75,
    backgroundColor: '#2271b3',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  linkText: {
    color: 'blue',
    fontSize: 16,
    padding: 40,
    textAlign: 'center',
  },
});
