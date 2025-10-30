
import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer class="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500 mt-20">
    <div class="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
        <div class="md:max-w-96">
           <img src={assets.logo} alt="Quick Ai"  className='h-9'  />
            <p class="mt-6 text-sm">
               Experience the power of AI with QuickAi. <br/> Transform your 
               content creation with our suite of premium of AI tools. Write articles,
               genrate images, and enhance your workflow.
            </p>
        </div>
        <div class="flex-1 flex items-start md:justify-end gap-20">
            <div>
                <h2 class="font-semibold mb-5 text-gray-800">Company</h2>
                <ul class="text-sm space-y-2">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About us</a></li>
                    <li><a href="#">Contact us</a></li>
                    <li><a href="#">Privacy policy</a></li>
                </ul>
            </div>
            <div>
                <h2 className="font-semibold text-gray-800 mb-5">Subscribe to our newsletter</h2>
                <div className="text-sm space-y-2">
                    <p>The latest news, articles, and resources, sent to your inbox weekly.</p>
                    <div className="flex items-center gap-2 pt-4">
                        <input className="border border-gray-500/30 placeholder-gray-500 focus:ring-2 ring-indigo-600 outline-none w-full max-w-64 h-9 rounded px-2" type="email" placeholder="Enter your email"/>
                        <button className="bg-primary w-24 h-9 text-white rounded cursor-pointer">Subscribe</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <p class="pt-4 text-center text-xs md:text-sm pb-5">
        Copyright 2025 © Ali. Right Reserved.
    </p>
</footer>
  )
}

export default Footer
