import React, {useState, useEffect, useRef} from 'react'
import Thread from '../components/Thread'
import { useParams } from 'react-router'
import { database, DEV_DB_ID, COLLECTION_ID_THREADS, COLLECTION_ID_COMMENTS } from '../appwriteConfig'
import {ID, Query} from 'appwrite'
import { useAuth } from '../context/AuthContext'
import Comment from '../components/Comment'
import ThreadForm from '../components/ThreadForm'

const ThreadPage = () => {
    const {id} = useParams()
    const [loading, setLoading] = useState(true)

    const [thread, setThread] = useState(null)

    const [comments, setComments] = useState([])

    useEffect(() => {
        getThread()
        getComments()
    }, [id])
    
    const getThread = async () => {
        const response = await database.getDocument(DEV_DB_ID, COLLECTION_ID_THREADS, id)
        setThread(response)
        setLoading(false)
    }

    const getComments = async () => {
      const response = await database.listDocuments(
        DEV_DB_ID, 
        COLLECTION_ID_THREADS,
        [
          Query.orderDesc('$createdAt'),
          Query.equal("parent_id", [id]),
        ]
        )
        setComments(response.documents)
    }

    if(loading) return

  return (
    <>
      <Thread thread={thread}/>

      <div className="p-4">
            <ThreadForm setThreads={setComments} thread_id={id}/>
      </div>

      <div>
        {comments.map(comment => (
          <Thread key={comment.$id} thread={comment} setThreads={setComments}/>
        ))}
      </div>
    </>
  )
}

export default ThreadPage
