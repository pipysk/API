import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Image, Button, Modal, ImageBackground, ScrollView, TextInput } from 'react-native';


export default function Story({ Username }) {
    const API = 'https://5e64622ea49c2100161069a0.mockapi.io/story'
    const [story, setStory] = useState([]);
    const [listStory, setListStory] = useState(true);
    const [showLoad, setShowLoading] = useState(false);
    // const [showModal,setShowModal]=useState(false);

    //const add
    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [total_chapters, setTotal_chapters] = useState('');
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
            total_chapters: total_chapters
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
        setShowModal(true);
    }

    const handleCancle = () => {
        setShowModal(false);
    }




    //-----------------------------------
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
                        <View>
                            <Image style={{ width: 50, height: 50 }} source={{ uri: item.image }} />
                            <Text>{item.id}</Text>
                            <Text>{item.name}</Text>
                            <Text>{item.category}</Text>
                            <Text>{item.total_chapters}</Text>
                            <Button title='EDIT' onPress={() => showEditModal(item.id)} />
                            <Button title="DELETE" onPress={() => handle_Delete(item.id)} />
                            <Button title="Detail" onPress={() => setShowModal(true)} />

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
                                    {/* <View style={{ flexDirection: 'row' }}>
                                    <Text >{`Tình Trạng`}</Text>
                                    <Text>{`: ${item.status ? "con" : 'Het'}`}</Text>
                                </View> */}
                                    {/* <View style={{ flexDirection: 'column' }}>
                                    <Text >{`Nội dung`}</Text>
                                    <Text style={{ paddingVertical: 10, paddingHorizontal: 20 }}>{`  ${item.content}`}</Text>
                                </View> */}


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
    }
});