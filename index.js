import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet, FlatList, Modal, Image, Switch, Button } from 'react-native';
import { registerRootComponent } from 'expo'; // higherOrder component

function App() {
    const [subjects, setSubjects] = useState([]);
    const [showList, setShowList] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [className, setClassName] = useState("");
    const [SubjectName, setSubjectName] = useState("");
    const [logoURL, setLogoURL] = useState("");
    const [identity, setIdentity] = useState("");
    const [showLoading, setShowLoading] = useState(false);


    const API = 'https://5e5a60986a71ea0014e61d88.mockapi.io/api/subjects';
    // Dinh nghia ham xu ly cong viec call API

    const fetchSubjects = () => {
        return fetch(
            API, // api
            {} // object khai bao method, header(kieu du lieu gui len, kieu du lieu nhan ve), body(data gui len)
        )

            .then((response) => response.json())
            .then((responseJson) => { setSubjects(responseJson) })
            .catch((error) => console.log(error));
    };

    useEffect(

        // tham so 1: la 1 arrow function chua cac xu ly lien quan den API
        // tham so 2: la 1 mang, chua cac item la cac bien co su thay doi,
        // neu thay doi thi moi goi tiep cai ham o tham so 1

        () => { fetchSubjects(); }
        , [showList]
        // Neu tham so thu 2 la array, khong co item nao thi se chi chay 1 lan
        // Neu co thi se kiem tra su thay doi va neu thay doi thi goi lai arrow function
        // Hien tai khi state showList thay doi thi arrow function o tren chua call lai du da render lai roi
        // Gia su neu phan trang va click thi state luu page se thay doi nhung api lay du lieu trang moi van chua goi
    )

    const deleteSubject = (id) => {
        const newSubject = subjects.filter.apply(item => item.id != id)
        setSubjects(newSubject);
    }


    const handleDelete = (id) => {
        console.log(id, 'SubjectID');
        deleteSubject(id);
        fetch(
            `${API}/${id}`, //goi den API xoa. 
            { method: 'DELETE' }
        ).then(() => { console.log(111) })
            // .then((responseJson) => { setSubjects(responseJson) })
            .catch((error) => console.log(error));

    }

    console.log(subjects);





    const handleSubmit = () => {

        setShowLoading(true);
        setShowModal(false);
        const subject = {
            className: className,
            name: SubjectName,
            logo: logoURL,
            identity: identity
        };

        const newsubjects = subjects.push(subject);
        setSubjects(newsubjects);

        //call api them subject len sever
        fetch(
            API,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(subject)

            }
        ).then((response) => response.json)
            .then((response) => {
                const newSubjects = [...subjects];
                newSubjects.push(responseJson);
                setSubjects(newSubjects);
                setShowLoading(false)
            }
            )
            .catch((error) => console.log(`Error: ${error}`))

    }

    const handleCancle = () => {
        setShowModal(false);
    }
    return (
        <View style={styles.container}>
            <Text>List subject</Text>
            <Switch value={showList} onValueChange={() => setShowList(!showList)} />
            {
                showLoading
                    ? <Text>LOADING...</Text>
                    : null
            }
            <Button title="ADD SUBJECT" onPress={() => setShowModal(true)} />
            {showList ?
                <FlatList
                    data={subjects}
                    renderItem={({ item }) =>
                        <View>
                            <Text>{item.id}</Text>
                            <Text>{item.identity}</Text>
                            <Text>{item.name}</Text>
                            <Text>{item.className}</Text>
                            <Image style={styles.logo} source={{ uri: item.logo }} />
                            <Button title="Delete" onPress={() => handleDelete(item.id)} />

                        </View>

                    }
                    keyExtractor={(item, index) => item.id}
                />
                : null}
            <View>
                <Modal visible={showModal}>
                    <View>
                        <Text>Class Name</Text>
                        <TextInput value={className} onChangeText={(value) => setClassName(value)} />
                    </View>
                    <View>
                        <Text>Subject Name</Text>
                        <TextInput value={SubjectName} onChangeText={(value) => setSubjectName(value)} />
                    </View>
                    <View>
                        <Text>Logo (Input Image URL)</Text>
                        <TextInput value={logoURL} onChangeText={(value) => setLogoURL(value)} />
                    </View>
                    <View>
                        <Text>identity Name</Text>
                        <TextInput value={identity} onChangeText={(value) => setIdentity(value)} />
                    </View>
                    <View>
                        <Button title="Submit" onPress={() => handleSubmit()} />
                        <Button title="Cancle" onPress={() => handleCancle()} />
                    </View>
                </Modal>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        marginTop: 100,
        flex: 1,
        alignItems: "center",
        justifyContent: 'center'
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 50
    }
});

export default registerRootComponent(App);