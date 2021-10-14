import React, {useState} from 'react'

const NotificationSettings = (props) => {
    const [imgUrl,setImgUrl] = useState('');
    const [uploadedImg, setUploadedImg] = useState(null);

    const handleChange = (e) => {
        if(e.target.files && e.target.files[0]){
            setUploadedImg(e.target.files[0]);
            e.target.value = e.target.files[0].name;
            props.setImgSrc(URL.createObjectURL(e.target.files[0]))
        } else if(e.target.name === 'user_img_url'){
            setImgUrl(e.target.value)
        }
    }

    const handleSubmit = (e) =>{
        props.setImgSrc(imgUrl);
    }

    return <div>
        <form>
            <label>Image URL:</label><br/>
            <input disabled = {uploadedImg} type='text' name='user_img_url' value={imgUrl} onChange={handleChange}/>
            <input disabled = {uploadedImg} type='button' value='Submit' onClick={handleSubmit}/>
            <p>or</p>
            {
                uploadedImg ? 
                    <>
                        <input type='button' name='remove_upload' value='Remove Upload' onClick={()=>setUploadedImg(null)}/>
                        <label>{uploadedImg.name}</label>
                    </>
                :
                    <>
                        <label for='files'>Upload Image:</label><br/>
                        <input type='file' name='user_upload' onChange={handleChange} style={{color: 'rgba(0, 0, 0, 0);'}}/>
                    </>
            }
        </form>
    </div>
}

export default NotificationSettings