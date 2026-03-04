import {useLocalSearchParams} from "expo-router";
import {Text, TextInput, View, StyleSheet, Pressable} from "react-native";
import {useState, useEffect, useContext} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {ThemeContext} from "@/context/ThemeContext";
import {StatusBar} from "expo-status-bar";
import {Roboto_300Light, useFonts} from "@expo-google-fonts/roboto";
import Octicons from "@expo/vector-icons/Octicons";
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";


export default function EditScreen() {
    const {id} = useLocalSearchParams()
    const [todo, setTodo] = useState({})
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const router = useRouter();

    // font import
    const [loaded, error] = useFonts(
        {
            Roboto_300Light
        })


    useEffect(() => {
        const fetchData = async (id) => {
            try {
                const jsonValue = await AsyncStorage.getItem('TodoApp');
                const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

                if (storageTodos && storageTodos.length > 0) {
                    const myTodo = storageTodos.find(todo => todo.id.toString() === id);
                    setTodo(myTodo);
                }
            } catch (e) {
                console.log(e)
            }
        }
        fetchData(id)
    }, [])

    // Important to place this after hooks
    if (!loaded && !error) {
        return null
    }

    const styles = createStyles(theme, colorScheme)

    const handleSave = async () => {
        try {
            const savedTodo = {...todo, title: todo.title}

            const jsonValue = await AsyncStorage.getItem('TodoApp');
            const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;
            if (storageTodos && storageTodos.length > 0) {
                const otherTodos = storageTodos.filter(todo => todo.id !== savedTodo.id);
                const allTodos = [...otherTodos, savedTodo];
                await AsyncStorage.setItem('TodoApp', JSON.stringify(allTodos));
            } else {
                await AsyncStorage.setItem('TodoApp', JSON.stringify([savedTodo]));
            }

            router.push("/");
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Edit Todo"
                    placeholderTextColor={theme.text}
                    value={todo?.title || ''}
                    // Limit character amount
                    // maxLength={30}
                    onChangeText={(text) => setTodo(prev => ({...prev, title: text}))}
                />
                <Pressable
                    onPress={() =>
                    setColorScheme(colorScheme === 'light'
                        ? 'dark' : 'light')}>
                    {colorScheme === 'dark'
                        ? <Octicons name="moon" size={36} width={36} color={theme.text} selectable={undefined}/>
                        : <Octicons name="sun" size={36} width={36} color={theme.text} selectable={undefined}/>
                    }
                </Pressable>
            </View>
            <View style={[styles.inputContainer, { justifyContent: 'space-evenly', alignItems: 'center' }]}>
                <Pressable
                    onPress={handleSave}
                    style={styles.saveBtn}
                >
                    <Text style={styles.saveBtnText}>Save</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push("/")}
                    style={[styles.cancelBtn, {backgroundColor: 'red'}]}
                >
                    <Text style={[styles.cancelBtnText, { color: 'white'}]}>Cancel</Text>
                </Pressable>
            </View>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaView>
    )
}

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            backgroundColor: theme.background,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            gap: 6,
            width: '100%',
            maxWidth: 1024,
            marginHorizontal: 'auto',
            pointerEvents: "auto"
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
        saveBtn: {
            height: 35,
            width: 100,
            borderRadius: 5,
            backgroundColor: theme.button,
            marginVertical: 'auto',
            marginRight: 5,
            alignItems: 'center',
            justifyContent: 'center',
        },
        cancelBtn: {
            height: 35,
            width: 100,
            borderRadius: 5,
            backgroundColor: theme.button,
            marginVertical: 'auto',
            marginRight: 5,
            alignItems: 'center',
            justifyContent: 'center',
        },
        saveBtnText: {
            color: theme.saveText,
            fontFamily: 'Roboto_300Light',
        },
        cancelBtnText: {
            fontFamily: 'Roboto_300Light',
        }
    })
}
