import React, {useEffect, useState, useRef} from 'react'
import { database, storage, DEV_DB_ID, COLLECTION_ID_THREADS, BUCKET_ID_IMAGES } from '../appwriteConfig'
import {Image} from 'react-feather'
import {ID, Query} from 'appwrite'
import {useAuth} from '../context/AuthContext'

const ThreadForm = ({setThreads, thread_id}) => {

    const [threadBody, setThreadBody] = useState('')
    const [theadImg, setThreadImg] = useState(null)
    const fileRef = useRef(null)

    const {user} = useAuth()

    const handleThreadSubmit = async (e) => {
        e.preventDefault()
        
        const payload = {
            "parent_id":thread_id,
            "owner_id":user.$id,
            "body":threadBody,
            "image":theadImg
        }

        const response = await database.createDocument(
            DEV_DB_ID,
            COLLECTION_ID_THREADS,
            ID.unique(),
            payload
        )


        if(thread_id){
            updateCommentCount()
        }

        setThreads(prevState => [response, ...prevState])
        setThreadBody('')
        setThreadImg(null)
    }

    const updateCommentCount = async () => {
        //Get thread comments

        const threadResponse = await database.listDocuments(
            DEV_DB_ID, 
            COLLECTION_ID_THREADS,
            [
              Query.equal("parent_id", [thread_id]),
            ]
            )
        

        const comments = threadResponse.documents
        console.log('comments:', comments.length)

        const payload = {
            "comments":comments.length,
     
        }

        const response = await database.updateDocument(
            DEV_DB_ID,
            COLLECTION_ID_THREADS,
            thread_id,
            payload
        )
    }

    const handleClick = async (e) => {
        fileRef.current.click()
    }

    const handleFileChange = async (e) => {
        const fileObj = e.target.files && e.target.files[0];
        console.log('fileObj:', fileObj)

        if(!fileObj){
            return
        }

        const response = await storage.createFile(
            BUCKET_ID_IMAGES,
            ID.unique(),
            fileObj
        );

        const imagePreview = storage.getFilePreview(BUCKET_ID_IMAGES, response.$id);
        setThreadImg(imagePreview.href)
    }

  return (
    <form onSubmit={handleThreadSubmit}>
        <textarea
            className="rounded-lg p-4 w-full bg-[rgba(29,29,29,1)]"
            required
            name="body"
            placeholder="Say something..."
            value={threadBody}
            onChange={(e) => {setThreadBody(e.target.value)}}
        >
        </textarea>

        <img src={theadImg}/>
        
        <input 
        style={{display:"none"}}
        type="file" 
        ref={fileRef}
        onChange={handleFileChange}
        />

        <div className="flex justify-between items-center border-y py-2 border-[rgba(49,49,50,1)]">
            <Image onClick={handleClick} className="cursor-pointer" size={24} />
            <input className="bg-white text-black py-2 px-4 border text-sm border-black rounded" type="submit" value="Post"/>
        </div>
    </form>
  )
}

export default ThreadForm
