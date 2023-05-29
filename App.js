import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const App = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  const Item = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <TouchableOpacity
        style={styles.statusButton}
        onPress={() => toggleStatus(item.id)}
      >
        <Text style={styles.statusButtonText}>
          {item.status === 'active' ? 'Mark Done' : 'Mark Active'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const addTodo = () => {
    setCount((prevCount) => prevCount + 1);
    setTodos([
      ...todos,
      { id: count, title, description, status: 'active' },
    ]);
    setTitle('');
    setDescription('');
  };

  const toggleStatus = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, status: todo.status === 'active' ? 'done' : 'active' }
          : todo
      )
    );
  };

  const filterTodos = (todoList) => {
    if (filter === 'active') {
      return todoList.filter((todo) => todo.status === 'active');
    } else if (filter === 'done') {
      return todoList.filter((todo) => todo.status === 'done');
    } else {
      return todoList;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Todo App</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <TouchableOpacity style={styles.addButton} onPress={addTodo}>
        <Text style={styles.addButtonText}>Add Todo</Text>
      </TouchableOpacity>
      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && styles.activeFilterButton,
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'all' && styles.activeFilterButtonText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'active' && styles.activeFilterButton,
          ]}
          onPress={() => setFilter('active')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'active' && styles.activeFilterButtonText,
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'done' && styles.activeFilterButton,
          ]}
          onPress={() => setFilter('done')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'done' && styles.activeFilterButtonText,
            ]}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
      <SafeAreaView style={styles.todoList}>
        <FlatList
          data={filterTodos(todos)}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    width: '80%',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#f9c2ff',
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    padding: 10,
  },
  activeFilterButton: {
    backgroundColor: '#f9c2ff',
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  todoList: {
    flex: 1,
    width: '80%',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
  },
  statusButton: {
    backgroundColor: '#d9d9d9',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
