import { useState, useEffect } from 'react'
import { Eraser, Sparkles, MoreVertical, Download } from 'lucide-react'
import axios from "axios"
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [menuOpen, setMenuOpen] = useState(false); // for dropdown
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('image', input);

      const { data } = await axios.post(
        '/api/ai/remove-image-background',
        formData,
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

 
  const handleDownload = () => {
    if (!content) return;
    const link = document.createElement('a');
    link.href = content;
    link.download = 'background-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.menu-wrapper')) setMenuOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div className='h-full overflow-y-scroll p-4 sm:p-6 flex flex-col lg:flex-row items-start gap-6 text-slate-700'>
      {/* Left Section */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg p-4 sm:p-6 bg-white rounded-lg border border-gray-200'
      >
        <div className='flex items-center gap-2 sm:gap-3'>
          <Sparkles className='w-5 sm:w-6 flex-shrink-0 text-[#FF4938]' />
          <h1 className='text-lg sm:text-xl font-semibold leading-none sm:leading-normal tracking-tight text-slate-800'>
            Background Removal
          </h1>
        </div>

        <p className='mt-5 text-sm font-medium'>Upload image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type='file'
          accept='image/*'
          className='w-full p-2 sm:p-3 mt-2 text-sm rounded-md border border-gray-200 outline-none text-gray-600'
          required
        />

        <p className='text-xs text-gray-500 font-light mt-1'>
          Supports JPG, PNG, and other image formats
        </p>

        <button
          disabled={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r 
          from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 sm:py-3 mt-6 text-sm sm:text-base rounded-lg cursor-pointer'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
          ) : (
            <Eraser className='w-4 sm:w-5' />
          )}
          Remove Background
        </button>
      </form>

      {/* Right Section */}
      <div className='w-full max-w-lg p-4 sm:p-6 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 sm:gap-3'>
            <Eraser className='w-5 h-5 text-[#FF4938]' />
            <h1 className='text-lg sm:text-xl font-semibold leading-tight'>
              Processed Image
            </h1>
          </div>

          {/* Three-dot menu button */}
          {content && (
            <div className='relative menu-wrapper'>
              <button
                type='button'
                onClick={() => setMenuOpen(!menuOpen)}
                className='p-1 rounded-full hover:bg-gray-100 transition'
              >
                <MoreVertical className='w-5 h-5 text-gray-600' />
              </button>

              {menuOpen && (
                <div className='absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-md z-10'>
                  <button
                    onClick={handleDownload}
                    className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left'
                  >
                    <Download className='w-4 h-4' /> Download
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm sm:text-base flex flex-col items-center gap-4 sm:gap-5 text-gray-500 text-center'>
              <Eraser className='w-8 sm:w-9 h-8 sm:h-9' />
              <p>
                Upload an image and click <strong>“Remove Background”</strong> to get started.
              </p>
            </div>
          </div>
        ) : (
          <img src={content} alt='image' className='mt-3 w-full h-full rounded-md' />
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
