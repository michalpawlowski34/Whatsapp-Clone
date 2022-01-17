import styled from 'styled-components'
import Head from 'next/head'
import Sidebar from '../../components/Sidebar'
import ChatScreen from '../../components/ChatScreen'
import { db, auth } from '../../firebase'
import { useAuthState} from "react-firebase-hooks/auth";
import getRecipientEmail from '../../utils/getRecipientEmail'

function ChatPage( {chat, messages} ) {

    const [user] = useAuthState(auth)

    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
            </Head>

            <Sidebar />
            <ChatContainer>
                <ChatScreen />
            </ChatContainer>

        </Container>
    )
}

export default ChatPage

export async function getServerSideProps(context) {
    const ref = db.collection('chats').doc(context.query.id)

    // prepare messages
    const messagesRes = await ref
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .get();

    const messages = messagesRes.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }));

    // prepare the chats
    const chatRes = await ref.get()
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }

    console.log(messages, chat)

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}


const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex:1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none; /*IE, MS Edge */
    scrollbar-width: none; /* Firefox */
`;
