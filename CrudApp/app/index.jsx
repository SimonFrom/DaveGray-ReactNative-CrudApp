import {Text, View, StyleSheet, FlatList, Platform, ScrollView, Pressable, TextInput} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {data} from "@/data/todos";
import { useState, useContext, useEffect } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Roboto_300Light, useFonts } from "@expo-google-fonts/roboto";
import Animated, { LinearTransition } from "react-native-reanimated";
import { ThemeContext } from "@/context/ThemeContext";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StatusBar} from "expo-status-bar";
import { useRouter } from "expo-router";


export default function Index() {
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const styles = createStyles(theme, colorScheme)
    const separatorComp = <View style={styles.separator}/>;
    const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;
    const [text, onChangeText] = useState('');
    const router = useRouter();



    // font import
    const [loaded, error] = useFonts(
        {
            Roboto_300Light,
        }
    )
    const [todos, setTodos] = useState([]);
    // get items on load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem("TodoApp")
                const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

                if (storageTodos != null && storageTodos.length) {
                    setTodos(storageTodos.sort((a,b) => b.id - a.id))
                } else {
                    setTodos(data.sort((a,b) => b.id - a.id))
                }
            }
            catch (error) {
                console.error(error);
            }
        }

        fetchData()
    }, [data])

    // save data
    useEffect(() => {
        const storeData = async () => {
            try {
                const jsonValue = JSON.stringify(todos)
                await AsyncStorage.setItem("TodoApp", jsonValue)
            } catch (error) {
                console.error(error);
            }
        }

        storeData()
    }, [todos])


    const handleCompleted = (id) => {
        setTodos(todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed } : todo))
    }

    const addTodo = (text) => {
        setTodos((prevTodos) => {
            const maxId =
                prevTodos.length === 0
                    ? 0
                    : Math.max(...prevTodos.map((t) => t.id));

            return [
                {
                    id: maxId + 1,
                    title: text,
                    completed: false,
                },
                ...prevTodos,
            ];
        });
    };

    const handleDelete = (id) => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id));
    }

    const handleSubmit = () => {
        if (!text.trim()) return;

        addTodo(text.trim());
        console.log(text);
        onChangeText('');
    };

    const handlePress = (id) => {
        console.log(`Item ${id} was pressed`);
        handleDelete(id);
    };

    const handleEdit = (id) => {
        router.push(`/todos/${id}`)
    }

    // Important to place this after hooks
    if (!loaded && !error) {
        return null
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headline}>TODO LIST</Text>
            <Pressable
                onPress={() =>
                    setColorScheme(colorScheme === 'light'
                    ? 'dark' : 'light')}>
                {colorScheme === 'dark'
                    ? <Octicons name="moon" size={36} width={36} color={theme.text} selectable={undefined}/>
                    : <Octicons name="sun" size={36} width={36} color={theme.text} selectable={undefined}/>
                }
            </Pressable>
            <TextInput
                style={styles.input}
                onSubmitEditing={handleSubmit}
                onChangeText={onChangeText}
                value={text}
                // Limit character amount
                // maxLength={30}
                placeholder="Enter todo item here"
                placeholderTextColor={theme.text}
            />
            <Animated.FlatList
                data={todos}
                itemLayoutAnimation={LinearTransition}
                keyboardDismissMode="on-drag"
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={separatorComp}
                ListEmptyComponent={<Text style={styles.itemText}>No items found</Text>}
                renderItem={({item}) => (
                    <View style={styles.row}>
                        <View style={styles.itemRow}>
                            <Pressable
                                onPress={() => handleEdit(item.id)}
                                onLongPress={() => handleCompleted(item.id)}>
                                <Text
                                    style={[
                                        styles.itemText,
                                        item.completed ? styles.itemTextDone : null
                                    ]}
                                >
                                    {item.title}
                                </Text>
                            </Pressable>
                        </View>
                        <Pressable
                            style={styles.button}
                            onPress={() => handlePress(item.id)}>
                            <Text style={styles.buttonText}><AntDesign name="delete" size={24} color="black"/></Text>
                        </Pressable>
                    </View>
                )}>
            </Animated.FlatList>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaView>
    )
}

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',

            backgroundColor: theme.background,
        },
        headline: {
            flexDirection: 'column',
            backgroundColor: theme.background,
            fontWeight: 'bold',
            fontSize: 26,
            marginHorizontal: 'auto',
            color: theme.text,
            width: '80%',
            textAlign: 'center',
            borderRadius: 5,
            padding: 5
        },
        separator: {
            height: 2,
            backgroundColor: theme.separator,
            width: '90%',
            maxWidth: 310,
            marginHorizontal: 'auto',
            marginTop: 10,
            marginBottom: 10,
        },
        row: {
            flexDirection: 'row',
            width: '80%',
            maxWidth: 300,
            height: "auto",
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'black',
            backgroundColor: 'rgba(221,218,218,0.6)',
            borderRadius: 5,
            overflow: 'hidden',
            marginHorizontal: 'auto',
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.25,
            shadowRadius: 8,
        },
        itemRow: {
            width: '65%',
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            paddingRight: 5,
            flexGrow: 1,
        },
        itemText: {
            fontFamily: 'Roboto_300Light',
            fontSize: 18,
            color: theme.text,
        },
        itemTextDone: {
            textDecorationLine: 'line-through',
            opacity: 0.3,
        },
        buttonText: {
            fontSize: 16,
            color: colorScheme === 'dark' ? 'white' : 'black',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        button: {
            height: 35,
            width: 40,
            borderRadius: 5,
            backgroundColor: theme.button,
            padding: 6,
            marginVertical: 'auto',
            marginRight: 5,
        },
        input: {
            fontFamily: 'Roboto_300Light',
            color: theme.text,
            borderColor: theme.text,
            height: 40,
            margin: 12,
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            fontSize: 18,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.25,
            shadowRadius: 8,
        },
    })
}

