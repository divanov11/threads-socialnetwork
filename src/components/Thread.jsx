import React, {useState, useEffect} from 'react'
import {MoreHorizontal, Heart, Repeat, Send, MessageCircle, Trash2} from 'react-feather'
import { functions, database, DEV_DB_ID, COLLECTION_ID_THREADS, COLLECTION_ID_PROFILES } from '../appwriteConfig'
import TimeAgo from 'javascript-time-ago'
import { Link } from 'react-router-dom'

import en from 'javascript-time-ago/locale/en.json'
import ReactTimeAgo from 'react-time-ago'
import { useAuth } from '../context/AuthContext'

TimeAgo.addDefaultLocale(en)

const Thread = ({thread, setThreads}) => {

    const [loading, setLoading] = useState(true)
    const [owner, setOwner] = useState(null)
    const [threadInstance, setThreadInstance] = useState(thread)

    const {user} = useAuth()

    useEffect(() => {
        if(thread?.owner_id){
            getUserInfo()
        }
       
    }, [])

    const getUserInfo = async () => {
        const userData = await database.getDocument(DEV_DB_ID, COLLECTION_ID_PROFILES, thread.owner_id)
        setOwner(userData)
        setLoading(false)
    }

    const handleDelete = async () => {
        setThreads(prevState => prevState.filter(item => item.$id !== thread.$id) )

        database.deleteDocument(DEV_DB_ID, COLLECTION_ID_THREADS, thread.$id)
        console.log('Thread was deleted!')
    }

    const toggleLike = async () => {
        console.log('Liked toggled')

        const users_who_liked = thread.users_who_liked


        if(users_who_liked.includes(user.$id)){
            const index = users_who_liked.indexOf(user.$id)
            users_who_liked.splice(index, 1)
        }else{
            users_who_liked.push(user.$id)
        }

        const payload = {
            'users_who_liked':users_who_liked,
            'likes':users_who_liked.length
        }

        const response = await database.updateDocument(
            DEV_DB_ID,
            COLLECTION_ID_THREADS,
            thread.$id,
            payload
        )

        setThreadInstance(response)
    }

    
    if(loading) return 

  return (
    <div className="flex p-4">
    <Link to={`/profile/${owner.username}`}>
        <img
        className="w-10 h-10 rounded-full object-cover"
        src={owner.profile_pic}
        />
     </Link>

   <div className="w-full px-2 pb-4 border-b border-[rgba(49,49,50,1)]">
       {/* Thread header */}
       <div className="flex justify-between gap-2 ">
           <strong>{owner.name}</strong>

           <div className="flex justify-between gap-2 justify items-center cursor-pointer">
               <p className="text-[rgba(97,97,97,1)]">{<ReactTimeAgo date={new Date(thread.$createdAt).getTime()} locale="en-US"/>}</p>
               <Trash2 onClick={handleDelete}size={14}/>
           </div>
       </div>

       {/* Thread Body */}
       <Link to={`/thread/${thread.$id}`}>
        <div className="py-4 text-white" style={{whiteSpace:"pre-wrap"}}>
            {thread.body}

            {thread.image && (
                <img className="object-cover border border-[rgba(49,49,50,1)] rounded-md" src={thread.image}/>
            )}
        </div>
       </Link>

       <div className="flex gap-4 py-4">
            <Heart 
            onClick={toggleLike} 
            size={22} 
            className="cursor-pointer"
            color={threadInstance.users_who_liked.includes(user.$id) ? '#ff0000' : '#fff' }
            />
            <Link to={`/thread/${thread.$id}`}>
                <MessageCircle size={22} color={"#fff"}/>
            </Link>
            <Repeat size={22}/>
            <Send size={22}/>
       </div>

       <div className="flex gap-4">
           <p className="text-[rgba(97,97,97,1)]">Replies {threadInstance.comments}</p>
           <p>·</p>
           <p className="text-[rgba(97,97,97,1)]">{threadInstance.likes} Likes</p>
       </div>
    
   </div>
 </div>
  )
}

export default Thread
