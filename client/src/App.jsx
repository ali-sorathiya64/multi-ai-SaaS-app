import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Layout from "./pages/Layout"
import WriteArticle from "./pages/WriteArticle"
import BlogTitle from "./pages/BlogTitle"
import GenerateImages from "./pages/GenerateImages"
import RemoveBackground from "./pages/RemoveBackground"
import RemoveObject from "./pages/RemoveObject"
import Community from "./pages/Community"
import { useAuth } from "@clerk/clerk-react"
import { useEffect } from "react"
import {Toaster} from 'react-hot-toast'
import DocumentSummary from "./pages/DocumentSummary"

const App = () => {

  return (
    <div>
      <Toaster/>

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="blog-titles" element={<BlogTitle />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="remove-object" element={<RemoveObject />} />
          <Route path="document-summary" element={<DocumentSummary />} />
          <Route path="community" element={<Community />} />

        </Route>

      </Routes>

    </div>
  )
}

export default App 