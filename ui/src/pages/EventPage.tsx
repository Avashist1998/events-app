import { useEffect, useState, lazy, Suspense, useContext } from "react";
import { useParams } from "react-router-dom";

import { Box, Button, CircularProgress } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PublicIcon from "@mui/icons-material/Public";
import PublicOffIcon from "@mui/icons-material/PublicOff";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import { getEvent, updateEvent } from "../api/events";
import { addEntry, deleteEntry } from "../api/entries";
import {
  SSEvent,
  EntryBase,
  SSEventBase,
  SSEventBaseOptional,
  SSEventDataOptional,
} from "../types/datatypes";

import EntriesList from "../components/EntriesList";
import ShareBar from "../components/ShareBar";
import { CurrentUserContext } from "../contexts/UserContext";

const ConfirmForm = lazy(() => import("../forms/ConfirmForm"));
const AddEntryForm = lazy(() => import("../forms/AddEntryForm"));
const AddEventForm = lazy(() => import("../forms/AddEventForm"));
const MessageAlert = lazy(() => import("../components/MessageAlert"));

const EventPage = () => {
  const { userData } = useContext(CurrentUserContext);
  const { eventId } = useParams<{ eventId: string }>();
  const [reloadEvent, setReloadEvent] = useState(false);
  const [event, setEvent] = useState<SSEvent | null>(null);

  const [deleteEntryId, setDeleteEntryId] = useState<number | null>(null);
  const [showDeleteEntryForm, setShowDeleteEntryForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [show404, setShow404] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editEvent, setEditEvent] = useState(false);
  const [isEditableEvent, setIsEditableEvent] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [msg404, setMsg404] = useState("Page not found");
  const [addedPlayerMsg, setAddedPlayerMsg] = useState("");

  const submitAddEntry = (newEntry: EntryBase, callback: () => void) => {
    addEntry(newEntry)
      .then((res) => {
        if ("id" in res) {
          setAddedPlayerMsg(
            `Player with email = ${res.user_email} has been added to event with id = ${res.event_id}`
          );
        } else {
          setErrMsg(res.message);
        }
      })
      .catch(() => {
        setErrMsg(
          "Api is currently down, please try again at a different time."
        );
      })
      .finally(() => {
        setReloadEvent(true);
        callback();
      });
  };
  const shareUrl = `${window.location.origin}/#/${eventId}`;

  const onDeleteEntry = (entryId: number) => {
    setDeleteEntryId(entryId);
    setShowDeleteEntryForm(true);
  };

  const removeEntry = () => {
    if (deleteEntryId !== null) {
      deleteEntry(deleteEntryId).then(() => {
        setReloadEvent(true);
        setShowDeleteEntryForm(false);
      });
    }
  };

  const closeForm = () => {
    setShowEntryForm(false);
    setErrMsg("");
    setAddedPlayerMsg("");
  };
  useEffect(() => {
    if (eventId === undefined) {
      setShow404(true);
    } else {
      getEvent(eventId)
        .then((res) => {
          if ("id" in res) {
            setEvent(res);
            if (userData?.email === res.creator) {
              setIsEditableEvent(true);
            }
            setLoading(false);
            setReloadEvent(false);
          } else {
            setShow404(true);
            setLoading(false);
            setMsg404(res.message);
          }
        })
        .catch((err) => {
          console.log("and error occurred");
          console.log(err);
          setShow404(true);
          setReloadEvent(false);
        });
    }
  }, [eventId, reloadEvent, userData]);

  const submitUpdateEvent = (event: SSEventBaseOptional) => {
    if (eventId !== undefined) {
      const updatedEventData = event as SSEventDataOptional;
      updateEvent(eventId, updatedEventData).then((res) => {
        if ("id" in res) {
          setEditEvent(false);
          setReloadEvent(true);
        }
      });
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center">
        <CircularProgress />
      </Box>
    );
  } else {
    if (show404) {
      return (
        <div>
          <h1 className="flex justify-center pt-[50px] font-bold text-6xl">
            404
          </h1>
          <h2 className="flex justify-center pt-[50px] font-bold text-3xl">
            {msg404}
          </h2>
        </div>
      );
    } else {
      return (
        <div className="p-[20px]">
          <ShareBar shareUrl={shareUrl} title={event?.name || ""} />
          <div className="px-[5%] items-center">
            {showDeleteEntryForm ? (
              <Suspense
                fallback={
                  <div className="flex justify-center">
                    <CircularProgress />
                  </div>
                }
              >
                <div className="bg-slate-200 mx-[10%] py-5 rounded-md">
                  <ConfirmForm
                    title="Delete RSVP"
                    message={`Are you sure you want to delete the rsvp?`}
                    onConfirm={removeEntry}
                    onCancel={() => {
                      setShowDeleteEntryForm(false);
                    }}
                  />
                </div>
              </Suspense>
            ) : editEvent ? (
              <Suspense
                fallback={
                  <div className="flex justify-center">
                    <CircularProgress />
                  </div>
                }
              >
                <AddEventForm
                  submitEvent={submitUpdateEvent}
                  event={event as SSEventBase}
                  onCloseForm={() => setEditEvent(false)}
                ></AddEventForm>
              </Suspense>
            ) : (
              <div className="items-center">
                <div className="flex justify-center my-2">
                  <div className="bg-slate-200 rounded-md w-full px-[5%] py-[20px]">
                    <div className="p-2 text-right">
                      <Button
                        startIcon={<EditIcon />}
                        variant="contained"
                        color="primary"
                        disabled={!isEditableEvent}
                        onClick={() => setEditEvent(true)}
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="justify-center flex">
                      <div>
                        <h2 className="font-bold text-5xl p-2 text-center">
                          {event?.name}
                        </h2>
                        <h3 className="text-xl p-2">
                          {" "}
                          Creator: {event?.creator}
                        </h3>
                        <h3 className="text-xl p-2">
                          {" "}
                          Location: {event?.location}
                        </h3>
                        <h3 className="text-xl p-2">
                          {" "}
                          People Limit: {event?.limit}
                        </h3>
                        <h3 className="text-xl p-2">
                          {" "}
                          Total RSVP: {event?.entries.length}
                        </h3>
                        <h3 className="text-lg p-2">
                          RSVP Date:{" "}
                          {new Date(event?.rsvp_date || "").toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              weekday: "long",
                            }
                          )}
                        </h3>
                        <h3 className="text-lg p-2">
                          Event Date:{" "}
                          {new Date(event?.event_date || "").toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              weekday: "long",
                            }
                          )}
                        </h3>
                      </div>
                    </div>
                    <div className="flex justify-end left-0">
                      {event?.public ? <PublicIcon /> : <PublicOffIcon />}
                      {event?.locked ? <LockIcon /> : <LockOpenIcon />}
                    </div>
                  </div>
                </div>
                {showEntryForm ? (
                  <div className="px-[5%] py-[20px]">
                    <Suspense
                      fallback={
                        <div className="flex justify-center">
                          <CircularProgress />
                        </div>
                      }
                    >
                      <AddEntryForm
                        event_id={Number(eventId)}
                        submitAddEntry={submitAddEntry}
                        closeForm={closeForm}
                      >
                        <Suspense
                          fallback={
                            <div className="flex justify-center">
                              <CircularProgress />
                            </div>
                          }
                        >
                          <MessageAlert
                            isError={errMsg !== ""}
                            msg={errMsg === "" ? addedPlayerMsg : errMsg}
                          />
                        </Suspense>
                      </AddEntryForm>
                    </Suspense>
                  </div>
                ) : (
                  <div className="px-[5%] py-[20px]">
                    <EntriesList
                      onDelete={onDeleteEntry}
                      entries={event?.entries || []}
                    >
                      <div className="p-2 text-right">
                        <Button
                          startIcon={<AddIcon />}
                          variant="contained"
                          color="success"
                          onClick={() => {
                            setShowEntryForm(true);
                          }}
                        >
                          SignUp
                        </Button>
                      </div>
                    </EntriesList>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
  }
};

export default EventPage;
