import React, {useState, useEffect}from 'react'
import { Link } from 'react-router-dom'
import {MoreHorizontal, Heart, Repeat, Send, MessageCircle, Trash2} from 'react-feather'
import { functions, database, DEV_DB_ID, COLLECTION_ID_PROFILES, COLLECTION_ID_COMMENTS } from '../appwriteConfig'

import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import ReactTimeAgo from 'react-time-ago'
import { useAuth } from '../context/AuthContext'

TimeAgo.addDefaultLocale(en)

const Comment = ({comment}) => {
    const [loading, setLoading] = useState(true)
    const [owner, setOwner] = useState(null)
    const [commentInstance, setCommentInstance] = useState(comment)
    
    const {user} = useAuth()

    useEffect(() => {
        getUserInfo()
    }, [])

    const getUserInfo = async () => {
        const payload = {
            "owner_id":comment.owner_id
        }

        const response = await functions.createExecution(
            '64a8dc1f7669cdb5d5d9',//Function ID
            JSON.stringify(payload)
            );

        
        const profile = await database.getDocument(DEV_DB_ID, COLLECTION_ID_PROFILES, comment.owner_id);
        console.log('profile:', profile)
        const userData = JSON.parse(response.response)
        userData['profile_pic'] = profile.profile_pic
        userData['username'] = profile.username
        setOwner(userData)
        setLoading(false)
    }

    const toggleLike = async () => {
        console.log('Liked toggled:', comment)
      

        const users_who_liked = comment.users_who_liked


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
            COLLECTION_ID_COMMENTS,
            comment.$id,
            payload
        )

        setCommentInstance(response)
    }


    if (loading) return 
    

  return (
    <div className="flex p-4">
        
            <img
            className="w-10 h-10 rounded-full object-cover"
            src={owner.profile_pic}
            />
  

        <div className="w-full px-2 pb-4 border-b border-[rgba(49,49,50,1)]">
            {/* Thread header */}
            <div className="flex justify-between gap-2 ">
                <strong>{owner.name}</strong>

                <div className="flex justify-between gap-2 justify items-center cursor-pointer">
                    <p className="text-[rgba(97,97,97,1)]">{<ReactTimeAgo date={new Date(comment.$createdAt).getTime()} locale="en-US"/>}</p>
                    {/* <Trash2 onClick={handleDelete}size={14}/> */}
                </div>
            </div>

            {/* Thread Body */}
            
                <div className="py-4 text-white" style={{whiteSpace:"pre-wrap"}}>
                    {comment.body}

                    {/* {comment.image && (
                        <img className="object-cover border border-[rgba(49,49,50,1)] rounded-md" src={comment.image}/>
                    )} */}
                </div>
        

            <div className="flex gap-4 py-4">
                    <Heart 
                    onClick={toggleLike} 
                    size={22} 
                    className="cursor-pointer"
                    color={commentInstance?.users_who_liked.includes(user.$id) ? '#ff0000' : '#fff' }
                    />
                    
                    {/* <MessageCircle size={22} color={"#fff"}/> */}
                  
                    {/* <Repeat size={22}/>
                    <Send size={22}/> */}
            </div>

            <div className="flex gap-4">
                {/* <p className="text-[rgba(97,97,97,1)]">Replies 16</p>
                <p>·</p> */}
                <p className="text-[rgba(97,97,97,1)]">{commentInstance?.likes} Likes</p>
            </div>
            
        </div>
        </div>
  )
}

export default Comment
