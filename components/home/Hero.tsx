import React from 'react'
import { useRouter } from "next/navigation"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"

const Hero = () => {

  const router = useRouter()

  const handleCreateNew = () => {
    // This forces a cache invalidation.
    // router.refresh()

    router.push("/create-new")
  }


  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "calc(100vh - 64px)",
      // border: "1px solid black",
      width: "100%",
      px: {
        xs: "2rem",
        sm: "4rem",
        md: "8rem"
      }
    }}>
      <Box sx={{
        display: "inline-block",
        textAlign: "center",
        // border: "1px solid black"
      }}>
      <Typography variant="h1" sx={{
        fontWeight: 700,
      }}>
        Your README.md files for Github, in seconds.
      </Typography>
      <Typography variant="body1" sx={{
  
        textAlign: "center",
        fontWeight: 700,
        fontSize: "24px",
        maxWidth: {sm: "65%"},
        mx: "auto"
      }}>
        Inkspill is the tool for creating markdown documents faster and better.
      </Typography>
      <Button variant="contained" onClick={handleCreateNew} sx={{
        my: 2,
      }} size="small">Create New .md</Button>
      </Box>
      
    </Box>
  )
}

export default Hero