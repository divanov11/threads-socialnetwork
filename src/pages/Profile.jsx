import React, {useState, useEffect}from 'react'
import { useParams } from 'react-router-dom'
import { database, DEV_DB_ID, COLLECTION_ID_THREADS, COLLECTION_ID_PROFILES } from '../appwriteConfig'
import {Query} from 'appwrite'
import Thread from '../components/Thread'
import { useAuth } from '../context/AuthContext'


const Profile = () => {
    const {user} = useAuth()

    const [loading, setLoading] = useState(true)
    const [threads, setThreads] = useState([])
    const [userProfile, setUserProfile] = useState(null)
    const {username} = useParams()
    useEffect(() => {
        getProfile()
        
        
    }, [])

    const getThreads = async (owner_id) => {
        console.log('owner_id:', owner_id)
        const response = await database.listDocuments(
            DEV_DB_ID,
            COLLECTION_ID_THREADS,
            [
             Query.orderDesc('$createdAt'),
             Query.equal('owner_id', owner_id),
             Query.isNull("parent_id"),
            ]
            )
        console.log('response:', response)
        setThreads(response.documents)

        console.log(response.documents)
    }
    
    const getProfile = async () => {
        console.log('GET PROFILE TRIGGERD')
        const data = await database.listDocuments(
            DEV_DB_ID, 
            COLLECTION_ID_PROFILES,
            [
                Query.equal('username', username),
                Query.limit(1)  
            ]
            );
        getThreads(data.documents[0].$id)
        setUserProfile(data.documents[0])
        setLoading(false)
    }

    const toggleFollow = async () => {
        console.log('Follow toggled...')

        const following = user.profile.following 
        const followers = userProfile.followers

        if(following.includes(userProfile.$id)){
            const index = following.indexOf(userProfile.$id)
            following.splice(index, 1)
        }else{
            following.push(userProfile.$id)
        }

        if(followers.includes(user.$id)){
            const index = followers.indexOf(user.$id)
            followers.splice(index, 1)
        }else{
            followers.push(user.$id)
        }

        //Update both users
        const payload1 = {
            'following':following,
        }

        console.log('payload1:', payload1)

        const payload2 = {
            'followers':followers,
            'follower_count':followers.length
        }


        const response1 = await database.updateDocument(
            DEV_DB_ID,
            COLLECTION_ID_PROFILES,
            user.$id,
            payload1
        )
        
        console.log('response1:', response1)


        const response2 = await database.updateDocument(
            DEV_DB_ID,
            COLLECTION_ID_PROFILES,
            userProfile.$id,
            payload2
        )

        setUserProfile(response2)
        
        console.log('response2:', response2)
    }

    if (loading) return

  return (
    <>
        <div className="w-full flex justify-between">
            <div className="py-4">
                <h3 className='text-3xl font-bold '>{userProfile.username}</h3>
                <p>{userProfile.username}</p>

                <div 
                className="py-6"
                >{userProfile.bio}</div>

                <div className="flex gap-2">
                    <p className="text-[rgba(97,97,97,1)]">{userProfile.follower_count} followers</p>
                    {userProfile.link && (
                    <>
                        <p className="text-[rgba(97,97,97,1)]">·</p>
                        <a href={userProfile.link} className="text-[rgba(97,97,97,1)]">{userProfile.link}</a>
                    </>
                    )}
                </div>

            </div>

            <div className="flex flex-col justify-between items-center">

                <img className="w-16 h-16 rounded-full object-cover"
                 src={userProfile.profile_pic}
                 />

                {user.profile.following.includes(userProfile.$id) ? (
                    <button
                    onClick={toggleFollow}
                    className="text-white py-2 px-4 border border-[#fff] text-sm border-black rounded-full"
                    >Following</button>
                ):(
                    <button
                    onClick={toggleFollow}
                    className="bg-white text-black py-2 px-4 border text-sm border-black rounded-full"
                    >Follow</button>
                )}
            </div>
        </div>

      <div>
        {threads.map(thread => (
            <Thread key={thread.$id} thread={thread} setThreads={setThreads}/>
        ))}
      </div>
    </>
  )
}

export default Profile
