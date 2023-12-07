import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate, useParams } from 'react-router-dom';
import Header from "./Header";
import { Buffer } from 'buffer';
//import { useItemDetails } from '../context/ItemProvider';
import axios from "axios"
import { useAuth } from "../context/AuthProvider";

import '../styles/ViewItem.css';

export const ViewItem = () => {
    const [details, setDetails] = useState({});
    const { id } = useParams();
    //const { itemDetails } = useItemDetails();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const retrieveItem = async () => {
            try {
                const response = await fetch(`https://swampysells-api.onrender.com/api/item/${id}`)
                const responseData = await response.json();

                setDetails({
                    title: responseData.title,
                    price: responseData.price,
                    description: responseData.description,
                    image: responseData.image,
                    condition: responseData.condition,
                    sellerId: responseData.user
                    // comments: responseData.comments
                });
                console.log(responseData.image)
                console.log(responseData.image.data);



            } catch (error) {
                console.error('Error with fetching in useEffect', error);
            }
        };
        retrieveItem();
    }, [id]);

    const handleMessageButton = async () => {
       // itemDetails({ sellerId: details.sellerId })

        //get conversations
        var conversations = []; 
        try {
            const res = await axios.get(`https://swampysells-api.onrender.com/api/conversations/${user._id}`);
            console.log("ViewItem: from response", res.data);
            conversations = res.data; 
            console.log("conversations in try statment: ", conversations);
            //setConversations(res.data);
            //console.log("conversations after getting them: ", conversations)
            //return res; 
        }
        catch (err) {
            console.log(err);
        }

        let firstConversation = null; 
        //check if conversation is already present with the seller
        let present = false; 
        conversations.map((c) => {
            if(c.members.includes(details.sellerId)) {
                present = true;
                firstConversation = c; 
            } 
        }); 
        //add if not present
        if(present === false)
        {
            //make post request with conversation
            try {
                const res2 = await axios.post("https://swampysells-api.onrender.com/api/conversations", {"senderId": user._id,"receiverId": details.sellerId,});
            }
            catch(err) {
                console.log(err); 
            }
            //then get conversation so we can set initial state to conversation with the new user that was added 
            try {
                const res = await axios.get(`https://swampysells-api.onrender.com/api/conversations/${user._id}`);
                console.log("ViewItem: from response", res.data);
                conversations = res.data; 
            }
            catch (err) {
                console.log(err);
            }
            conversations.map((c) => {
                if(c.members.includes(details.sellerId)) {
                    firstConversation = c; 
                } 
            });
        }
        console.log("firstConversation", firstConversation); 
        navigate('/inbox', {state: firstConversation});
    }



    return (
        <div>
    <Header />
    <div className="view-item">
        <div className= "item-image-container">
        <img src={details.image} alt="ItemImage" />
        </div>
        <div className="item-details">
            <div className="details">
                <h2 className='item-title'>{details.title}</h2>
                <p className='item-price'>${details.price}</p>
                <p className='item-condition'>Condition: {details.condition}</p>
                <div className='item-description-container'>
                <div style={{display:"flex"}}>
                <p className='item-description'>Description:  </p>
                <div className='item-description-details'>{details.description}</div>  
                </div>
                </div>
                <Button variant="outline-success" 
                    style={{backgroundColor:"#0000FF", color:"white", borderColor:"#0000FF", width:"150px", height:"58px", fontSize:"30px", justifyContent:"center"}}
                    onClick={handleMessageButton}>
                    Message
                </Button>

            </div>
        </div>
        </div>
    </div>
    )
};

//export default ViewItem;