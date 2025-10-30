import  { useState } from 'react'
import {  Hash, Sparkles } from 'lucide-react'
import axios from "axios";
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import { useAuth } from '@clerk/clerk-react';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitle = () => {
  const blogCategory = [
    'General', 'Technology', 'Business', 'Health', 'Lifestyle', 'Education', 'Travel', 'Food'
  ]

  const [selectedCategory, setSelectedCategory] = useState('General')
  const [input, setInput] = useState('')
  const [loading,setLoading]= useState(false);
  const [content,setContent]= useState('');
  const {getToken} = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try{
      setLoading(true);
      const prompt = `Generate an blog title for the keyword ${input} in the category ${selectedCategory}`;

      const {data} = await axios.post('/api/ai/generate-blog-title',{prompt},{
        headers:{Authorization:`Bearer ${await getToken()}`}
     
      })
      if(data.success){
        setContent(data.content);
      }
      else{
        toast.error(data.message);
      }
    }
    catch(err){
      toast.error(err.message)

    }
     setLoading(false);
  }

  return (
    <div className='h-full overflow-y-scroll p-4 sm:p-6 flex flex-col lg:flex-row items-start gap-6 text-slate-700'>
      {/* Left Section */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg p-4 sm:p-6 bg-white rounded-lg border border-gray-200'
      >
        <div className='flex items-center gap-2 sm:gap-3'>
  <Sparkles className='w-5 sm:w-6 flex-shrink-0 text-[#C341F6]' />
  <h1 className='text-lg sm:text-xl font-semibold leading-none sm:leading-normal tracking-tight text-slate-800'>
    AI Title Generator
  </h1>
</div>


        <p className='mt-5 text-sm font-medium'>Keyword</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type='text'
          className='w-full p-2 sm:p-3 mt-2 text-sm rounded-md border border-gray-200 outline-none'
          placeholder='e.g. The future of artificial intelligence...'
          required
        />

        <p className='mt-5 text-sm font-medium'>Category</p>
        <div className='mt-3 flex gap-2 sm:gap-3 flex-wrap'>
          {blogCategory.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 border rounded-full cursor-pointer transition-all ${
                selectedCategory === item
                  ? 'bg-purple-50 text-purple-700 border-purple-300'
                  : 'border-gray-300 text-gray-500'
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <button disabled ={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r 
          from-[#C341F6] to-[#8A37AB] text-white px-4 py-2 sm:py-3 mt-6 text-sm sm:text-base rounded-lg cursor-pointer'
        >
          {loading ?  <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'> </span> : <Hash className='w-4 sm:w-5' /> }
          
          
          Generate Title
        </button>
      </form>

      {/* Right Section */}
      <div className='w-full max-w-lg p-4 sm:p-6 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-2 sm:gap-3'>
          <Hash className='w-5 h-5 text-[#C341F6]' />
          <h1 className='text-lg sm:text-xl font-semibold leading-tight'>
            Generated Titles
          </h1>
        </div>

{ (!content) ? (
  <div className='flex-1 flex justify-center items-center'>
          <div className='text-sm sm:text-base flex flex-col items-center gap-4 sm:gap-5 text-gray-500 text-center'>
            <Hash className='w-8 sm:w-9 h-8 sm:h-9' />
            <p>
              Enter a keyword and click <strong>“Generate Title”</strong> to get started.
            </p>
          </div>
        </div>
) : (<div>
  <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
              <div className="reset-tw">
               <Markdown>
                {content}
                </Markdown>
              </div>
              </div>

</div>
) }
 

        
      </div>
    </div>
  )
}

export default BlogTitle
