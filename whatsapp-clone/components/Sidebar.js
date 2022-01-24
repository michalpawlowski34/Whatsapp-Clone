import styled from 'styled-components';
import { IconButton, Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from 'email-validator';
import { useAuthState} from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import {auth, db} from '../firebase'
import Chat from '../components/Chat'

function Sidebar() {

    const [user] = useAuthState(auth);
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email)
    const [chatsSnapshot] = useCollection(userChatRef)

    const createChat = () => {

        const input = prompt('Enter an email address for the user you want to chat with')

        if(!input) return;

        if(EmailValidator.validate(input) && input!==user.email && !chatExists(input)){
            db.collection('chats').add({
                users: [user.email, input],
            })
        }
        
    }

    const chatExists = (recipientEmail) => (
        !!chatsSnapshot?.docs.find(chat => chat.data().users.find(user => user=== recipientEmail)?.length > 0)
    )

    return (
        <Container>

            <Header>
                <UserAvatar src={user.photoURL} onClick={()=> auth.signOut()}/>

                <IconsContainer>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </IconsContainer>

            </Header>

            <Search>
                <SearchIcon />
                <SearchInput placeholder="Search in chats"/>
            </Search>

            <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

            {/* List of chats */}
            {chatsSnapshot?.docs.map(chat=>(
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
            ))}

        </Container>
    )
}

export default Sidebar

const Container = styled.div`
    flex:0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;   //IE and Edge
    scrollbar-width: none;  //Firefox
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div``;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
`;

const SearchInput = styled.input`
    border: 0;
    outline-width: 0;
    flex: 1;
`;

const SidebarButton = styled(Button)`
    width: 100%;
    &&&{
        color: black;
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`;