import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../styles/SignUp.style";
import NavigateBefore from "../components/NavigateBefore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState({ year: "", month: "", day: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const auth = getAuth(); // Firebase Auth 객체
  const firestore = getFirestore(); // Firebase Firestore 객체

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // Firebase Authentication에 이메일 및 비밀번호로 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore에 사용자 데이터 저장
      await setDoc(doc(firestore, "users", user.uid), {
        username,
        nickname,
        email,
        phone,
        birthDate,
        createdAt: new Date().toISOString(), // 생성 시간 추가
      });

      navigation.navigate("LocationScreen"); // 회원가입 후 위치 화면으로 이동
    } catch (error) {
      setErrorMessage(error.message);
      console.error("회원가입 오류:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            top: 20,
            left: 25,
            zIndex: 10,
          }}
        >
          <NavigateBefore />
        </TouchableOpacity>
        <Text style={styles.headerText}>회원가입</Text>
        <View style={styles.rectangle} />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.form}
        enableOnAndroid={true}
        resetScrollToCoords={{ x: 0, y: 0 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>아이디*</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="6자 이상의 영문 혹은 영문과 숫자를 조합"
          placeholderTextColor="#c6c6c6"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>비밀번호*</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="8자 이상의 영문 혹은 영문과 숫자를 조합"
          placeholderTextColor="#c6c6c6"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>비밀번호 확인*</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="비밀번호를 한 번 더 입력해주세요"
          placeholderTextColor="#c6c6c6"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Text style={styles.label}>닉네임*</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="2자 이상의 한글 혹은 한글과 숫자를 조합"
          placeholderTextColor="#c6c6c6"
          value={nickname}
          onChangeText={setNickname}
        />

        <Text style={styles.label}>이메일*</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="예) sunmoon123@sunmoon.kr"
          placeholderTextColor="#c6c6c6"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>휴대폰*</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="숫자만 입력해주세요"
          placeholderTextColor="#c6c6c6"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>생년월일</Text>
        <View style={styles.dropdownContainer}>
          <TextInput
            style={styles.dropdownItem}
            placeholder="년도"
            value={birthDate.year}
            onChangeText={(text) => setBirthDate({ ...birthDate, year: text })}
          />
          <TextInput
            style={styles.dropdownItem}
            placeholder="월"
            value={birthDate.month}
            onChangeText={(text) => setBirthDate({ ...birthDate, month: text })}
          />
          <TextInput
            style={styles.dropdownItem}
            placeholder="일"
            value={birthDate.day}
            onChangeText={(text) => setBirthDate({ ...birthDate, day: text })}
          />
        </View>
      </KeyboardAwareScrollView>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}>가입하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
