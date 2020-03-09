import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Image, Button, Modal, ImageBackground, ScrollView, TextInput, Switch, Alert } from 'react-native';


import StoryItem from './story-item';
import indexjs from './index';
export default function Story({ Username }) {
    const API = 'https://5e64622ea49c2100161069a0.mockapi.io/story'
    const [story, setStory] = useState([]);
    const [listStory, setListStory] = useState(true);
    const [showLoad, setShowLoading] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    // const [showModal,setShowModal]=useState(false);

    //const add
    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [total_chapters, setTotal_chapters] = useState('');
    const [is_full, setIs_full] = useState(true);
    const [isUpdate, setIsUpdate] = useState(false);



    //
    // const [dataStory, setDataStory] = useState(storys);
    const [showModal, setShowModal] = useState(false);
    const fetchStory = () => {
        return fetch(API,
            {

            }).then((res) => res.json())
            .then((resJson) => setStory(resJson))
            .catch((error) => console.log(error));

    };

    useEffect(
        () => { fetchStory() },
        [listStory]
    )
    console.log(story);


    


    // console.log(dataStory);

    //Delete---------
    const deleteStory = (id) => {
        const newStory = story.filter(item => item.id != id);
        setStory(newStory);
    }
    const handle_Detail = (id) => {
        fetch(
            `${API}/${id}`,
            { method: 'GET' }
        ).then((res) => res.json())
            .then((resJson) => setStory(resJson))
            .catch((error) => console.log(error));
    }

    const handle_Delete = (id) => {
        setShowLoading(true);
        deleteStory(id);
        fetch(
            `${API}/${id}`,
            { method: 'DELETE' }
        )
            .then(() => { setShowLoading(false) })
            .catch((error) => console.log(error));
    }
    // Delete----------
    const setModalData = (data) => {
        setName(data.name);
        setCategory(data.category);
        setTotal_chapters(data.total_chapters);
        setImage(data.image);
        setIs_full(data.is_full);
        setIsUpdate(data.id); // set isUpdate = id -> neu co id thi se hieu la true, con k co id thi se la undefined -> hieu la false
    }
    const handleAddSubject = (resJson) => {
        const newStorys = [...story]; // clone subjects, neu clone object -> {...subject}

        return newStorys.push(resJson); // return de gan gia tri duoi phan then
    }

    const handleUpdateSubject = (resJson) => {
        const newStorys = [...story];
        // Tim vi tri item bi thay doi
        const updateSubjectIndex = newStorys.findIndex(item => item.id = resJson.id);
        // Gan item moi cho vi tri do trong array
        newStorys[updateSubjectIndex] = resJson;

        return newStorys;
    }

    const handleSubmit = () => {
        // 1. Hien thi loading va an modal sau khi press submit
        setShowLoading(true);
        setShowModal(false);
        // 2. Khai bao subject duoc them moi kem key value
        const subject = {
            image: image,
            name: name,
            category: category,
            image: image,
            total_chapters: total_chapters,
            is_full: is_full
        };
        // const subject = {
        //     className,
        //     name: subjectName,
        //     logo: logoURL,
        //     identity
        // };
        // 3. Call API de them subject vao db tren server
        const api = isUpdate ? `${API}/${isUpdate}` : API;
        fetch(
            api,
            {
                method: isUpdate ? 'PUT' : 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(subject)
            }
        ).then((res) => res.json())
            .then((resJson) => {
                let newSubjects = [];
                if (isUpdate) {
                    newSubjects = handleUpdateSubject(resJson);
                } else {
                    newSubjects = handleAddSubject(resJson);
                }

                setStory(newSubjects);
                fetchStory();
                setShowLoading(false);
            })
            .catch((error) => console.log(`ERROR: ${error}`));

        setModalData({
            name: '',
            category: '',
            total_chapters: '',
            image: ''
        });
    }

    const showEditModal = (id) => {
        const subject = story.find((item) => item.id == id);

        setModalData(subject);
        console.log(subject);
        setShowModal(true);
    }
    const showDetailModal1 = (id) => {
        const subject = story.find((item) => item.id == id);

        setModalData(subject);
        console.log(subject);
        setShowDetail(true);
    }

    const handleCancle = () => {
        setShowModal(false);
    }

    //-----------------------------------
    const deleteSubject = (id) => {
        const newSubject = story.filter(item => item.id != id);
        setStory(newSubject);
    }

    const handleDelete = (id) => {
        setShowLoading(true);
        deleteSubject(id);
    
        fetch(
            `${API}/${id}`,
            { method: 'DELETE' }
        ).then(() => {
            setShowLoading(false);
        })
            .catch((error) => console.log(error));
    }
    return (
        <View >

            <View style={{
                borderWidth: 1,
                marginTop: 25,
                marginBottom: 10,
                marginHorizontal: 90,
                borderColor: '#424242',
                borderRadius: 20,
                backgroundColor: '#D3D3D3'
            }}>
                <Text style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 30,
                    color: '#424242',
                    fontStyle: 'normal',
                    paddingVertical: 2,
                    color: '#888985'
                }}>{Username}</Text>
                <Button title="ADD" onPress={() => setShowModal(true)} />
            </View>
            {
                showLoad ?
                    <Text>Loading...</Text>
                    : null
            }<View>

                <FlatList
                    data={story}
                    renderItem={({ item }) => (
                        <View style={style.view}>
                            <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={{ uri: item.image }} />
                            <Text>{item.name}</Text>
                            <Text>{item.category}</Text>
                            <Text>{item.total_chapters}</Text>
                            <Text>{item.is_full ? "Con" : "Het"} </Text>
                            <Button title="Edit" onPress={() => showEditModal(item.id)} />
                            <Button title="Delete" onPress={() => handleDelete(item.id)} />
                            <Button title="Detail" onPress={() => showDetailModal1(item.id)} />


                        </View>
                    )}
                    keyExtractor={(item, story) => story}

                />
            </View>

            {/* Show Detal */}
            <View>
                <View>
                    <Modal visible={showModal}>
                        <View style={{ flex: 1, }}>
                            <View>
                                <View style={{
                                    flexDirection: 'row',
                                    borderRadius: 20,
                                }} >
                                    {/* <Image source={{ uri: item.image }}
                                    style={{ width: 50, height: 50, borderRadius: 50 }} /> */}
                                </View>
                                <View style={{
                                    height: '45%',
                                    borderRadius: 20,
                                    margin: 16,
                                    marginTop: 86,
                                    backgroundColor: '#e4e4e4',
                                }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text  >{`Image URL`}</Text>
                                        <TextInput value={image} onChangeText={(value) => setImage(value)} />
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text  >{`Tên Truyện`}</Text>
                                        <TextInput value={name} onChangeText={(value) => setName(value)} />
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text >{`Thể Loại`}</Text>
                                        <TextInput value={category} onChangeText={(value) => setCategory(value)} />
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text >{`So chuong`}</Text>
                                        <TextInput value={total_chapters} onChangeText={(value) => setTotal_chapters(value)} />
                                    </View>
                                    <View>
                                        <Text>{`Tinh trang`}</Text>
                                        <Switch value={is_full} onValueChange={() => setIs_full(!is_full)} />

                                    </View>


                                </View>
                                <Button
                                    title='Submit' onPress={() => handleSubmit()}
                                />
                                <Button
                                    title='Cancle' onPress={() => { setShowModal(false) }}
                                />
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>

            <View>
                <View>
                    <Modal visible={showDetail}>
                        <View style={{ flex: 1, }}>
                            <View>
                                <View style={{
                                    flexDirection: 'row',
                                    borderRadius: 20,
                                }} >
                                    {/* <Image source={{ uri: item.image }}
                                    style={{ width: 50, height: 50, borderRadius: 50 }} /> */}
                                </View>
                                <View style={{
                                    height: '45%',
                                    borderRadius: 20,
                                    margin: 16,
                                    marginTop: 86,
                                    backgroundColor: '#e4e4e4',
                                }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text  >{`Image URL`}</Text>
                                        <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={{ uri: image }} />
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text  >{`Tên Truyện`}</Text>
                                        <Text>{`: ${name}`} </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text >{`Thể Loại`}</Text>
                                        <Text>{`: ${category}`} </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text >{`So chuong`}</Text>
                                        <Text>{`: ${total_chapters}`}</Text>
                                    </View>



                                </View>

                                <Button
                                    title='Cancle' onPress={() => { setShowDetail(false) }}
                                />
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
            {/*  */}
        </View>

    );
}
const style = StyleSheet.create({
    profileContainer: {
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 16,
        width: '100%',
        height: 150,
        padding: 24,
    },
    avatar: {},
    image: {
        width: 200,
        height: 200,
        borderRadius: 200
    },
    view: {
        borderWidth: 1,
        marginVertical: 10,

        borderColor: '#FFFFFF',
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#B2B2B2',
        borderRadius: 20
    }
});