import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Logo from '../components/Logo';
import * as yup from 'yup';
import ErrorMessage from '../components/ErrorMessege'


const Cadastro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const handleSignUp = async () => {
    // Verificação dos campos
    try {
      const schema = yup.object().shape({
        email: yup
          .string()
          .email('Email inválido')
          .required('Email é obrigatório'),
        password: yup
          .string()
          .min(6, 'A senha deve ter pelo menos 6 caracteres')
          .required('Senha é obrigatória'),
        confirmPassword: yup
          .string()
          .oneOf([password], 'As senhas devem corresponder')
          .required('Confirmação de senha é obrigatória'),
      });

      await schema.validate(
        { email, password, confirmPassword },
        { abortEarly: false }
      );
      await AsyncStorage.setItem('userData', JSON.stringify({ email, password }));
      alert('Cadastro realizado com sucesso!');
      setErrors({});
      navigation.navigate('Login')

    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((err) => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
    }
  };


  return (
    <View style={styles.container}>
      <Logo Cadastro />

      <View style={styles.cadastro}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Escolha seu melhor email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Digite uma senha forte"
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirme sua senha"
          secureTextEntry={true}
        />

        <Button title="criar conta" color="#5B3CD7" onPress={handleSignUp} />

        <ErrorMessage message={errors.email} />
        <ErrorMessage message={errors.password} />
        <ErrorMessage message={errors.confirmPassword} />

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#094CCC',
    alignItems: 'center',
  },
  cadastro: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    height: 50,
    width: '80%',
    margin: 12,
    borderWidth: 1,
    backgroundColor: '#fff',
    textAlign: 'center',
    fontSize: 15,
  },
});

export default Cadastro;
