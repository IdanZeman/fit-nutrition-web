import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '../context/AuthContext'; // Import AuthContext hook
import { auth } from '../firebase/firebase-config'; // Firebase config
import { onAuthStateChanged } from 'firebase/auth'; // Firebase Auth

const Dashboard = () => {
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState([]);
  const { userName, setUserName } = useAuth(); // Use global auth context
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);
        fetchGoogleCalendarEvents(user);
        setLoading(false);
      } else {
        setLoading(false);
        console.warn('User is not authenticated');
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [setUserName]);

  const fetchGoogleCalendarEvents = (user) => {

    gapi.client.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY); // Use environment variable
    gapi.client.load('calendar', 'v3', () => {
      gapi.client.calendar.events
        .list({
          calendarId: 'primary',
          timeMin: new Date().toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime',
        })
        .then((response) => {
          if (response.result.items && response.result.items.length > 0) {
            const events = response.result.items.map((event) => ({
              title: event.summary,
              start: new Date(event.start.dateTime || event.start.date),
              end: new Date(event.end.dateTime || event.end.date),
              location: event.location,
              description: event.description,
            }));
            setGoogleCalendarEvents(events);
          } else {
            console.log('No events found');
          }
        })
        .catch((error) => console.error('Error fetching calendar events:', error));
    });
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading until authentication is verified
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-blue-600">Dashboard</h1>

        {userName && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Welcome, {userName}</h2>
            <h3 className="text-lg font-semibold mt-4">Your Google Calendar Events</h3>

            {googleCalendarEvents.length > 0 ? (
              <div className="mt-6">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  events={googleCalendarEvents}
                  eventClick={(info) =>
                    alert(
                      `Event: ${info.event.title}\nDescription: ${info.event.extendedProps.description}`
                    )
                  }
                  eventColor="#378006"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                  }}
                  editable={true}
                />
              </div>
            ) : (
              <p className="mt-4 text-gray-500">No upcoming events found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
