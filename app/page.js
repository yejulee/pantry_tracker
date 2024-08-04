"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from "@mui/material";
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc, } from "firebase/firestore";
import { AddCircleOutline, RemoveCircleOutline, Search } from "@mui/icons-material";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [type, setType] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  const addNewItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      // If item already exists, just increment its quantity
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
    } else {
      // If item does not exist, create a new item with type
      await setDoc(docRef, { quantity: 1, type: type }); // Store type directly
    }
    await updateInventory();
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity, type } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1, type: type }, { merge: true });
    } else {
      console.error(`Item ${item} not found in the inventory.`);
    }
    await updateInventory();
  };
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity, type } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1, type: type }, { merge: true });
      }
    } else {
      console.error(`Item ${item} not found in the inventory.`);
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const newHandleOpen = () => setOpen(true);
  const newHandleClose = () => setOpen(false);
  
  const searchHandleOpen = () => setOpen(true);
  const searchHandleClose = () => setOpen(false);

  return (
    <Box
      width='100vw'
      height='100vh'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      gap={2}
    >
      <Typography variant='h1'>Inventory</Typography>
      <Stack 
        direction='row' 
        spacing={2} 
        overflow={'auto'} 
        sx={{
          width: '100%', 
          justifyContent: 'center'
        }}
      >
        <Button variant="contained" onClick={newHandleOpen}>
          Search<Search/>
        </Button>
        <Button variant="contained" onClick={newHandleOpen}>
          Add New Item
        </Button>
      </Stack>
      <Modal open={open} onClose={newHandleClose}>
        <Box
          position='absolute'
          top='50%'
          left='50%'
          width={800}
          bgcolor='white'
          border='2px solid #000'
          boxShadow={24}
          p={4}
          display='flex'
          flexDirection='column'
          gap={3}
          sx={{
            transform:'translate(-50%,-50%)', 
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id='menu'>Food Type</InputLabel>
                <Select
                  labelId='simple-select-label'
                  id='simple-select'
                  value={type}
                  label='Type'
                  onChange={ (e) => setType(e.target.value) }
                >
                  <MenuItem value={'fruit'}>Fruit</MenuItem>
                  <MenuItem value={'vegetable'}>Vegetable</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button
              variant="outlined"
              onClick={() => { 
                addNewItem(itemName);
                setItemName('');
                setType(''); // Optionally clear type selection
                newHandleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    <Box border={'1px solid #333'}>
      <Box
        width="800px"
        height="50px"
        bgcolor={'#ADD8E6'}
        display={'flex'}
        justifyContent={'flex-end'}
        alignItems={'center'}
        paddingRight='32px'
      > 
      </Box>
      <Stack width="800px" height="300px" overflow={'auto'}>
      {inventory.map(({ name, quantity, type }) => (
        <Box
          key={name}
          width="100%"
          minHeight="50px"
          display={'flex'}
          border='1px dotted #000'
          justifyContent={'space-between'}
          alignItems={'center'}
          bgcolor={'#f0f0f0'}
          paddingX={5}
        >
          <Typography variant={'h6'} color={'#333'} display={'flex'} textAlign={'center'}>
            {name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
          </Typography>
          <Typography variant={'body1'} color={'#666'}>
            {type ? `Type: ${type}` : 'Type: N/A'}
          </Typography>
          <Stack direction='row' spacing={2}>
            <Typography variant={'h6'} color={'#333'} display={'flex'} alignItems={'center'}>
              {quantity}
            </Typography>
            <IconButton color="primary" aria-label="Remove" onClick={() => removeItem(name)}>
              <RemoveCircleOutline />
            </IconButton>
            <IconButton color="primary" aria-label="Add" onClick={() => addItem(name)}>
              <AddCircleOutline />
            </IconButton>
          </Stack>
        </Box>
      ))}
      </Stack>
    </Box>
  </Box>
)
}
