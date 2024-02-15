import { useContext, useEffect, useState, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SSEvent, UserInfo } from "../types/datatypes";

import { Box, Button, CircularProgress } from "@mui/material";

import ShareBar from "../components/ShareBar";
import { deleteEntry } from "../api/entries";
import { getEvent, deleteEvent } from "../api/events";
import { getUser, logOutUser } from "../api/users";
import EventList from "../components/EventsList";
import { CurrentUserContext } from "../contexts/UserContext";
const ConfirmForm = lazy(() => import("../forms/ConfirmForm"));

const UserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [reloadUserPage, setReloadEvent] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const [loading, setLoading] = useState(true);
  const [deleteEntryId, setDeleteEntryId] = useState<number>(1);
  const [deletedEventId, setDeletedEventId] = useState<number>(1);
  const [showDeleteEntryForm, setShowDeleteEntryForm] = useState(false);
  const [showDeleteEventForm, setShowDeleteEventForm] = useState(false);
  const [eventCreated, setEventCreated] = useState<Record<number, SSEvent>>({});
  const [signedUpEvents, setSignedUpEvents] = useState<Record<number, SSEvent>>(
    {}
  );
  const { setUserData } = useContext(CurrentUserContext);

  const navigation = useNavigate();

  const gotToEventsPage = () => {
    const path = "../";
    navigation(path);
  };

  const shareUrl = `${window.location.origin}/#/users/${userId}`;

  useEffect(() => {
    if (userId !== undefined) {
      getUser(userId)
        .then((res) => {
          if ("id" in res) {
            setUserInfo(res);
            res.events.forEach((event) => {
              setEventCreated((prevEvents) => ({
                ...prevEvents,
                [event.id]: event,
              }));
            });
            res.entries.forEach((entry) => {
              getEvent(entry.event_id.toString()).then((event) => {
                if ("id" in event) {
                  setSignedUpEvents((prevEvents) => ({
                    ...prevEvents,
                    [entry.id]: event,
                  }));
                }
              });
            });
          } else {
            if (res.status === 401) {
              setUserInfo(null);
              setUserData(null);
              sessionStorage.removeItem("userData");
            }
          }
        })
        .catch((err) => {
          console.log("and error occurred");
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
          setReloadEvent(false);
        });
    }
  }, [userId, reloadUserPage, setUserData]);

  const logOut = () => {
    logOutUser()
      .then((res) => {
        if ("message" in res) {
          setUserData(null);
          sessionStorage.removeItem("userData");
          gotToEventsPage();
        } else {
          console.log("failed to log out");
        }
      })
      .catch(() => {
        console.log("failed to log out");
      });
  };

  const navigateToEvent = (eventId: number) => {
    const path = `../${eventId.toString()}`;
    navigation(path);
  };

  const onDeleteEvent = (eventId: number) => {
    setDeletedEventId(eventId);
    setShowDeleteEventForm(true);
  };

  const onDeleteEntry = (eventId: number) => {
    userInfo?.entries.forEach((entry) => {
      if (entry.event_id === eventId) {
        setDeleteEntryId(entry.id);
      }
    });
    setShowDeleteEntryForm(true);
  };

  const removeEvent = () => {
    deleteEvent(deletedEventId)
      .then((res) => {
        if ("message" in res) {
          setReloadEvent(true);
          setEventCreated({});
          setSignedUpEvents({});
          setShowDeleteEventForm(false);
        }
      })
      .catch(() => {
        console.log("failed to delete event");
      });
  };

  const removeEntry = () => {
    deleteEntry(deleteEntryId)
      .then((res) => {
        if ("message" in res) {
          setReloadEvent(true);
          setEventCreated({});
          setSignedUpEvents({});
          setShowDeleteEntryForm(false);
        }
      })
      .catch(() => {
        console.log("failed to delete entry");
      });
  };

  if (loading) {
    return (
      <Box className="flex justify-center">
        <CircularProgress />
      </Box>
    );
  } else {
    return userInfo === null ? (
      <div>
        <h1 className="flex justify-center pt-[50px] font-bold text-6xl">
          404
        </h1>
      </div>
    ) : (
      <>
        {showDeleteEventForm && (
          <div className="flex justify-center m-2 py-[120px]">
            <Suspense
              fallback={
                <div className="flex justify-center">
                  <CircularProgress />
                </div>
              }
            >
              <div className="bg-slate-200 mx-[10%] py-5 rounded-md">
                <ConfirmForm
                  title="Delete Event"
                  message={`Are you sure you want to delete "${eventCreated[deletedEventId].name}" event?`}
                  onConfirm={removeEvent}
                  onCancel={() => {
                    setShowDeleteEventForm(false);
                  }}
                />
              </div>
            </Suspense>
          </div>
        )}

        {showDeleteEntryForm && (
          <div className="flex justify-center m-2 py-[120px]">
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
                  message={`Are you sure you want to delete "${signedUpEvents[deleteEntryId].name}" rsvp?`}
                  onConfirm={removeEntry}
                  onCancel={() => {
                    setShowDeleteEntryForm(false);
                  }}
                />
              </div>
            </Suspense>
          </div>
        )}
        {!(showDeleteEntryForm || showDeleteEventForm) && (
          <div>
            <ShareBar
              shareUrl={shareUrl}
              title={`Checkout ${userInfo.name} Profile`}
            />
            <div className="px-[5%] items-center">
              <div className="flex justify-center m-2">
                <div className="bg-slate-200 rounded-md w-full px-[5%] py-[20px]">
                  <div className="flex justify-center text-center pt-[50px] font-bold text-6xl">
                    {userInfo.name}
                  </div>
                  <div className="flex justify-center pt-[50px] font-bold text-3xl">
                    {userInfo.email}
                  </div>
                </div>
              </div>

              <div className="pt-[50px]">
                <h1 className="flex justify-center text-2xl font-bold">
                  Events
                </h1>
                <div className="flex justify-center px-[25%]">
                  <EventList
                    events={userInfo.events}
                    onDelete={onDeleteEvent}
                    navigateToEventPage={navigateToEvent}
                  />
                </div>
              </div>

              <div className="pt-[50px]">
                <h1 className="flex justify-center text-2xl font-bold">
                  Signed Up
                </h1>
                <div className="flex justify-center">
                  <EventList
                    events={Object.values(signedUpEvents)}
                    onDelete={onDeleteEntry}
                    navigateToEventPage={navigateToEvent}
                  />
                </div>
              </div>

              <div className="flex justify-center py-2">
                <Button color="error" variant="contained" onClick={logOut}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
};

export default UserPage;
