import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    TouchableHighlight,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [count, setCount] = useState(0);
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('all');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);

    useEffect(() => {
        loadTodos();
    }, []);

    useEffect(() => {
        saveTodos();
    }, [todos]);

    const loadTodos = async () => {
        try {
            const storedTodos = await AsyncStorage.getItem('todos');
            if (storedTodos !== null) {
                setTodos(JSON.parse(storedTodos));
            }
        } catch (error) {
            console.log('Error loading todos:', error);
        }
    };

    const saveTodos = async () => {
        try {
            await AsyncStorage.setItem('todos', JSON.stringify(todos));
        } catch (error) {
            console.log('Error saving todos:', error);
        }
    };

    const Item = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('TodoDetails', { todo: item })}
            onLongPress={() => {
                setModalVisible(true);
                setSelectedTodo(item);
            }}
        >
            <Text
                style={[
                    styles.title,
                    item.status === 'done' && styles.doneTitle,
                ]}
            >
                {item.title}
            </Text>
            <Text
                style={[
                    styles.description,
                    item.status === 'done' && styles.doneTitle,
                ]}
            >
                {item.description}
            </Text>
            <TouchableOpacity
                style={styles.statusButton}
                onPress={() => toggleStatus(item.id)}
            >
                <Text style={styles.statusButtonText}>
                    {item.status === 'active' ? 'Mark Done' : 'Mark Active'}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
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
                    ? {
                          ...todo,
                          status: todo.status === 'active' ? 'done' : 'active',
                      }
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

    const deleteTodo = () => {
        setTodos((prevTodos) =>
            prevTodos.filter((todo) => todo.id !== selectedTodo.id)
        );
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
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
                            filter === 'active' &&
                                styles.activeFilterButtonText,
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>
                            Are you sure you want to delete this todo?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableHighlight
                                style={[
                                    styles.modalButton,
                                    styles.cancelButton,
                                ]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={[
                                    styles.modalButton,
                                    styles.deleteButton,
                                ]}
                                onPress={deleteTodo}
                            >
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const TodoDetailsScreen = ({ route }) => {
    const { todo } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.detailsTitle}>{todo.title}</Text>
            <Text style={styles.detailsDescription}>{todo.description}</Text>
        </View>
    );
};

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="TodoDetails"
                    component={TodoDetailsScreen}
                    options={{ title: 'Todo Details' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
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
        marginTop: 10,
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
    doneTitle: {
        textDecorationLine: 'line-through',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        padding: 10,
        borderRadius: 8,
        width: '40%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#d9d9d9',
    },
    deleteButton: {
        backgroundColor: '#ff7f7f',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    detailsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detailsDescription: {
        fontSize: 18,
    },
});

export default App;
