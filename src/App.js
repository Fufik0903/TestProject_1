import './App.css';
import axios from "axios";
import {useEffect, useState} from "react";

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
    ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const API_KEY = '9865008c7b4919885ac9622f63ca8cab40c76847'

function App() {
    const [IP, setIP] = useState()
    const [city, setCity] = useState()
    const regexp = /[^a-zA-Zа-яА-Я]/g
    let [cities, setCities] = useState([])
    let [text, setText] =useState()
    const IPOptions = {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + API_KEY
        }
    }
    //запрос для определения IP пользователя и города пользователя по IP
    axios.get('https://jsonip.com/')
        .then(response => {
            setIP(response.data.ip)
        })
    axios.get(`https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=${IP}`, IPOptions)
        .then(response => {
            setCity(response.data.location.value.slice(1))
        })
    //функция обработки поля ввода
    const textChanged = async (e) => {
        setCities([])
        let query = e.currentTarget.value
        if (!regexp.test(e.currentTarget.value)) {
            setText(e.currentTarget.value)
        }
        //отправка запроса при нажатии клавиши Enter
        if (e.key === 'Enter') {
            const addressOptions = {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Token " + API_KEY
                },
                data: JSON.stringify({query})
            }
            let response = await axios("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", addressOptions)
            const responseArr = await response.data.suggestions
            //добавление найденных по запросу строк в массив с адресами
            responseArr.map(item => {
                setCities(cities=>cities.concat(item.value))

            })
        }
    }
    return (
        <div className="App">
            <div>Ваш IP-адрес: {IP}</div>
            <div>Ваш город: {city}</div>
            <div>
                <Combobox aria-label="choose a fruit">
                    <ComboboxInput onKeyPress={textChanged} onChange={textChanged} value={text}/>
                    <ComboboxPopover>
                        <ComboboxList>
                            {cities.map(city => {
                                return (<ComboboxOption
                                    value={`${city}`}
                                />)
                            })}
                        </ComboboxList>
                    </ComboboxPopover>
                </Combobox>
            </div>
        </div>
    );
}

export default App;
