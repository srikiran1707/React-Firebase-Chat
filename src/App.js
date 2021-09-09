import React,{useState,useRef} from 'react';
import './App.css';


import firebase from 'firebase/compat/app'; 
import 'firebase/compat/auth';
import 'firebase/compat/firestore';



import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyB1DTDOtXNaeYR9cFOXntkzAzAjqK-Yzvc",
  authDomain: "vchat-cab1b.firebaseapp.com",
  projectId: "vchat-cab1b",
  storageBucket: "vchat-cab1b.appspot.com",
  messagingSenderId: "1060204596897",
  appId: "1:1060204596897:web:2b39fe7541f76c54fcaae0",
  measurementId: "G-93BVZKXNNS"
})

const auth=firebase.auth();
const firestore = firebase.firestore();


function App() {
  const[user]=useAuthState(auth);
  return (
    <div className="App">
     <header>
        <h1>⚛️💬VCHAT</h1>
        <SignOut />
     </header>
     <section>
       {user?<ChatRoom/>:<SignIn/>}
     </section>
    </div>
  );
}

function SignIn(){
    const signInWithGoogle=()=>{
    const provider=new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
  )
}


function SignOut(){
  return auth.currentUser &&(
<button className="sign-out" onClick={()=>auth.signOut}>Sign Out</button>
  )
}


function ChatRoom(){
  const dummy=useRef();

  const messagesRef=firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const[messages]= useCollectionData(query,{idField:'id'});
  const [formValue,setFormValue]=useState('');

  const sendMessage= async(e)=>{
    e.preventDefault();
    const {uid,photoURL}=auth.currentUser;
    await messagesRef.add(
      {
        text:formValue,
        createdAt:firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      }
    );
    setFormValue('');
    dummy.current.scrollIntoView({behaviour:'smooth'});
  }
  return (
    <>
    <main>
      {messages && messages.map(msg=><ChatMessage key={msg.id} message={msg}/>)}
      <div ref={dummy}>
      </div>
    </main> 
   <form onSubmit={sendMessage}>
     <input value={formValue} onChange={(e)=>setFormValue(e.target.value)} placeholder="Enter your message"/>
    <button type="submit" disabled={!formValue}>Enter</button>
   </form>
    </>
  )
}


function ChatMessage(props){
  const {text,uid,photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (<>
    <div className={'message ${messageClass}'}>
      <img src ={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}/>
      <p>{text}</p>
    </div>
    </>
  )
}




export default App;
