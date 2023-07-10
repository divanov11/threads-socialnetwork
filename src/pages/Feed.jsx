import React, {useEffect, useState} from 'react'
import Thread from '../components/Thread'
import { database, DEV_DB_ID, COLLECTION_ID_THREADS } from '../appwriteConfig'
import { Query } from 'appwrite'
import {useAuth} from '../context/AuthContext'
import ThreadForm from '../components/ThreadForm'

const Feed = () => {
    const [threads, setThreads] = useState([])
    const {user} = useAuth()

    useEffect(() => {
        getThreads()
    }, [])

    const getThreads = async () => {
        const following = user.profile.following

        const response = await database.listDocuments(
            DEV_DB_ID,
            COLLECTION_ID_THREADS,
            [
             Query.orderDesc('$createdAt'),
             Query.equal("owner_id", [...following, user.$id]),
             Query.isNull("parent_id"),
            ]
            )

        setThreads(response.documents)
    }

  return (
    <div>
        <div className="p-4">
            <ThreadForm setThreads={setThreads}/>
        </div>

        {threads.map(thread => (
            <Thread key={thread.$id} thread={thread} setThreads={setThreads}/>
        ))}
    </div>
  )
}

export default Feed
