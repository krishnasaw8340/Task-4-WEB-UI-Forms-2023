import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Container, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
export default function MainBody() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('');
  const [framework, setFramework] = useState('');
  const [showdata, setShowData] = useState([]);
  const paperStyle = {
    padding: '50px 20px', width: '90%', margin: "20px auto"
  }
  const handleClick = (e) => {
    e.preventDefault();
    const data = { id, name, language, framework }
    if (!id) {
      alert("Please enter id !")
    }
    else if (!name) {
      alert("Please enter Name !")
    }
    else if (!language) {
      alert("Please enter language !")
    }
    else if (!framework) {
      alert("Please enter framework !")
    }
    else {
      console.log(data);
      fetch("http://localhost:8080/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(() => {
        console.log("Data is added");
        alert("Data is added to Mongodb..")
        setId("")
        setName("")
        setLanguage("")
        setFramework("")
      })
    }
  }
  
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/delete/${id}`)
      .then((response) => {
        window.confirm(`Are you sure want to delete record for id:  ${id}`)
        console.log(`Record with id ${id} deleted`);
        setShowData((prevData) => prevData.filter((d) => d.id !== id));
      })
      .catch((error) => {
        console.error(`Error deleting record with id ${id}:`, error);
      });
  };

  useEffect(() => {
    fetch("http://localhost:8080/")
      .then(res => res.json())
      .then((result) => {
        setShowData(result);
        console.log("Displayed");
      })
  }, [])
  

  return (
    <Container>
      <Paper elevation={3} style={paperStyle}>
        <Box>
          <h2>Create New Record ( save to Mongodb )</h2>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField id="outlined-basic" label="Id" variant="outlined" required
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <TextField id="filled-basic" label="Name" variant="outlined" required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField id="standard-basic" label="Language" variant="outlined" required
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
            <TextField id="standard-basic" label="Framework" variant="outlined" required
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
            />
          </Box>
          <Button variant="contained" endIcon={<SendIcon />}
            onClick={handleClick}
          >
            Send
          </Button>
        </Box>
      </Paper>
      <Paper elevation={3} style={paperStyle}>
        <h3>All Records... ( Fetching from mongodb )</h3>
        {showdata.map(d => (
          <Paper elevation={6} style={{ margin: "10px", padding: "15px", textAlign: "left" }} key={d.id}>
            <Box>
              Id: {d.id}<br />
              Name: {d.name}<br />
              Language: {d.language}<br />
              Framework: {d.framework}<br />

            </Box>
            <Button variant="outlined" startIcon={<DeleteIcon />}
             onClick={() => handleDelete(d.id)} >
              Delete
            </Button>

          </Paper>
        ))}
      </Paper>

    </Container>
  );
}
