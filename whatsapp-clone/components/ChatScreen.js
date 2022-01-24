import styled from 'styled-components';
import { useAuthState} from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import { db, auth } from '../firebase'
import { useRouter } from 'next/router';
import { Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import Message from './Message';
import { useRef, useState } from 'react';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';

function ChatScreen({chat, messages}) {

    const [user] = useAuthState(auth);
    const router = useRouter();
    const [input, setInput] = useState('');

    const endOfMessagesRef = useRef(null);

    const [messagesSnapshot] = useCollection(
        db
            .collection('chats')
            .doc(router.query.id)
                .collection('messages')
                .orderBy('timestamp', 'asc'));
    
    const [recipientSnapshot] = useCollection(
        db
            .collection('users')
            .where('email', '==', getRecipientEmail(chat.users, user))
    )
    const showMessages = () => {
        if(messagesSnapshot) { 
            return messagesSnapshot.docs.map(message => (
                <Message 
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime()
                    }}
                />
            ))
        }
        else {
            return JSON.parse(messages).map(message => (
                <Message 
                key={message.id}
                user={message.user}
                message={message}
            />  
            ))
        }
    }

    const scrollToBottom = () =>{
        endOfMessagesRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    const sendMessage = (e) => {
        e.preventDefault();

        // update 'last seen'
        db.collection('users').doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true })

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        })

        setInput('');
        scrollToBottom();
    }
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user);

    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar src={recipient?.photoURL}/>
                )
                :
                (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )
            }

                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>last seen: {' '}
                        {recipient?.lastSeen?.toDate() ? (
                            <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                        ) : "never"}
                        </p>
                    ): (
                    <p>loading last activity... </p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>
            
            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessagesRef}/>
            </MessageContainer>

            <InputContainer>
                <InsertEmoticonIcon />
                <Input value={input} onChange={e => setInput(e.target.value)}/>
                <button hidden disabled ={!input} type='submit' onClick={sendMessage}>Send Message</button>
                <MicIcon />
            </InputContainer>

        </Container>
    )
}

export default ChatScreen

const Container = styled.div``;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index:999;
    top:0;
    display:flex;
    padding:11px;
    border-bottom: 1px solid whitesmoke;
    align-items: center;
`;

const HeaderInformation = styled.div`
    margin-left:15px;
    flex:1;

    >h3 {
        margin-bottom: 3px;
    }
    >p{
        font-size: 14px;
        color: grey;
    }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 100vh;
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 999;
`;

const Input = styled.input`
    flex:1;
    outline:0;
    border:none;
    border-radius: 10px;
    align-items: center;
    padding: 20px;
    background-color: whitesmoke;
    margin-left: 15px;
    margin-right: 15px;
`;