"use client";
import { Event } from '/src/types/events';
import { showConfirmDialog } from "/src/components/confirm-dialog";

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
    const confirmed = await showConfirmDialog("削除しますか？", true);
    if (!confirmed) return;
    await axios.delete(`http://localhost:3000/events/${id}.json`); // 指定したEventを削除するRailsのAPIを叩いている
    setEvents(events.filter((event) => event.id !== id));
  };

  return (
    <>
      <Typography variant="h4" align="center">
        イベントリスト
      </Typography>
      <TableContainer>
        <Table sx={{ maxWidth: 650 }} align="center">
          <TableHead>
            <TableRow>
              <TableCell>主催者</TableCell>
              <TableCell>開始日時</TableCell>
              <TableCell>場所</TableCell>
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
                      参照
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
                      削除
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
            <Box component="p">主催者: {selectedEvent.name}</Box>
            <Box component="p">開催日時:
              <Moment format="YYYY/MM/DD HH:mm">
                {selectedEvent.start_time}
              </Moment>
            </Box>
            <Box component="p">場所: {selectedEvent.place}</Box>
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