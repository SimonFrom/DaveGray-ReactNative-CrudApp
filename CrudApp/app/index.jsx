import {Text, View, StyleSheet, FlatList, Platform, ScrollView, Pressable, TextInput} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {data} from "@/data/todos";
import React from "react";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Index() {
    const seperatorComp = <View style={styles.seperator}/>;
    const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;
    const [text, onChangeText] = React.useState('');
    const [todos, setTodos] = React.useState(() => [...data].sort((a, b) => b.id - a.id));


    const handleCompleted = (item) => {
        setTodos((prevTodos) => prevTodos.map((t) =>
                t.id === item.id ? {...t, completed: !t.completed} : t
            )
        );
    };

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

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headline}>TODO LIST</Text>
            <TextInput
                style={styles.input}
                onSubmitEditing={handleSubmit}
                onChangeText={onChangeText}
                value={text}
                placeholder="Enter todo item here"
            />
            <FlatList
                data={todos}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={seperatorComp}
                ListEmptyComponent={<Text>No items found</Text>}
                renderItem={({item}) => (
                    <View style={styles.row}>
                        <View style={styles.itemRow}>
                            <Pressable onPress={() => handleCompleted(item)}>
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
            </FlatList>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 30,
    },
    headline: {
        flexDirection: 'column',
        backgroundColor: 'black',
        fontWeight: 'bold',
        fontSize: 26,
        marginHorizontal: 'auto',
        color: 'white',
        width: '80%',
        textAlign: 'center',
        borderRadius: 5,
        padding: 5
    },
    seperator: {
        height: 2,
        backgroundColor: 'rgba(50,30,13,0.5)',
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
        height: 50,
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
        paddingLeft: 10,
        paddingRight: 5,
        flexGrow: 1,
    },
    itemText: {
        fontSize: 18,
    },
    itemTextDone: {
        textDecorationLine: 'line-through',
        opacity: 0.3,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'JetBrains Mono',

    },
    button: {
        height: 35,
        width: 40,
        borderRadius: 5,
        backgroundColor: 'rgba(177,0,0,0.63)',
        padding: 6,
        marginVertical: 'auto',
        marginRight: 5,
    },
    input: {
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

