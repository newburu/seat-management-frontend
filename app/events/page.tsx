"use client";
import { Event } from '../../types/Event';

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Box,
  Modal,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import axios from "axios";
import { useEffect, useState } from "react";
import Moment from 'react-moment'

const EventIndex = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/events.json")  // Event全件取得のRailsのAPIを叩いている
      .then((res) => res.json())
      .then((events) => setEvents(events));
  }, []);

  const selectedEvent = events.find((event) => event.id === selectedEventId);

  const handleShowDetails = (id?: number) => setSelectedEventId(id || null);

  const deleteEvent = async (id: number) => {
    await axios.delete(`http://localhost:3000/events/${id}.json`); // 指定したEventを削除するRailsのAPIを叩いている
    setEvents(events.filter((event) => event.id !== id));
  };

  return (
    <>
      <Typography variant="h4" align="center">
        Event List
      </Typography>
      <TableContainer>
        <Table sx={{ maxWidth: 650 }} align="center">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>StartTime</TableCell>
              <TableCell>Place</TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => {
              return (
                <TableRow key={event.id}>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>
                  <Moment format="YYYY/MM/DD HH:mm">
                      {event.start_time}
                  </Moment>
                  </TableCell>
                  <TableCell>{event.place}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleShowDetails(event.id)}
                    >
                      SHOW
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<DeleteForeverIcon />}
                      onClick={() => deleteEvent(event.id)}
                    >
                      DESTROY
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedEvent && (
        <Modal open>
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "lightblue",
              p: 4,
              borderRadius: "0.5em",
            }}
          >
            <Box component="p">Name: {selectedEvent.name}</Box>
            <Box component="p">StartTime:
              <Moment format="YYYY/MM/DD HH:mm">
                {selectedEvent.start_time}
              </Moment>
            </Box>
            <Box component="p">Place: {selectedEvent.place}</Box>
            <Button onClick={() => handleShowDetails()} variant="contained">
              Close ✖️
            </Button>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default EventIndex;