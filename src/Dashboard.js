import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

const Dashboard = () => {
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState([]);
  const [userName, setUserName] = useState('');

  // Load Google API client and fetch the user's calendar events on page load
  useEffect(() => {
    const loadGapi = () => {
      console.log('Loading Google API client...');
      
      gapi.load('client:auth2', () => {
        console.log('Google API client loaded');
        
        gapi.auth2.init({
          client_id: '343844114401-jeib4l5iajupdu4jf12upqu3g9f7t0fv.apps.googleusercontent.com', // Replace with your Google client ID
        }).then(() => {
          console.log('GoogleAuth initialized');
          const GoogleAuth = gapi.auth2.getAuthInstance();
          const currentUser = GoogleAuth.currentUser.get();

          if (currentUser.isSignedIn()) {
            console.log('User is signed in');
            setUserName(currentUser.getBasicProfile().getName());
            fetchGoogleCalendarEvents(currentUser);
          } else {
            console.error('User is not authenticated');
          }
        }).catch((error) => {
          console.error('Error initializing GoogleAuth:', error);
        });
      });
    };

    loadGapi();
  }, []);

  // Fetch calendar events from Google Calendar API
  const fetchGoogleCalendarEvents = (currentUser) => {
    const accessToken = currentUser.getAuthResponse().access_token;
    console.log('Access Token:', accessToken);
    
    gapi.client.setApiKey('AIzaSyBjW_Vp33XtTmap04sHExi2bEuNBaDYR0I'); // Replace with your API key
    gapi.client.load('calendar', 'v3', () => {
      console.log('Google Calendar API loaded');
      
      const request = gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(), // Fetch only future events
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });

      request.execute((response) => {
        console.log('Response from Google Calendar API:', response);

        if (response.error) {
          console.error('Error fetching calendar events:', response.error);
          return;
        }

        if (response.items && response.items.length > 0) {
          console.log('Fetched calendar events:', response.items);
          const events = response.items.map((event) => ({
            title: event.summary,
            date: new Date(event.start.dateTime || event.start.date),
            location: event.location,
            description: event.description,
          }));
          setGoogleCalendarEvents(events);
        } else {
          console.log('No events found');
        }
      });
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-blue-600">Dashboard</h1>

        {userName && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Welcome, {userName}</h2>
            <h3 className="text-lg font-semibold mt-4">Your Google Calendar Events</h3>
            <div className="mt-4">
              {googleCalendarEvents.length > 0 ? (
                <ul>
                  {googleCalendarEvents.map((event, index) => (
                    <li key={index} className="py-2">
                      <div className="font-bold">{event.title}</div>
                      <div>{event.date.toLocaleString()}</div>
                      {event.location && <div>Location: {event.location}</div>}
                      {event.description && <div>Description: {event.description}</div>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No upcoming events.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;