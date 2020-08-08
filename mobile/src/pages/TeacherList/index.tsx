import React, { useState } from 'react';
import {View, ScrollView, Text, TextInput} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import styles from './styles'
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import {Feather} from '@expo/vector-icons'
import api from '../../service/api';


function TeacherList(){

  const [isFilterVisible, setIsFilterVisible] = useState(false)

  const [subject, setSubject] = useState('');
  const [week_day, setWeekDay] = useState('');
  const [time, setTime] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  function loadFavorites() {
    AsyncStorage.getItem('favorites').then(response => {
      if(response) {
        const favoritedTeachers = JSON.parse(response);
        const teachersIds = favoritedTeachers.map((t: Teacher) => t.id)
        setFavorites(teachersIds)
      }
    })
  }
 

  function handleToggleFilterVisible(){
    setIsFilterVisible(!isFilterVisible)
  }

  async function handleFilterSubmit(){
    loadFavorites();

    const response = await api
    .get('classes', {
      params: {
        subject,
        week_day,
        time
      }
    })
    
    setIsFilterVisible(false);
    setTeachers(response.data);
  }

  return (
    <View style={styles.container}>
      <PageHeader 
        title='Proffys Disponíveis'
        headerRight={(
          <BorderlessButton onPress={handleToggleFilterVisible}>
            <Feather name='filter' color='#FFF' size={20}/>
          </BorderlessButton>
        )}>
        { isFilterVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput
              value={subject} 
              onChangeText={text => setSubject(text)}
              style={styles.input}
              placeholder='Qual a matéria'
              placeholderTextColor='#c1bccc'
            />
            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da Semana</Text>
                <TextInput
                  value={week_day} 
                  onChangeText={text => setWeekDay(text)}
                  style={styles.input}
                  placeholder='Qual o dia'
                  placeholderTextColor='#c1bccc'
                />
              </View>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                  value={time} 
                  onChangeText={text => setTime(text)}
                  style={styles.input}
                  placeholder='Qual horário'
                  placeholderTextColor='#c1bccc'
                />
              </View>
            </View>
            <RectButton style={styles.submitButton} onPress={handleFilterSubmit}>
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>
      <ScrollView style={styles.teacherList} contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 16,
        
      }}>
        {teachers.map((teacher: Teacher) => <TeacherItem key={teacher.id} teacher={teacher} favorited={favorites.includes(teacher.id)} />)}
      </ScrollView>
    </View>
  )
}

export default TeacherList;