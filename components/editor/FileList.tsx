import React, {useEffect, useState} from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Link from "next/link"
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import MailIcon from '@mui/icons-material/Mail';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { appActions } from "@/store/app-slice";
import { useSession, signIn, signOut } from "next-auth/react";
import Button from "@mui/material/Button"
import { useRouter } from "next/router"
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FileOptions from '@/components/editor/FileOptions';
import { FileType } from '@/types/editor';
import FileMore from '@/components/editor/FileMore';



export default function FileList() {
  const theme = useTheme();
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useDispatch()
  const app = useSelector((state: RootState) => state.app)
  const {viewSettings, fileList, markdown, markdownSelected} = app
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openOptions = Boolean(anchorEl);



  const handleCloseOptions = () => {
    setAnchorEl(null);
    setSelectedFile(null)
  };
  
  

  const handleOpenFile = (id: string, title: string) => {

    console.log("before 2", id)
    if (markdownSelected !== id) {
     
      console.log("afore")
      
      router.push({
        pathname: '/editor/[markdown-id]',
        query: {
          'markdown-id' : router.query['markdown-id'],
        },
      }, 
      `/editor/${title.split(" ").join("-")}-${id}`,
      {
        shallow: true
      })
        
      
      dispatch(appActions.updateMarkdownSelected(id))
      
    } 
    
  }

  

  
  

  useEffect(() => {

      if (session) {
        const getFileList = async () => {
          setLoadingFiles(true)
          const response = await fetch("/api/db/get-user-md-ids", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: session.user.id
            })
          })

          setLoadingFiles(false)
          
          if (!response?.ok) {
            if (response.status === 402) {
              return <>fAILED</>
            }
      
            return <>Failed</>
          }

          const files = await response.json()
           
          dispatch(appActions.updateFileList(files))  
            
        }

        getFileList()
      }
      
  }, [])



  return (
    
   <>
  <List sx={{
    mb: 4,
      px: "4px",
      marginLeft: 0,
    //   border: "1px solid blue",
    }}>
     {fileList.map((file, index) => (
       <ListItem key={file.id} disablePadding sx={{
          //  border: "1px solid red",
           p: 0,
           m: 0,
          marginLeft: 0,
          paddingLeft: 0,
          borderRadius: "4px",
           bgcolor: (markdownSelected === file.id) ? "grey.A300" : "",
           "&:hover": {
            bgcolor: "grey.A100"
           }
       }}>
         <ListItemButton sx={{
          //  border: "1px solid blue",
          //  p: "4px",
          px: 1,
           m: 0,
           cursor: "pointer",
           borderRadius: "4px",
          
         }} onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          console.log("before")
          e.stopPropagation();
          handleOpenFile(file.id, file.title)
          }}>
           <ListItemIcon sx={{
          //  border: "1px solid blue",
           p: 0,
           margin: 0,
           
           mr: 1,
           minWidth: "0"

         }}>
             {<ChevronRightRoundedIcon  />}
           </ListItemIcon>
           <ListItemText primary={<Typography variant="body2" sx={{
            fontWeight: 500,

           }}>{file.title}</Typography>} sx={{
          //  border: "1px solid blue",
           p: 0,
           m: 0,
         }} />
         
        
         
         </ListItemButton>

         <FileMore file={file} />
       </ListItem>
     ))}
   </List>
   
   </>
  );
}
