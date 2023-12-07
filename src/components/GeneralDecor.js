import React, {useEffect, useState} from 'react';
import Header from './Header';
import ItemDetails from './ItemDetails'
import axios from 'axios'

export const GeneralDecor = () => {
  const [items, setItems] = useState([]);
  const urlSearchParams = new URLSearchParams(`?category=textbooks`);

  useEffect(() => {
    axios.get('https://swampysells-api.onrender.com/getGeneralDecor')
    .then(items => setItems(items.data))
    .catch(err => console.log(err))
  }, [])

  return (
    <>
    <Header /> 
    <div className='items-list'>
      {items && items.map((item)  => (
       <ItemDetails key={item._id} item={item}/>
      ))}
    </div>
    </>
  );
};

